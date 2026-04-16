[CmdletBinding()]
param(
  [string]$ConfigPath,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptRoot = if (-not [string]::IsNullOrWhiteSpace($PSScriptRoot)) {
  $PSScriptRoot
}
elseif ($MyInvocation.MyCommand.Path) {
  Split-Path -Parent $MyInvocation.MyCommand.Path
}
else {
  (Get-Location).Path
}

if ([string]::IsNullOrWhiteSpace($ConfigPath)) {
  $ConfigPath = Join-Path $scriptRoot "..\deploy\all-inkl.config.json"
}

function Get-ConfigValue {
  param(
    [Parameter(Mandatory = $true)]
    [pscustomobject]$Config,
    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  $value = $Config.$Name
  if ([string]::IsNullOrWhiteSpace([string]$value)) {
    throw "Missing config value: $Name"
  }

  return [string]$value
}

function Join-RemoteUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$UrlScheme,
    [Parameter(Mandatory = $true)]
    [string]$RemoteHost,
    [Parameter(Mandatory = $true)]
    [int]$Port,
    [Parameter(Mandatory = $true)]
    [string]$RemotePath,
    [Parameter(Mandatory = $true)]
    [string]$RelativePath
  )

  $basePath = ($RemotePath -replace "\\", "/").Trim()
  if (-not $basePath.StartsWith("/")) {
    $basePath = "/$basePath"
  }
  $basePath = $basePath.TrimEnd("/")

  $remoteSegments = @()
  foreach ($segment in ($RelativePath -replace "\\", "/").Split("/")) {
    if ($segment) {
      $remoteSegments += [Uri]::EscapeDataString($segment)
    }
  }

  $encodedRelativePath = [string]::Join("/", $remoteSegments)
  return "{0}://{1}:{2}{3}/{4}" -f $UrlScheme, $RemoteHost, $Port, $basePath, $encodedRelativePath
}

function Get-RelativePathCompat {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BasePath,
    [Parameter(Mandatory = $true)]
    [string]$TargetPath
  )

  $normalizedBasePath = [System.IO.Path]::GetFullPath($BasePath)
  if (-not $normalizedBasePath.EndsWith([System.IO.Path]::DirectorySeparatorChar.ToString())) {
    $normalizedBasePath += [System.IO.Path]::DirectorySeparatorChar
  }

  $baseUri = [Uri]$normalizedBasePath
  $targetUri = [Uri]([System.IO.Path]::GetFullPath($TargetPath))
  $relativeUri = $baseUri.MakeRelativeUri($targetUri)
  return [Uri]::UnescapeDataString($relativeUri.ToString()) -replace "/", "\"
}

$resolvedConfigPath = [System.IO.Path]::GetFullPath($ConfigPath)
if (-not (Test-Path -LiteralPath $resolvedConfigPath)) {
  throw "Config file not found: $resolvedConfigPath"
}

$config = Get-Content -LiteralPath $resolvedConfigPath -Raw | ConvertFrom-Json
$protocol = Get-ConfigValue -Config $config -Name "protocol"
$remoteHost = Get-ConfigValue -Config $config -Name "host"
$username = Get-ConfigValue -Config $config -Name "username"
$password = Get-ConfigValue -Config $config -Name "password"
$remotePath = Get-ConfigValue -Config $config -Name "remotePath"

$port = if ($config.port) { [int]$config.port } else { 21 }
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot ".."))
$configuredLocalPath = if ($config.localPath) { [string]$config.localPath } else { "server" }
$resolvedLocalPath = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $configuredLocalPath))

if (-not (Test-Path -LiteralPath $resolvedLocalPath)) {
  throw "Local deploy path not found: $resolvedLocalPath"
}

$protocol = $protocol.ToLowerInvariant()
if ($protocol -notin @("ftp", "ftps")) {
  throw "Unsupported protocol '$protocol'. Use ftp or ftps."
}

$urlScheme = "ftp"

$curlPath = (Get-Command curl.exe -ErrorAction Stop).Source
$files = Get-ChildItem -LiteralPath $resolvedLocalPath -Recurse -File | Sort-Object FullName

if ($files.Count -eq 0) {
  throw "No files found in deploy path: $resolvedLocalPath"
}

Write-Host "Deploy source: $resolvedLocalPath"
if ($protocol -eq "ftps") {
  Write-Host ("Deploy target: explicit FTPS via ftp://{0}:{1}{2}" -f $remoteHost, $port, $remotePath)
}
else {
  Write-Host ("Deploy target: ftp://{0}:{1}{2}" -f $remoteHost, $port, $remotePath)
}
Write-Host "Files to upload: $($files.Count)"

$uploaded = 0
foreach ($file in $files) {
  $relativePath = Get-RelativePathCompat -BasePath $resolvedLocalPath -TargetPath $file.FullName
  $remoteUrl = Join-RemoteUrl -UrlScheme $urlScheme -RemoteHost $remoteHost -Port $port -RemotePath $remotePath -RelativePath $relativePath

  if ($DryRun) {
    Write-Host "[DRY RUN] $relativePath -> $remoteUrl"
    continue
  }

  $curlArgs = @(
    "--silent",
    "--show-error",
    "--fail",
    "--ftp-pasv",
    "--ftp-create-dirs",
    "--user", "$username`:$password",
    "-T", $file.FullName,
    $remoteUrl
  )

  if ($protocol -eq "ftps") {
    $curlArgs = @("--ssl-reqd") + $curlArgs
  }

  & $curlPath @curlArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Upload failed for $relativePath"
  }

  $uploaded += 1
  Write-Host "Uploaded [$uploaded/$($files.Count)] $relativePath"
}

if ($DryRun) {
  Write-Host "Dry run finished."
}
else {
  Write-Host "Deploy finished."
}
