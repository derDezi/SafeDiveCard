const schemaVersion = "1.0";
const state = createDefaultState();

const form = document.getElementById("form");
const statusEl = document.getElementById("status");
const cardEl = document.getElementById("card");
const mapPreviewEl = document.getElementById("mapPreview");
const toolTitleGroupEl = document.getElementById("toolTitleGroup");
const toolBrandLogoEl = document.getElementById("toolBrandLogo");
const fileInput = document.getElementById("jsonFileInput");
const downloadJsonBtn = document.getElementById("downloadJsonBtn");
const diveSiteFileInput = document.getElementById("diveSiteFileInput");
const downloadDiveSiteBtn = document.getElementById("downloadDiveSiteBtn");
const diverFileInput = document.getElementById("diverFileInput");
const printBtn = document.getElementById("printBtn");
const locateAddressBtn = document.getElementById("locateAddressBtn");
const clearDiveSiteLookupBtn = document.getElementById("clearDiveSiteLookupBtn");
const addDiverBtn = document.getElementById("addDiverBtn");
const diversContainer = document.getElementById("diversContainer");
const optionalExtraLanguageSelect = document.getElementById("optionalExtraLanguage");
const autoLocalInfo = document.getElementById("autoLocalInfo");
const countryOverrideContinentSelect = document.getElementById("countryOverrideContinent");
const countryOverrideCountryField = document.getElementById("countryOverrideCountryField");
const countryOverrideCountrySelect = document.getElementById("countryOverrideCountry");
const langSupportNote = document.getElementById("langSupportNote");
const toastContainer = document.getElementById("toastContainer");
const altitudeDiveNote = document.getElementById("altitudeDiveNote");
const elevationUnitSelect = document.getElementById("elevationUnit");
const maxDepthUnitSelect = document.getElementById("maxDepthUnit");
const decoBeerModal = document.getElementById("decoBeerModal");
const decoBeerCloseBtn = document.getElementById("decoBeerCloseBtn");
const TOAST_DURATION_MS = 10000;
const BREATHING_GAS_OTHER_VALUE = "__other__";
const PRESET_BREATHING_GASES = ["Air", "EAN32 (Nitrox 32)", "EAN36 (Nitrox 36)", "EAN40 (Nitrox 40)"];
const FEET_PER_METER = 3.28084;
const MEASUREMENT_FIELDS = {
  elevation: {
    inputName: "dive_site.elevation_m",
    unitName: "ui.elevation_unit",
    selectEl: elevationUnitSelect
  },
  maxDepth: {
    inputName: "plan.max_depth_m",
    unitName: "ui.max_depth_unit",
    selectEl: maxDepthUnitSelect
  }
};
let shouldOpenDecoBeerModalAfterPrint = false;
let previousDocumentTitle = document.title;
let mapPreviewDiveSite = null;
let shouldClearInitialDiveSiteAddress = false;
const COUNTRY_OVERRIDE_OPTIONS = {
  europe: [
    { code: "de", label: "Germany (DE)" },
    { code: "es", label: "Spain (ES)" },
    { code: "fr", label: "France (FR)" },
    { code: "it", label: "Italy (IT)" },
    { code: "pt", label: "Portugal (PT)" },
    { code: "nl", label: "Netherlands (NL)" },
    { code: "pl", label: "Poland (PL)" }
  ],
  africa: [
    { code: "eg", label: "Egypt (EG)" },
    { code: "ma", label: "Morocco (MA)" },
    { code: "tn", label: "Tunisia (TN)" },
    { code: "dz", label: "Algeria (DZ)" }
  ],
  asia: [
    { code: "sa", label: "Saudi Arabia (SA)" },
    { code: "ae", label: "United Arab Emirates (AE)" }
  ]
};

const FULLY_TRANSLATED = new Set(["de", "es", "ar", "fr", "it"]);
const LANGUAGE_LABEL = {
  en: "English",
  de: "Deutsch",
  es: "Espanol",
  fr: "Francais",
  it: "Italiano",
  pt: "Portugues",
  nl: "Nederlands",
  pl: "Polski",
  ar: "Arabic"
};
const LOCAL_LANGUAGE_BY_COUNTRY = {
  de: "de",
  at: "de",
  ch: "de",
  es: "es",
  mx: "es",
  ar: "es",
  co: "es",
  fr: "fr",
  it: "it",
  pt: "pt",
  br: "pt",
  nl: "nl",
  pl: "pl",
  eg: "ar",
  sa: "ar",
  ae: "ar",
  ma: "ar",
  tn: "ar",
  dz: "ar"
};

const ALL_ISO_COUNTRY_CODES = new Set("ad ae af ag ai al am ao aq ar as at au aw ax az ba bb bd be bf bg bh bi bj bl bm bn br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cr cu cv cw cx cy cz de dj dk dm do dz ec ee eg eh er es et fi fj fk fo fr ga gb gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu id ie il im in io iq is it je jm jo jp ke kg kh ki km kn kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc me mf mg mh ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pe pf pg ph pk pl pm pn pr pt pw py qa re ro rs ru rw sa sb sc sd se sg si sj sk sl sm sn so sr ss st sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt tv ua ug um us uy uz va vc vn vu wf ws ye yt za zm zw".split(" "));

const VERIFIED_EMERGENCY_NUMBER_BY_COUNTRY = {
  us: "911",
  ca: "911",
  au: "000",
  nz: "111",
  gb: "999",
  gg: "999",
  je: "999",
  im: "999",
  ie: "112",
  at: "112",
  be: "112",
  bg: "112",
  hr: "112",
  cy: "112",
  cz: "112",
  dk: "112",
  ee: "112",
  fi: "112",
  fr: "112",
  de: "112",
  gr: "112",
  hu: "112",
  is: "112",
  it: "112",
  lv: "112",
  lt: "112",
  lu: "112",
  mt: "112",
  nl: "112",
  no: "112",
  pl: "112",
  pt: "112",
  ro: "112",
  sk: "112",
  si: "112",
  es: "112",
  se: "112",
  ch: "112",
  li: "112",
  tr: "112",
  in: "112"
};

const I18N_EXTRA_TRANSLATIONS = {
  input_title: { fr: "Saisie", it: "Inserimento" },
  btn_import_json: { fr: "Charger donnees plongee", it: "Carica dati immersione" },
  btn_export_json: { fr: "Enregistrer donnees plongee", it: "Salva dati immersione" },
  btn_export_pdf: { fr: "Exporter PDF", it: "Esporta PDF" },
  dive_site: { fr: "Site de plongee", it: "Sito di immersione" },
  name: { fr: "Nom", it: "Nome" },
  address: { fr: "Adresse", it: "Indirizzo" },
  btn_locate_address: { fr: "Localiser l'adresse", it: "Trova indirizzo" },
  elevation_m: { fr: "Altitude", it: "Altitudine" },
  latitude_decimal: { fr: "Latitude (decimal)", it: "Latitudine (decimale)" },
  longitude_decimal: { fr: "Longitude (decimal)", it: "Longitudine (decimale)" },
  dive_base_phone: { fr: "Telephone base de plongee", it: "Telefono base immersione" },
  dive_base_website: { fr: "Site web base de plongee", it: "Sito web base immersione" },
  oxygen_location: { fr: "Emplacement oxygene", it: "Posizione ossigeno" },
  local_emergency_number: { fr: "Numero urgence local", it: "Numero emergenza locale" },
  emergency_phone_location: { fr: "Emplacement telephone urgence", it: "Posizione telefono emergenza" },
  chamber_info: { fr: "Informations caisson hyperbare", it: "Informazioni camera iperbarica" },
  dive_plan: { fr: "Plan de plongee", it: "Piano immersione" },
  summary: { fr: "Resume", it: "Riepilogo" },
  max_depth_m: { fr: "Profondeur max", it: "Profondita massima" },
  divers: { fr: "Plongeurs", it: "Subacquei" },
  btn_add_diver: { fr: "Ajouter plongeur", it: "Aggiungi subacqueo" },
  card_preview: { fr: "Apercu carte", it: "Anteprima scheda" },
  card_title: { fr: "CARTE D'URGENCE", it: "SCHEDA DI EMERGENZA" },
  where: { fr: "Ou", it: "Dove" },
  what: { fr: "Quoi", it: "Cosa" },
  who: { fr: "Qui", it: "Chi" },
  site: { fr: "Site", it: "Sito" },
  coordinates: { fr: "Coordonnees", it: "Coordinate" },
  plan: { fr: "Piano", it: "Piano" },
  max_depth: { fr: "Profondeur max", it: "Profondita max" },
  sex: { fr: "Sexe", it: "Sesso" },
  birth: { fr: "Naissance", it: "Nascita" },
  dives: { fr: "Plongees", it: "Immersioni" },
  certifications: { fr: "Certifications", it: "Certificazioni" },
  gas: { fr: "Gaz", it: "Gas" },
  allergies: { fr: "Allergies", it: "Allergie" },
  conditions: { fr: "Pathologies medicales", it: "Condizioni mediche" },
  medications: { fr: "Medicaments", it: "Farmaci" },
  health_ins: { fr: "Assureur sante", it: "Fornitore assicurazione sanitaria" },
  dive_ins: { fr: "Assur. plongee", it: "Assic. immersione" },
  member_no: { fr: "N. membre", it: "N. membro" },
  hotline: { fr: "Hotline", it: "Hotline" },
  emergency_contact: { fr: "Contact urgence", it: "Contatto emergenza" },
  own_phone: { fr: "Tel. personnel", it: "Telefono personale" },
  not_provided: { fr: "Non indique", it: "Non indicato" },
  no_map_data: { fr: "Aucune adresse/coordonnee pour la carte.", it: "Nessun indirizzo/coordinata per la mappa." },
  open_large_map: { fr: "Ouvrir la grande carte", it: "Apri mappa grande" },
  open_search_map: { fr: "Ouvrir la mappa di ricerca", it: "Apri mappa di ricerca" },
  precise_marker_hint: { fr: "utiliser \"Localiser l'adresse\" pour un marqueur precis.", it: "usa \"Trova indirizzo\" per un marker preciso." }
};

const RAW_TRANSLATIONS = {
  fr: {
    "Diver": "Plongeur",
    "Remove": "Supprimer",
    "Full Name": "Nom complet",
    "Sex (M/F/X)": "Sexe (M/F/X)",
    "Birth Date": "Date de naissance",
    "Dive Count": "Nombre de plongees",
    "Certifications (comma separated)": "Certifications (separees par virgule)",
    "Breathing Gas": "Gaz respiratoire",
    "Allergies (comma separated)": "Allergies (separees par virgule)",
    "Medical Conditions (comma separated)": "Pathologies medicales (separees par virgule)",
    "Medications (comma separated)": "Medicaments (separes par virgule)",
    "Health Insurance Provider": "Assureur sante",
    "Dive Insurance Provider": "Fournisseur assurance plongee",
    "Dive Insurance Member No": "Numero membre assurance plongee",
    "Dive Insurance Hotline": "Hotline assurance plongee",
    "Emergency Contact Name": "Nom contact urgence",
    "Emergency Contact Relation": "Lien contact urgence",
    "Emergency Contact Phone": "Telephone contact urgence",
    "Divers in Group": "Plongeurs dans le groupe",
    "Who (cont.)": "Qui (suite)",
    "Sex": "Sexe",
    "Birth / Age": "Naissance / Age",
    "Dive Count": "Nombre de plongees",
    "Breathing Gas": "Gaz respiratoire",
    "Emergency Contact": "Contact urgence",
    "Health Insurance Provider": "Assureur sante",
    "Dive Insurance": "Assurance plongee",
    "Own Phone": "Telephone personnel"
  },
  it: {
    "Diver": "Subacqueo",
    "Remove": "Rimuovi",
    "Full Name": "Nome completo",
    "Sex (M/F/X)": "Sesso (M/F/X)",
    "Birth Date": "Data di nascita",
    "Dive Count": "Numero immersioni",
    "Certifications (comma separated)": "Certificazioni (separate da virgola)",
    "Breathing Gas": "Gas respiratorio",
    "Allergies (comma separated)": "Allergie (separate da virgola)",
    "Medical Conditions (comma separated)": "Condizioni mediche (separate da virgola)",
    "Medications (comma separated)": "Farmaci (separati da virgola)",
    "Health Insurance Provider": "Fornitore assicurazione sanitaria",
    "Dive Insurance Provider": "Fornitore assicurazione immersione",
    "Dive Insurance Member No": "Numero membro assicurazione immersione",
    "Dive Insurance Hotline": "Hotline assicurazione immersione",
    "Emergency Contact Name": "Nome contatto emergenza",
    "Emergency Contact Relation": "Relazione contatto emergenza",
    "Emergency Contact Phone": "Telefono contatto emergenza",
    "Divers in Group": "Subacquei nel gruppo",
    "Who (cont.)": "Chi (segue)",
    "Sex": "Sesso",
    "Birth / Age": "Nascita / Eta",
    "Dive Count": "Numero immersioni",
    "Breathing Gas": "Gas respiratorio",
    "Emergency Contact": "Contatto emergenza",
    "Health Insurance Provider": "Fornitore assicurazione sanitaria",
    "Dive Insurance": "Assicurazione immersione",
    "Own Phone": "Telefono personale"
  }
};

initializeCallerStartAddress(state);

const I18N = {
  header_subtitle: { en: "Create an emergency dive card for a safe dive.", de: "Erstelle eine Notfall-Tauchkarte fuer einen sicheren Tauchgang.", es: "Crea una tarjeta de emergencia para un buceo seguro.", fr: "Creez une carte d'urgence de plongee pour une plongee sure.", it: "Crea una scheda di emergenza per un'immersione sicura.", ar: "انشئ بطاقة طوارئ للغوص من اجل غوص امن." },
  input_title: { en: "Input", de: "Eingabe", es: "Entrada", ar: "الادخال" },
  btn_import_json: { en: "Load Dive Data", de: "Tauchdaten laden", es: "Cargar datos de buceo", ar: "تحميل بيانات الغوص" },
  btn_export_json: { en: "Save Dive Data", de: "Tauchdaten speichern", es: "Guardar datos de buceo", ar: "حفظ بيانات الغوص" },
  btn_export_pdf: { en: "Export PDF", de: "PDF exportieren", es: "Exportar PDF", ar: "تصدير PDF" },
  additional_language: { en: "Additional language", de: "Zusatzsprache", es: "Idioma adicional", ar: "لغة اضافية" },
  dive_site: { en: "Dive Site", de: "Tauchplatz", es: "Lugar de buceo", ar: "موقع الغوص" },
  name: { en: "Name", de: "Name", es: "Nombre", ar: "الاسم" },
  address: { en: "Address", de: "Adresse", es: "Dirección", ar: "العنوان" },
  btn_locate_address: { en: "Locate Address", de: "Adresse lokalisieren", es: "Localizar dirección", ar: "تحديد العنوان" },
  elevation_m: { en: "Elevation", de: "Höhe", es: "Altitud", ar: "الارتفاع" },
  latitude_decimal: { en: "Latitude (decimal)", de: "Breitengrad (dezimal)", es: "Latitud (decimal)", ar: "خط العرض (عشري)" },
  longitude_decimal: { en: "Longitude (decimal)", de: "Längengrad (dezimal)", es: "Longitud (decimal)", ar: "خط الطول (عشري)" },
  dive_base_phone: { en: "Dive Base Phone", de: "Telefon Tauchbasis", es: "Teléfono base de buceo", ar: "هاتف مركز الغوص" },
  dive_base_website: { en: "Dive Base Website", de: "Webseite Tauchbasis", es: "Web base de buceo", ar: "موقع مركز الغوص" },
  oxygen_location: { en: "Oxygen Location", de: "Standort Sauerstoff", es: "Ubicación de oxígeno", ar: "مكان الاكسجين" },
  local_emergency_number: { en: "Local Emergency Number", de: "Lokale Notrufnummer", es: "Numero local de emergencia", ar: "رقم الطوارئ المحلي" },
  emergency_phone_location: { en: "Emergency Phone Location", de: "Standort Notruftelefon", es: "Ubicación teléfono de emergencia", ar: "مكان هاتف الطوارئ" },
  chamber_info: { en: "Hyperbaric Chamber Information (Address and Emergency Contact Phone)", de: "Informationen zur Druckkammer (Adresse und Notfall-Telefonnummer)", es: "Informacion de camara hiperbárica (direccion y telefono de emergencia)", ar: "معلومات غرفة الضغط (العنوان ورقم هاتف الطوارئ)" },
  dive_plan: { en: "Dive Plan", de: "Tauchplan", es: "Plan de buceo", ar: "خطة الغوص" },
  summary: { en: "Dive Plan Summary (for example: number of days, planned dives per day, special conditions)", de: "Zusammenfassung des Tauchplans (zum Beispiel: Anzahl der Tage, geplante Tauchgaenge pro Tag, besondere Bedingungen)", es: "Resumen del plan de buceo (por ejemplo: numero de dias, inmersiones planificadas por dia, condiciones especiales)", ar: "ملخص خطة الغوص (على سبيل المثال: عدد الايام والغوصات المخطط لها يوميا والظروف الخاصة)" },
  max_depth_m: { en: "Max Depth", de: "Maximaltiefe", es: "Profundidad máxima", ar: "اقصى عمق" },
  divers: { en: "Divers", de: "Taucher", es: "Buzos", ar: "الغواصون" },
  btn_add_diver: { en: "Add Diver", de: "Taucher hinzufügen", es: "Añadir buzo", ar: "اضافة غواص" },
  card_preview: { en: "Card Preview", de: "Kartenvorschau", es: "Vista previa de tarjeta", ar: "معاينة البطاقة" },
  card_title: { en: "EMERGENCY CARD", de: "NOTFALLKARTE", es: "TARJETA DE EMERGENCIA", ar: "بطاقة طوارئ" },
  where: { en: "Where", de: "Wo", es: "Dónde", ar: "اين" },
  what: { en: "What", de: "Was", es: "Qué", ar: "ماذا" },
  who: { en: "Who", de: "Wer", es: "Quién", ar: "من" },
  site: { en: "Site", de: "Ort", es: "Sitio", ar: "الموقع" },
  coordinates: { en: "Coordinates", de: "Koordinaten", es: "Coordenadas", ar: "الاحداثيات" },
  plan: { en: "Plan", de: "Plan", es: "Plan", ar: "الخطة" },
  max_depth: { en: "Max Depth", de: "Max. Tiefe", es: "Prof. máxima", ar: "العمق الاقصى" },
  sex: { en: "Sex", de: "Geschlecht", es: "Sexo", ar: "الجنس" },
  birth: { en: "Birth", de: "Geburt", es: "Nacimiento", ar: "الميلاد" },
  dives: { en: "Dives", de: "Tauchgänge", es: "Inmersiones", ar: "الغوصات" },
  certifications: { en: "Certifications", de: "Zertifizierungen", es: "Certificaciones", ar: "الشهادات" },
  gas: { en: "Gas", de: "Gas", es: "Gas", ar: "الغاز" },
  allergies: { en: "Allergies", de: "Allergien", es: "Alergias", ar: "الحساسية" },
  conditions: { en: "Medical Conditions", de: "Medizinische Vorerkrankungen", es: "Condiciones medicas", ar: "الحالات الطبية" },
  medications: { en: "Medications", de: "Medikamente", es: "Medicamentos", ar: "الادوية" },
  health_ins: { en: "Health Insurance Provider", de: "Krankenversicherer", es: "Proveedor del seguro medico", ar: "مزود التأمين الصحي" },
  hyperbaric_chamber: { en: "Hyperbaric Chamber", de: "Druckkammer", es: "Camara hiperbárica", ar: "غرفة الضغط" },
  dive_ins: { en: "Dive Ins.", de: "Tauchvers.", es: "Seguro buceo", ar: "تامين الغوص" },
  member_no: { en: "Member No", de: "Mitglied-Nr.", es: "N.º socio", ar: "رقم العضوية" },
  hotline: { en: "Hotline", de: "Hotline", es: "Línea directa", ar: "الطوارئ" },
  emergency_contact: { en: "Emergency Contact", de: "Notfallkontakt", es: "Contacto emergencia", ar: "جهة اتصال طارئة" },
  own_phone: { en: "Own Phone", de: "Eigene Nummer", es: "Teléfono propio", ar: "رقم الهاتف" },
  not_provided: { en: "Not provided", de: "Nicht angegeben", es: "No indicado", ar: "غير متوفر" },
  no_map_data: { en: "No address/coordinates for map preview.", de: "Keine Adresse/Koordinaten für Kartenvorschau.", es: "Sin dirección/coordenadas para vista de mapa.", ar: "لا يوجد عنوان او احداثيات لمعاينة الخريطة." },
  open_large_map: { en: "Open larger map", de: "Größere Karte öffnen", es: "Abrir mapa grande", ar: "افتح خريطة اكبر" },
  open_search_map: { en: "Open search map", de: "Suchkarte öffnen", es: "Abrir mapa de búsqueda", ar: "افتح خريطة البحث" },
  precise_marker_hint: { en: "use \"Locate Address\" for a precise marker.", de: "\"Adresse lokalisieren\" für präzisen Marker nutzen.", es: "usa \"Localizar dirección\" para un marcador preciso.", ar: "استخدم تحديد العنوان للحصول على مؤشر دقيق." }
};

hydrateFormFromState(state);
elevationUnitSelect.dataset.prevUnit = elevationUnitSelect.value || "m";
maxDepthUnitSelect.dataset.prevUnit = maxDepthUnitSelect.value || "m";
renderDiversInputs(state.divers);
renderStaticI18n();
syncMapPreviewFromDiveSite(state.dive_site);
renderMapPreview();
clearInitialDiveSiteAddressAfterBootstrap();
renderCard(state);
renderReadiness(state);
updateLanguageUiState();
syncHeaderLogoHeight();
fitCardPages();

window.addEventListener("resize", syncHeaderLogoHeight);
window.addEventListener("resize", fitCardPages);
window.addEventListener("beforeprint", fitCardPages);
window.addEventListener("afterprint", handleAfterPrint);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDecoBeerModal();
});

decoBeerModal.addEventListener("click", (event) => {
  if (event.target === decoBeerModal) closeDecoBeerModal();
});

decoBeerCloseBtn.addEventListener("click", closeDecoBeerModal);

form.addEventListener("input", () => {
  readFormIntoState(state);
  renderCard(state);
  renderReadiness(state);
});

elevationUnitSelect.addEventListener("change", () => handleMeasurementUnitChange("elevation"));
maxDepthUnitSelect.addEventListener("change", () => handleMeasurementUnitChange("maxDepth"));

optionalExtraLanguageSelect.addEventListener("change", () => {
  state.meta.optional_extra_language = optionalExtraLanguageSelect.value;
  renderStaticI18n();
  renderDiversInputs(state.divers);
  renderCard(state);
  renderReadiness(state);
  updateLanguageUiState();
});

countryOverrideContinentSelect.addEventListener("change", () => {
  const continent = countryOverrideContinentSelect.value;
  populateCountryOverrideCountrySelect(continent);
  state.meta.country_override_code = continent === "none"
    ? "none"
    : (countryOverrideCountrySelect.value || "none");
  renderStaticI18n();
  renderDiversInputs(state.divers);
  renderCard(state);
  renderReadiness(state);
  updateLanguageUiState();
});

countryOverrideCountrySelect.addEventListener("change", () => {
  state.meta.country_override_code = countryOverrideCountrySelect.value || "none";
  renderStaticI18n();
  renderDiversInputs(state.divers);
  renderCard(state);
  renderReadiness(state);
  updateLanguageUiState();
});

diversContainer.addEventListener("click", (event) => {
  const saveBtn = event.target.closest(".save-diver-btn");
  if (saveBtn) {
    readFormIntoState(state);
    const idx = Number(saveBtn.dataset.index);
    const diver = state.divers[idx];
    if (!diver) {
      showErrorToast("Diver not found.");
      return;
    }
    const payload = {
      meta: { version: schemaVersion, exported_at: todayIso() },
      divers: [diver]
    };
    downloadJsonFile(payload, `${buildDiverFileName(diver)}.json`);
    setStatus(`Diver data exported: ${diver.full_name || "Diver"}.`);
    return;
  }

  const removeBtn = event.target.closest(".remove-diver-btn");
  if (!removeBtn) return;
  const idx = Number(removeBtn.dataset.index);
  if (state.divers.length <= 1) {
    showErrorToast("At least one diver is required.");
    return;
  }
  state.divers.splice(idx, 1);
  renderDiversInputs(state.divers);
  readFormIntoState(state);
  renderCard(state);
  renderReadiness(state);
  setStatus("Diver removed.");
});

diversContainer.addEventListener("change", (event) => {
  const field = event.target?.dataset?.diverField;
  if (field !== "breathing_gas_select") return;
  const idx = Number(event.target.dataset.diverIndex);
  toggleBreathingGasOtherField(idx, event.target.value === BREATHING_GAS_OTHER_VALUE);
  readFormIntoState(state);
  renderCard(state);
  renderReadiness(state);
});

addDiverBtn.addEventListener("click", () => {
  state.divers.push(createEmptyDiver());
  renderDiversInputs(state.divers);
  renderCard(state);
  renderReadiness(state);
  setStatus("Diver added.");
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    validateMinimalShape(data);
    loadStateFromData(state, data);
    hydrateFormFromState(state);
    renderDiversInputs(state.divers);
    syncMapPreviewFromDiveSite(state.dive_site);
    renderMapPreview();
    renderCard(state);
    renderReadiness(state);
    updateLanguageUiState();
    setStatus("JSON import successful.");
  } catch (err) {
    showErrorToast(`Import failed: ${err.message}`);
  } finally {
    event.target.value = "";
  }
});

downloadJsonBtn.addEventListener("click", () => {
  readFormIntoState(state);
  downloadJsonFile(state, `${buildDiveDataFileName(state)}.json`);
  setStatus("JSON exported.");
});

downloadDiveSiteBtn.addEventListener("click", () => {
  readFormIntoState(state);
  const payload = {
    meta: { version: schemaVersion, exported_at: todayIso() },
    dive_site: state.dive_site
  };
  downloadJsonFile(payload, `${buildDiveSiteFileName(state)}.json`);
  setStatus("Dive site data exported.");
});

printBtn.addEventListener("click", () => {
  readFormIntoState(state);
  renderCard(state);
  renderReadiness(state);
  previousDocumentTitle = document.title;
  document.title = buildPdfFileName(state);
  shouldOpenDecoBeerModalAfterPrint = true;
  window.print();
  window.setTimeout(() => {
    document.title = previousDocumentTitle;
  }, 1500);
});

locateAddressBtn.addEventListener("click", runLocateAddressLookup);

for (const fieldName of ["dive_site.name", "dive_site.address"]) {
  const input = form.elements.namedItem(fieldName);
  input?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    runLocateAddressLookup();
  });
}

async function runLocateAddressLookup() {
  const freeName = getField("dive_site.name");
  const address = getField("dive_site.address");
  const lookupQueries = buildDiveSiteLookupQueries(freeName, address);
  if (lookupQueries.length === 0) {
    showErrorToast("Please provide a dive site name or address first.");
    return;
  }
  setStatus("Resolving address...");
  try {
    const coords = await geocodeDiveSite(lookupQueries);
    if (!coords) {
      showErrorToast("No coordinates found for this address. Try a different spelling or a more specific wording.");
      return;
    }
    if (coords.resolvedName) {
      setField("dive_site.name", coords.resolvedName);
    }
    if (coords.resolvedAddress) {
      setField("dive_site.address", coords.resolvedAddress);
    }
    setField("dive_site.dive_base_phone", coords.diveBasePhone || "");
    setField("dive_site.dive_base_website", coords.diveBaseWebsite || "");
    setField("dive_site.lat", coords.lat.toFixed(5));
    setField("dive_site.lon", coords.lon.toFixed(5));
    state.dive_site.country_code = coords.countryCode || null;
    state.dive_site.local_emergency_number = getLocalEmergencyNumber(state.dive_site.country_code);
    setField("dive_site.local_emergency_number", state.dive_site.local_emergency_number);
    state.meta.auto_local_language = resolveLocalLanguage(state.dive_site.country_code);
    const elevationM = await fetchApproxElevation(coords.lat, coords.lon);
    if (elevationM !== null) {
      syncMeasurementDisplayFromMeters("elevation", elevationM);
    }
    readFormIntoState(state);
    syncMapPreviewFromDiveSite(state.dive_site);
    renderMapPreview();
    renderCard(state);
    renderReadiness(state);
    updateLanguageUiState();
    const elevationText = elevationM !== null ? ` | Elevation: ~${elevationM} m` : "";
    const nameText = coords.resolvedName ? ` | Name: ${coords.resolvedName}` : "";
    setStatus(`Address resolved: ${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}${elevationText}${nameText}`);
  } catch (err) {
    showErrorToast(`Address lookup failed: ${err.message}`);
  }
}

clearDiveSiteLookupBtn.addEventListener("click", () => {
  setField("dive_site.name", "");
  setField("dive_site.address", "");
  setField("dive_site.lat", "");
  setField("dive_site.lon", "");
  setField("dive_site.elevation_m", "");
  setField("dive_site.dive_base_phone", "");
  setField("dive_site.dive_base_website", "");
  setField("dive_site.local_emergency_number", "");
  state.dive_site.country_code = null;
  state.meta.auto_local_language = "none";
  readFormIntoState(state);
  renderCard(state);
  renderReadiness(state);
  updateLanguageUiState();
  setStatus("Dive site lookup fields cleared.");
});

diveSiteFileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const raw = JSON.parse(text);
    const diveSite = extractDiveSiteFromImport(raw);
    state.dive_site = normalizeDiveSite(diveSite);
    state.meta.auto_local_language = resolveLocalLanguage(state.dive_site.country_code);
    hydrateFormFromState(state);
    syncMapPreviewFromDiveSite(state.dive_site);
    renderMapPreview();
    renderCard(state);
    renderReadiness(state);
    updateLanguageUiState();
    setStatus("Dive site data imported.");
  } catch (err) {
    showErrorToast(`Dive site import failed: ${err.message}`);
  } finally {
    event.target.value = "";
  }
});

diverFileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    readFormIntoState(state);
    const text = await file.text();
    const raw = JSON.parse(text);
    const incoming = extractDiversFromImport(raw);
    if (incoming.length === 0) throw new Error("No diver entries found.");
    const replaceDefault =
      state.divers.length === 1 &&
      isDiverEffectivelyEmpty(state.divers[0]);
    state.divers = replaceDefault ? incoming : state.divers.concat(incoming);
    renderDiversInputs(state.divers);
    renderCard(state);
    renderReadiness(state);
    setStatus(`Diver data imported: ${incoming.length} added.`);
  } catch (err) {
    showErrorToast(`Diver import failed: ${err.message}`);
  } finally {
    event.target.value = "";
  }
});

function createDefaultState() {
  return {
    meta: {
      version: schemaVersion,
      language: "en",
      auto_local_language: "none",
      optional_extra_language: "none",
      country_override_code: "none",
      created_at: todayIso()
    },
    dive_site: {
      name: "",
      address: "",
      elevation_m: null,
      country_code: null,
      coordinates: { lat: null, lon: null },
      dive_base_phone: "",
      dive_base_website: "",
      oxygen_location: "",
      local_emergency_number: "",
      emergency_phone_location: "",
      chamber_info: ""
    },
    plan: { summary: "", max_depth_m: 0, divers_in_group: 1 },
    divers: [createEmptyDiver()]
  };
}

function createEmptyEmergencyContact() {
  return { name: "", relation: "", phone: "" };
}

function createEmptyDiver() {
  return {
    full_name: "",
    sex: "M",
    birth_date: "",
    address: "",
    dive_count: 0,
    certifications: [],
    breathing_gas: "",
    allergies: [],
    medical: { conditions: [], medications: [] },
    insurance: {
      health_insurance: "",
      dive_insurance_provider: "",
      dive_insurance_member_no: "",
      dive_insurance_hotline: ""
    },
    emergency_contacts: [createEmptyEmergencyContact(), createEmptyEmergencyContact()],
    phone: ""
  };
}

function validateMinimalShape(data) {
  if (!data || typeof data !== "object") throw new Error("Invalid root object.");
  if (!data.meta || data.meta.version !== schemaVersion) {
    throw new Error(`Unsupported version. Expected ${schemaVersion}.`);
  }
  if (!data.dive_site || !data.plan || !Array.isArray(data.divers) || data.divers.length === 0) {
    throw new Error("Missing required sections: dive_site, plan, divers.");
  }
}

function loadStateFromData(target, data) {
  target.meta = {
    version: data.meta?.version || schemaVersion,
    language: "en",
    auto_local_language: data.meta?.auto_local_language || resolveLocalLanguage(data.dive_site?.country_code),
    optional_extra_language: data.meta?.optional_extra_language || data.meta?.additional_language || "none",
    country_override_code: data.meta?.country_override_code || "none",
    created_at: data.meta?.created_at || todayIso()
  };
  target.dive_site = data.dive_site;
  target.dive_site.country_code = data.dive_site?.country_code || null;
  target.dive_site.local_emergency_number =
    data.dive_site?.local_emergency_number ||
    getLocalEmergencyNumber(target.dive_site.country_code);
  target.plan = data.plan;
  target.divers = data.divers;
}

function hydrateFormFromState(data) {
  optionalExtraLanguageSelect.value = data.meta.optional_extra_language || "none";
  const continent = getCountryOverrideContinent(data.meta.country_override_code);
  countryOverrideContinentSelect.value = continent;
  populateCountryOverrideCountrySelect(continent, data.meta.country_override_code || "none");
  setField("dive_site.name", data.dive_site.name);
  setField("dive_site.address", data.dive_site.address);
  syncMeasurementDisplayFromMeters("elevation", data.dive_site.elevation_m);
  setField("dive_site.lat", data.dive_site.coordinates?.lat ?? "");
  setField("dive_site.lon", data.dive_site.coordinates?.lon ?? "");
  setField("dive_site.dive_base_phone", data.dive_site.dive_base_phone || "");
  setField("dive_site.dive_base_website", data.dive_site.dive_base_website || "");
  setField("dive_site.oxygen_location", data.dive_site.oxygen_location || "");
  setField("dive_site.local_emergency_number", data.dive_site.local_emergency_number || "");
  setField("dive_site.emergency_phone_location", data.dive_site.emergency_phone_location || "");
  setField("dive_site.chamber_info", data.dive_site.chamber_info || "");
  setField("plan.summary", data.plan.summary);
  syncMeasurementDisplayFromMeters("maxDepth", data.plan.max_depth_m);
  setField("plan.divers_in_group", data.plan.divers_in_group ?? Math.max(1, data.divers?.length || 1));
  updateLanguageUiState();
}

function renderDiversInputs(divers) {
  const html = divers
    .map((diver, idx) => {
      return `
      <section class="diver-block">
        <div class="diver-header">
          <h3>${biRaw("Diver", "Taucher", "Buzo", "غواص")} ${idx + 1}</h3>
        </div>
        <div class="diver-actions">
          <button type="button" class="save-diver-btn save-btn" data-index="${idx}">Save Diver Data</button>
          <button type="button" class="remove-diver-btn" data-index="${idx}">${biRaw("Remove Diver", "Taucher entfernen", "Quitar buzo", "ازالة الغواص")}</button>
        </div>
        <div class="diver-grid">
          ${inputField(idx, "full_name", biRaw("Full Name", "Voller Name", "Nombre completo", "الاسم الكامل"), diver.full_name, "text", true)}
          ${selectField(idx, "sex", biRaw("Sex", "Geschlecht", "Sexo", "الجنس"), diver.sex, getSexOptions(), true)}
          ${inputField(idx, "birth_date", biRaw("Birth Date", "Geburtsdatum", "Fecha de nacimiento", "تاريخ الميلاد"), diver.birth_date, "date", true)}
          ${inputField(idx, "address", bi("address"), diver.address, "text", true)}
          ${inputField(idx, "dive_count", biRaw("Dive Count", "Tauchgänge", "Inmersiones", "عدد الغطسات"), String(diver.dive_count), "number", true)}
          ${inputField(idx, "certifications", biRaw("Certifications (comma separated)", "Zertifizierungen (kommagetrennt)", "Certificaciones (separadas por comas)", "الشهادات (مفصولة بفاصلة)"), (diver.certifications || []).join(", "), "text", true)}
          ${breathingGasField(idx, diver.breathing_gas)}
          ${inputField(idx, "allergies", biRaw("Allergies (comma separated)", "Allergien (kommagetrennt)", "Alergias (separadas por comas)", "الحساسية (مفصولة بفاصلة)"), (diver.allergies || []).join(", "), "text", false)}
          ${inputField(idx, "conditions", biRaw("Medical Conditions (comma separated)", "Medizinische Vorerkrankungen (kommagetrennt)", "Condiciones medicas (separadas por comas)", "الحالات الطبية (مفصولة بفاصلة)"), (diver.medical?.conditions || []).join(", "), "text", false)}
          ${inputField(idx, "medications", biRaw("Medications (comma separated)", "Medikamente (kommagetrennt)", "Medicamentos (separados por comas)", "الادوية (مفصولة بفاصلة)"), (diver.medical?.medications || []).join(", "), "text", false)}
          ${inputField(idx, "health_insurance", biRaw("Health Insurance Provider", "Krankenversicherer", "Proveedor del seguro medico", "مزود التأمين الصحي"), diver.insurance?.health_insurance || "", "text", true)}
          ${inputField(idx, "dive_insurance_provider", biRaw("Dive Insurance Provider", "Tauchversicherung Anbieter", "Proveedor seguro de buceo", "مزود تامين الغوص"), diver.insurance?.dive_insurance_provider || "", "text", false)}
          ${inputField(idx, "dive_insurance_member_no", biRaw("Dive Insurance Member No", "Tauchversicherung Mitglied-Nr.", "N.º socio seguro de buceo", "رقم عضو تامين الغوص"), diver.insurance?.dive_insurance_member_no || "", "text", false)}
          ${inputField(idx, "dive_insurance_hotline", biRaw("Dive Insurance Hotline", "Tauchversicherung Hotline", "Línea directa seguro de buceo", "خط طوارئ تامين الغوص"), diver.insurance?.dive_insurance_hotline || "", "text", false)}
          ${emergencyContactFields(idx, 0, diver.emergency_contacts?.[0], true)}
          ${emergencyContactFields(idx, 1, diver.emergency_contacts?.[1], false)}
          ${inputField(idx, "phone", bi("own_phone"), diver.phone || "", "text", true)}
        </div>
      </section>
      `;
    })
    .join("");

  diversContainer.innerHTML = html;
}

function inputField(index, field, label, value, type, required) {
  return `
  <label>${escapeHtml(label)}
    <input
      data-diver-index="${index}"
      data-diver-field="${field}"
      type="${type}"
      value="${escapeHtml(value ?? "")}"
      ${required ? "required" : ""}
    >
  </label>`;
}

function selectField(index, field, label, value, options, required) {
  const optionHtml = options
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === value ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
  return `
  <label>${escapeHtml(label)}
    <select
      data-diver-index="${index}"
      data-diver-field="${field}"
      ${required ? "required" : ""}
    >
      ${optionHtml}
    </select>
  </label>`;
}

function breathingGasField(index, value) {
  const choice = getBreathingGasChoice(value);
  const customValue = choice === BREATHING_GAS_OTHER_VALUE ? value : "";
  const otherLabelClass = choice === BREATHING_GAS_OTHER_VALUE ? "" : " hidden";
  return `
  ${selectField(index, "breathing_gas_select", biRaw("Breathing Gas", "Atemgas", "Gas respiratorio", "غاز التنفس"), choice, getBreathingGasOptions(), true)}
  <label class="breathing-gas-other${otherLabelClass}" data-breathing-gas-other-wrapper="${index}">${escapeHtml(biRaw("Other Breathing Gas", "Anderes Atemgas", "Otro gas respiratorio", "غاز تنفس اخر"))}
    <input
      data-diver-index="${index}"
      data-diver-field="breathing_gas_other"
      type="text"
      value="${escapeHtml(customValue)}"
      ${choice === BREATHING_GAS_OTHER_VALUE ? "required" : ""}
      ${choice === BREATHING_GAS_OTHER_VALUE ? "" : "disabled"}
    >
  </label>`;
}

function emergencyContactFields(diverIndex, contactIndex, contact, required) {
  const suffix = contactIndex + 1;
  const safeContact = contact || createEmptyEmergencyContact();
  const requiredLabel = required ? " *" : " (optional)";
  return `
  ${inputField(diverIndex, `em_name_${suffix}`, `${biRaw("Emergency Contact Name", "Notfallkontakt Name", "Nombre contacto emergencia", "اسم جهة اتصال الطوارئ")} ${suffix}${requiredLabel}`, safeContact.name || "", "text", required)}
  ${inputField(diverIndex, `em_relation_${suffix}`, `${biRaw("Emergency Contact Relation", "Notfallkontakt Beziehung", "Relación contacto emergencia", "صلة جهة اتصال الطوارئ")} ${suffix}${requiredLabel}`, safeContact.relation || "", "text", required)}
  ${inputField(diverIndex, `em_phone_${suffix}`, `${biRaw("Emergency Contact Phone", "Notfallkontakt Telefon", "Teléfono contacto emergencia", "هاتف جهة اتصال الطوارئ")} ${suffix}${requiredLabel}`, safeContact.phone || "", "text", required)}
  `;
}

function downloadJsonFile(payload, filename) {
  const dataStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function handleAfterPrint() {
  document.title = previousDocumentTitle;
  if (!shouldOpenDecoBeerModalAfterPrint) return;
  shouldOpenDecoBeerModalAfterPrint = false;
  openDecoBeerModal();
}

function openDecoBeerModal() {
  decoBeerModal.classList.remove("hidden");
  decoBeerModal.setAttribute("aria-hidden", "false");
}

function closeDecoBeerModal() {
  decoBeerModal.classList.add("hidden");
  decoBeerModal.setAttribute("aria-hidden", "true");
}

function readFormIntoState(data) {
  data.dive_site.name = getField("dive_site.name");
  data.dive_site.address = getField("dive_site.address");
  data.dive_site.elevation_m = parseMeasurementInputToMeters(getField("dive_site.elevation_m"), getMeasurementUnit("elevation"));
  const lat = toNullableNum(getField("dive_site.lat"));
  const lon = toNullableNum(getField("dive_site.lon"));
  data.dive_site.coordinates = (lat !== null && lon !== null) ? { lat, lon } : null;
  data.dive_site.dive_base_phone = getField("dive_site.dive_base_phone");
  data.dive_site.dive_base_website = getField("dive_site.dive_base_website");
  data.dive_site.oxygen_location = getField("dive_site.oxygen_location");
  data.dive_site.local_emergency_number = getField("dive_site.local_emergency_number");
  data.dive_site.emergency_phone_location = getField("dive_site.emergency_phone_location");
  data.dive_site.chamber_info = getField("dive_site.chamber_info");
  data.plan.summary = getField("plan.summary");
  data.plan.max_depth_m = parseMeasurementInputToMeters(getField("plan.max_depth_m"), getMeasurementUnit("maxDepth"));
  data.plan.divers_in_group = Math.max(1, Math.trunc(toNum(getField("plan.divers_in_group"))));

  const rows = [...diversContainer.querySelectorAll("[data-diver-index][data-diver-field]")];
  const map = new Map();
  for (const row of rows) {
    const idx = Number(row.dataset.diverIndex);
    const field = row.dataset.diverField;
    if (!map.has(idx)) map.set(idx, {});
    map.get(idx)[field] = row.value.trim();
  }

  const divers = [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, d]) => {
      const breathingGas = d.breathing_gas_select === BREATHING_GAS_OTHER_VALUE
        ? (d.breathing_gas_other || "")
        : (d.breathing_gas_select || "");
      const emergencyContacts = [
        {
          name: d.em_name_1 || "",
          relation: d.em_relation_1 || "",
          phone: d.em_phone_1 || ""
        },
        {
          name: d.em_name_2 || "",
          relation: d.em_relation_2 || "",
          phone: d.em_phone_2 || ""
        }
      ].filter((contact, index) => {
        if (index === 0) return true;
        return contact.name || contact.relation || contact.phone;
      });
      return {
        full_name: d.full_name || "",
        sex: d.sex || "M",
        birth_date: d.birth_date || "",
        address: d.address || "",
        dive_count: Math.trunc(toNum(d.dive_count)),
        certifications: splitCsv(d.certifications),
        breathing_gas: breathingGas,
        allergies: splitCsv(d.allergies),
        medical: {
          conditions: splitCsv(d.conditions),
          medications: splitCsv(d.medications)
        },
        insurance: {
          health_insurance: d.health_insurance || "",
          dive_insurance_provider: d.dive_insurance_provider || "",
          dive_insurance_member_no: d.dive_insurance_member_no || "",
          dive_insurance_hotline: d.dive_insurance_hotline || ""
        },
        emergency_contacts: emergencyContacts.length > 0 ? emergencyContacts : [createEmptyEmergencyContact()],
        phone: d.phone || ""
      };
    });

  data.divers = divers.length > 0 ? divers : [createEmptyDiver()];
}

function renderCard(data) {
  const coordsText = formatCoordinates(data.dive_site.coordinates);
  const whoSections = buildWhoSections(data.divers, 2);
  const exportLanguageCount = getExportLanguages().length;

  cardEl.innerHTML = `
    ${buildPrimaryCardPage(data, coordsText, whoSections[0] || buildWhoTable([]), exportLanguageCount)}
    ${whoSections
      .slice(1)
      .map((tableHtml) => buildContinuationCardPage(tableHtml, exportLanguageCount))
      .join("")}
  `;
  fitCardPages();
}

function renderMapPreview() {
  mapPreviewEl.innerHTML = buildMapHtml(mapPreviewDiveSite || {});
}

function syncMapPreviewFromDiveSite(diveSite) {
  const normalized = normalizeDiveSite(diveSite || {});
  const hasCoords = normalized.coordinates && typeof normalized.coordinates.lat === "number" && typeof normalized.coordinates.lon === "number";
  if (!normalized.address && !hasCoords) {
    mapPreviewDiveSite = null;
    return;
  }
  mapPreviewDiveSite = normalized;
}

function buildPrimaryCardPage(data, coordsText, whoTableHtml, exportLanguageCount) {
  return `
    <section class="card-page card-page-primary lang-count-${exportLanguageCount}">
      ${buildCardHeader()}
      <div class="card-page-body">
        <section class="card-section-row section-where">
          <div class="side-label">${biHtml("where")}</div>
          <div class="section-body">
            ${buildWhereTable(data, coordsText)}
          </div>
        </section>

        <section class="card-section-row section-what">
          <div class="side-label">${biHtml("what")}</div>
          <div class="section-body">
            ${buildWhatTable(data)}
          </div>
        </section>

        <section class="card-section-row section-who">
          <div class="side-label">${biHtml("who")}</div>
          <div class="section-body">
            ${whoTableHtml}
          </div>
        </section>
      </div>
    </section>
  `;
}

function buildWhereTable(data, coordsText) {
  const rows = [
    {
      key: "local_emergency_number",
      value: `<strong>${escapeHtml(data.dive_site.local_emergency_number || "-")}</strong>`,
      className: "row-emergency-number row-emergency-number-top"
    },
    { key: "site", value: escapeHtml(data.dive_site.name), className: "row-site" },
    { key: "address", value: escapeHtml(data.dive_site.address), className: "row-address" },
    {
      key: "elevation_m",
      value: formatElevationForExport(data.dive_site.elevation_m),
      className: "row-elevation"
    },
    { key: "coordinates", value: escapeHtml(coordsText), className: "row-coordinates" },
    {
      key: "dive_base_phone",
      value: renderPhoneQrBlock(data.dive_site.dive_base_phone, {
        qrType: "tel",
        alt: "Dive base phone QR",
        qrPosition: "right",
        qrAlign: "left",
        qrGap: "normal"
      }),
      className: "row-dive-base-phone"
    },
    { key: "dive_base_website", value: escapeHtml(data.dive_site.dive_base_website || "-"), className: "row-dive-base-website" },
    { key: "oxygen_location", value: escapeHtml(data.dive_site.oxygen_location || "-"), className: "row-oxygen" },
    { key: "emergency_phone_location", value: escapeHtml(data.dive_site.emergency_phone_location || "-"), className: "row-emergency-phone-location" },
    { key: "chamber_info", labelKey: "hyperbaric_chamber", value: escapeHtml(data.dive_site.chamber_info || "-"), className: "row-chamber-info" }
  ];
  return buildIconCompactTable(rows, {
    tableClassName: "data-table compact where-table",
    renderLabel: (row) => biHtml(row.labelKey || row.key),
    renderValue: (row) => row.value
  });
}

function buildWhatTable(data) {
  const rows = [
    { labelHtml: biHtml("plan"), value: escapeHtml(data.plan.summary), className: "row-plan" },
    { labelHtml: biHtml("max_depth"), value: formatMetricImperial(data.plan.max_depth_m), className: "row-max-depth" },
    {
      labelHtml: biRawHtml("Divers in Group", "Taucher in Gruppe", "Buzos en grupo", "الغواصون في المجموعة"),
      value: escapeHtml(String(data.plan.divers_in_group ?? data.divers.length)),
      className: "row-divers-in-group"
    }
  ];
  return buildIconCompactTable(rows, {
    tableClassName: "data-table compact what-table",
    renderLabel: (row) => row.labelHtml,
    renderValue: (row) => row.value
  });
}

function getCompactTableIcons() {
  return {
    "row-emergency-number": { src: "assets/export-icons/local-emergency-number.png", alt: "Local emergency number" },
    "row-site": { src: "assets/export-icons/site.png", alt: "Site" },
    "row-address": { src: "assets/export-icons/address.png", alt: "Address" },
    "row-elevation": { src: "assets/export-icons/elevation.png", alt: "Elevation" },
    "row-coordinates": { src: "assets/export-icons/coordinates.png", alt: "Coordinates" },
    "row-dive-base-phone": { src: "assets/export-icons/dive-base-phone.png", alt: "Dive base phone" },
    "row-emergency-phone-location": { src: "assets/export-icons/emergency-phone-location.png", alt: "Emergency phone location" },
    "row-dive-base-website": { src: "assets/export-icons/dive-base-website.png", alt: "Dive base website" },
    "row-oxygen": { src: "assets/export-icons/oxygen-location.png", alt: "Oxygen location" },
    "row-chamber-info": { src: "assets/export-icons/hyperbaric-chamber.png", alt: "Hyperbaric chamber" },
    "row-plan": { src: "assets/export-icons/dive-plan-summary.png", alt: "Dive plan summary" },
    "row-max-depth": { src: "assets/export-icons/max-depth.png", alt: "Max depth" },
    "row-divers-in-group": { src: "assets/export-icons/divers-in-group.png", alt: "Divers in group" }
  };
}

function renderIconCompactTableIcon(className) {
  const compactTableIcons = getCompactTableIcons();
  const rowClass = Object.keys(compactTableIcons).find((key) => className?.includes(key));
  const icon = rowClass ? compactTableIcons[rowClass] : null;
  if (!icon) {
    return `<span class="compact-row-icon compact-row-icon-fallback" aria-hidden="true"></span>`;
  }
  return `<img class="compact-row-icon compact-row-icon-image" src="${escapeHtml(icon.src)}" alt="${escapeHtml(icon.alt)}">`;
}

function buildIconCompactTable(rows, options) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const bodyRows = safeRows
    .map((row) => {
      const className = row.className ? ` ${row.className}` : "";
      return `<tr class="${className.trim()}">
        <td class="compact-icon-cell">${renderIconCompactTableIcon(row.className)}</td>
        <td class="compact-label-cell">${options.renderLabel(row)}</td>
        <td class="compact-value-cell"><div class="compact-value-inner">${options.renderValue(row)}</div></td>
      </tr>`;
    })
    .join("");
  return `
    <table class="${options.tableClassName}">
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
}

function buildCompactTable(rows, options) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const bodyRows = safeRows
    .map((row) => {
      const className = row.className ? ` ${row.className}` : "";
      return `<tr class="${className.trim()}">
        <th>${options.renderLabel(row)}</th>
        <td>${options.renderValue(row)}</td>
      </tr>`;
    })
    .join("");
  return `
    <table class="${options.tableClassName}">
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
}

function buildWeightedTable(rows, options) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const totalWeight = safeRows.reduce((sum, row) => sum + (row.weight || 1), 0) || 1;
  const bodyRows = safeRows
    .map((row) => {
      const className = row.className ? ` ${row.className}` : "";
      return `<tr class="weighted-row${className}" style="--row-weight:${row.weight || 1}">
        <th>${options.renderLabel(row)}</th>
        <td>${options.renderValue(row)}</td>
      </tr>`;
    })
    .join("");
  return `
    <table class="${options.tableClassName}" style="--row-weight-total:${totalWeight}">
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
}

function buildContinuationCardPage(tableHtml, exportLanguageCount) {
  return `
    <section class="card-page card-page-cont lang-count-${exportLanguageCount}">
      ${buildCardHeader()}
      <div class="card-page-body">
        <section class="card-section-row section-who">
          <div class="side-label">${biRawHtml("Who (cont.)", "Wer (Forts.)", "Quien (cont.)", "من (متابعة)")}</div>
          <div class="section-body">
            ${tableHtml}
          </div>
        </section>
      </div>
    </section>
  `;
}

function buildCardHeader() {
  return `
    <div class="card-header">
      <h3>${biExportText("card_title")}</h3>
      <p>SafeDiveCard.com</p>
    </div>
  `;
}

function buildWhoSections(divers, pageSize) {
  if (!Array.isArray(divers) || divers.length === 0) return [buildWhoTable([])];
  const sections = [];
  for (let i = 0; i < divers.length; i += pageSize) {
    sections.push(buildWhoTable(divers.slice(i, i + pageSize)));
  }
  return sections;
}

function buildWhoTable(divers) {
  const rows = [
    { labelHtml: biHtml("name"), get: (d) => d.full_name || "-", weight: 1.0, className: "row-name" },
    { labelHtml: biHtml("address"), get: (d) => d.address || "-", weight: 0.85, className: "row-address" },
    { labelHtml: biRawHtml("Sex", "Geschlecht", "Sexo", "الجنس"), get: (d) => formatSexValue(d.sex), weight: 0.85, className: "row-sex" },
    { labelHtml: biRawHtml("Birth / Age", "Geburtstag / Alter", "Nacimiento / Edad", "الميلاد / العمر"), get: (d) => formatBirthAge(d.birth_date), weight: 0.95, className: "row-birth-age" },
    { labelHtml: biRawHtml("Dive Count", "Anzahl Tauchgaenge", "Numero de inmersiones", "عدد الغطسات"), get: (d) => String(d.dive_count ?? 0), weight: 0.9, className: "row-dive-count" },
    { labelHtml: biHtml("certifications"), get: (d) => (d.certifications || []).join(", ") || "-", weight: 0.85, className: "row-certifications" },
    { labelHtml: biRawHtml("Breathing Gas", "Atemgas", "Gas respiratorio", "غاز التنفس"), get: (d) => d.breathing_gas || "-", weight: 0.9, className: "row-breathing-gas" },
    { labelHtml: biHtml("allergies"), get: (d) => (d.allergies || []).join(", ") || "-", weight: 1.0, className: "row-allergies" },
    { labelHtml: biHtml("conditions"), get: (d) => (d.medical?.conditions || []).join(", ") || "-", weight: 1.15, className: "row-conditions" },
    { labelHtml: biHtml("medications"), get: (d) => (d.medical?.medications || []).join(", ") || "-", weight: 1.25, className: "row-medications" },
    { labelHtml: biRawHtml("Emergency Contact", "Notfallkontakt", "Contacto de emergencia", "جهة اتصال طارئة"), getHtml: (d) => formatEmergencyContactsHtml(d.emergency_contacts), weight: 1.6, className: "row-emergency-contact" },
    { labelHtml: biRawHtml("Health Insurance Provider", "Krankenversicherer", "Proveedor del seguro medico", "مزود التأمين الصحي"), get: (d) => d.insurance?.health_insurance || "-", weight: 1.0, className: "row-health-insurance" },
    { labelHtml: biRawHtml("Dive Insurance", "Tauchversicherung", "Seguro de buceo", "تامين الغوص"), getHtml: (d) => formatDiveInsuranceHtml(d.insurance), weight: 1.45, className: "row-dive-insurance" },
    { labelHtml: biRawHtml("Own Contact", "Eigener Kontakt", "Contacto propio", "جهة الاتصال الخاصة"), getHtml: (d, idx) => renderOwnPhoneQrBlock(d, idx), weight: 1.2, className: "row-own-phone" }
  ];

  const safeDivers = divers.length > 0 ? divers : [createEmptyDiver()];
  const totalWeight = rows.reduce((sum, row) => sum + (row.weight || 1), 0) || 1;
  const bodyRows = rows
    .map((row) => {
      const cols = safeDivers
        .map((diver, idx) => {
          const valueHtml = row.getHtml
            ? row.getHtml(diver, idx)
            : escapeHtml(row.get(diver)).replaceAll("\n", "<br>");
          return `<td>${valueHtml}</td>`;
        })
        .join("");
      return `<tr class="weighted-row ${row.className}" style="--row-weight:${row.weight || 1}"><th>${row.labelHtml}</th>${cols}</tr>`;
    })
    .join("");

  return `
    <div class="who-table-wrap">
      <div class="who-title-divider">${biRawHtml("Divers", "Taucher", "Buzos", "الغواصون")}</div>
      <table class="data-table who-table weighted-table" style="--row-weight-total:${totalWeight}">
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  `;
}

function formatBirthAge(birthDate) {
  if (!birthDate) return "-";
  const age = calculateAge(birthDate);
  const formattedDate = formatDateGermanStyle(birthDate);
  if (age === null) return formattedDate;
  return `${formattedDate} / ${age} years`;
}

function formatSexValue(value) {
  const normalized = String(value || "").toUpperCase();
  const labelsByCode = {
    M: { en: "Male", de: "Maennlich", es: "Masculino", fr: "Masculin", it: "Maschile", ar: "ذكر" },
    F: { en: "Female", de: "Weiblich", es: "Femenino", fr: "Feminin", it: "Femminile", ar: "انثى" },
    X: { en: "Diverse", de: "Divers", es: "Diverso", fr: "Divers", it: "Diverso", ar: "متنوع" }
  };
  const entry = labelsByCode[normalized];
  if (!entry) return value || "-";
  return formatLocalizedValue(entry, getExportLanguages());
}

function formatLocalizedValue(entry, languages) {
  const labels = [];
  for (const lang of languages) {
    const text = entry[lang] || entry.en;
    if (text && !labels.includes(text)) labels.push(text);
  }
  return labels.join(" / ");
}

function getSexOptions() {
  return [
    { value: "M", label: formatLocalizedValue({ en: "Male", de: "Maennlich", es: "Masculino", fr: "Masculin", it: "Maschile", ar: "ذكر" }, getUiLanguages()) },
    { value: "F", label: formatLocalizedValue({ en: "Female", de: "Weiblich", es: "Femenino", fr: "Feminin", it: "Femminile", ar: "انثى" }, getUiLanguages()) },
    { value: "X", label: formatLocalizedValue({ en: "Diverse", de: "Divers", es: "Diverso", fr: "Divers", it: "Diverso", ar: "متنوع" }, getUiLanguages()) }
  ];
}

function getBreathingGasOptions() {
  return [
    ...PRESET_BREATHING_GASES.map((gas) => ({ value: gas, label: gas })),
    { value: BREATHING_GAS_OTHER_VALUE, label: biRaw("Other...", "Andere...", "Otro...", "اخرى...") }
  ];
}

function getBreathingGasChoice(value) {
  return PRESET_BREATHING_GASES.includes(value) ? value : BREATHING_GAS_OTHER_VALUE;
}

function toggleBreathingGasOtherField(index, show) {
  const wrapper = diversContainer.querySelector(`[data-breathing-gas-other-wrapper="${index}"]`);
  if (!wrapper) return;
  wrapper.classList.toggle("hidden", !show);
  const input = wrapper.querySelector('input[data-diver-field="breathing_gas_other"]');
  if (!input) return;
  input.disabled = !show;
  input.required = show;
  if (!show) input.value = "";
}

function calculateAge(birthDate) {
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

function formatDateGermanStyle(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text || "-";
  return `${match[3]}.${match[2]}.${match[1]}`;
}

function formatEmergencyContacts(contacts) {
  const activeContacts = Array.isArray(contacts)
    ? contacts.filter((c) => c?.name || c?.relation || c?.phone)
    : [];
  if (activeContacts.length === 0) return "-";
  return activeContacts
    .map((c) => `${c.name || "-"} (${c.relation || "-"})\n${c.phone || "-"}`)
    .join("\n");
}

function formatEmergencyContactsHtml(contacts) {
  const activeContacts = Array.isArray(contacts)
    ? contacts.filter((c) => c?.name || c?.relation || c?.phone)
    : [];
  if (activeContacts.length === 0) return "-";
  const items = activeContacts
    .map((contact, index) => {
      const name = String(contact?.name || "").trim() || "-";
      const relation = String(contact?.relation || "").trim();
      const phone = String(contact?.phone || "").trim();
      const firstLine = relation ? `${name} (${relation})` : name;
      return renderPhoneQrBlock(phone, {
        qrType: "tel",
        alt: "Emergency contact phone QR",
        lines: [firstLine, phone || "-"],
        qrPosition: index % 2 === 0 ? "left" : "right",
        qrAlign: index % 2 === 0 ? "left" : "right",
        qrGap: "wide"
      });
    })
    .filter(Boolean);
  if (items.length === 0) return "-";
  return `<div class="qr-stack">${items.join("")}</div>`;
}

function formatDiveInsurance(insurance) {
  if (!insurance) return "-";
  const parts = [
    insurance.dive_insurance_provider || "-",
    insurance.dive_insurance_member_no ? `No: ${insurance.dive_insurance_member_no}` : null,
    insurance.dive_insurance_hotline ? `Hotline: ${insurance.dive_insurance_hotline}` : null
  ].filter(Boolean);
  return parts.join("\n");
}

function formatDiveInsuranceHtml(insurance) {
  if (!insurance) return "-";
  const lines = [
    insurance.dive_insurance_provider || "-",
    insurance.dive_insurance_member_no ? `No: ${insurance.dive_insurance_member_no}` : null,
    insurance.dive_insurance_hotline ? `Hotline: ${insurance.dive_insurance_hotline}` : null
  ].filter(Boolean);
  return renderInfoWithQr(lines, insurance.dive_insurance_hotline, "Dive insurance hotline QR", "tel", "right", "right", "wide");
}

function renderOwnPhoneQrBlock(diver, index) {
  const phone = diver?.phone || "";
  const vcard = buildDiverVcard(diver, index);
  return renderPhoneQrBlock(phone, {
    qrType: "vcard",
    qrPayload: vcard,
    alt: `Diver ${index + 1} contact QR`,
    qrPosition: "left",
    qrAlign: "left",
    qrGap: "wide"
  });
}

function renderPhoneQrBlock(phone, options = {}) {
  const displayText = String(phone || "").trim();
  const lines = Array.isArray(options.lines) && options.lines.length > 0
    ? options.lines
    : [displayText || "-"];
  const qrPosition = options.qrPosition === "left" ? "left" : "right";
  const qrAlign = options.qrAlign === "right" ? "right" : "left";
  const qrGap = options.qrGap === "tight"
    ? "tight"
    : options.qrGap === "wide"
      ? "wide"
      : "normal";
  if (!displayText && options.qrType !== "vcard") {
    return renderInfoWithQr(lines, "", options.alt || "Phone", "tel", qrPosition, qrAlign, qrGap);
  }
  const qrType = options.qrType || "tel";
  const qrPayload = qrType === "vcard"
    ? String(options.qrPayload || "")
    : buildTelQrPayload(displayText);
  if (!qrPayload) return renderInfoWithQr(lines, "", options.alt || "Phone", qrType === "vcard" ? "raw" : "tel", qrPosition, qrAlign, qrGap);
  return renderInfoWithQr(lines, qrPayload, options.alt || "Phone QR", qrType === "vcard" ? "raw" : "tel", qrPosition, qrAlign, qrGap);
}

function renderInfoWithQr(lines, payloadSource, alt, payloadMode = "tel", qrPosition = "right", qrAlign = "left", qrGap = "normal") {
  const safeLines = (Array.isArray(lines) ? lines : [lines]).filter((line) => line !== null && line !== undefined && String(line).trim() !== "");
  if (safeLines.length === 0) return "-";
  let qrPayload = "";
  if (payloadMode === "raw") {
    qrPayload = String(payloadSource || "").trim();
  } else if (payloadMode === "tel") {
    qrPayload = buildTelQrPayload(payloadSource);
  }
  const textHtml = safeLines.map((line) => `<span>${escapeHtml(String(line))}</span>`).join("");
  const blockClass = `qr-inline-block qr-pos-${qrPosition} qr-align-${qrAlign} qr-gap-${qrGap}`;
  if (!qrPayload) {
    return `<div class="${blockClass}"><div class="qr-inline-text">${textHtml}</div></div>`;
  }
  const qrUrl = buildQrImageUrl(qrPayload);
  return `<div class="${blockClass}">
    <div class="qr-inline-text">${textHtml}</div>
    <img class="qr-inline-code" src="${qrUrl}" alt="${escapeHtml(alt)}" loading="lazy">
  </div>`;
}

function buildTelQrPayload(phone) {
  const normalized = normalizePhoneForTel(phone);
  if (!normalized) return "";
  return `tel:${normalized}`;
}

function normalizePhoneForTel(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  const hasLeadingPlus = raw.startsWith("+");
  const cleaned = raw.replace(/[^\d+]/g, "");
  const normalized = hasLeadingPlus
    ? `+${cleaned.replace(/[+]/g, "")}`
    : cleaned.replace(/[+]/g, "");
  const digitCount = normalized.replace(/[^\d]/g, "").length;
  if (digitCount < 5) return "";
  if (!/^\+?\d+$/.test(normalized)) return "";
  return normalized;
}

function buildDiverVcard(diver, index) {
  const fullName = String(diver?.full_name || "").trim();
  const prefixedName = `Diver ${index + 1}${fullName ? ` ${fullName}` : ""}`.trim();
  const birthDate = String(diver?.birth_date || "").trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcardValue(prefixedName)}`,
    `N:${escapeVcardValue(prefixedName)};;;;`,
    diver?.address ? `ADR:;;${escapeVcardValue(String(diver.address).trim())};;;;` : null,
    diver?.phone ? `TEL;TYPE=CELL:${escapeVcardValue(String(diver.phone).trim())}` : null,
    birthDate ? `BDAY:${birthDate}` : null,
    "END:VCARD"
  ].filter(Boolean);
  return lines.join("\n");
}

function escapeVcardValue(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

function buildQrImageUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=96x96&margin=0&data=${encodeURIComponent(payload)}`;
}

function getField(name) {
  return form.elements.namedItem(name).value.trim();
}

function setField(name, value) {
  const field = form.elements.namedItem(name);
  if (field) field.value = value ?? "";
}

function getMeasurementConfig(key) {
  return MEASUREMENT_FIELDS[key] || null;
}

function getMeasurementUnit(key) {
  const config = getMeasurementConfig(key);
  const unit = config?.selectEl?.value === "ft" ? "ft" : "m";
  return unit;
}

function metersToFeet(value) {
  return value * FEET_PER_METER;
}

function feetToMeters(value) {
  return value / FEET_PER_METER;
}

function parseMeasurementInputToMeters(rawValue, unit) {
  const numeric = toNum(rawValue);
  if (unit === "ft") return Math.round(feetToMeters(numeric));
  return Math.round(numeric);
}

function formatMetersForDisplay(metersValue, unit) {
  const numeric = toNullableNum(metersValue);
  if (numeric === null) return "";
  if (unit === "ft") return String(Math.round(metersToFeet(numeric)));
  return String(Math.round(numeric));
}

function syncMeasurementDisplayFromMeters(key, metersValue) {
  const config = getMeasurementConfig(key);
  if (!config) return;
  setField(config.inputName, formatMetersForDisplay(metersValue, getMeasurementUnit(key)));
}

function handleMeasurementUnitChange(key) {
  const config = getMeasurementConfig(key);
  if (!config?.selectEl) return;
  const previousUnit = config.selectEl.dataset.prevUnit || "m";
  const nextUnit = getMeasurementUnit(key);
  const rawValue = getField(config.inputName);
  config.selectEl.dataset.prevUnit = nextUnit;
  if (!rawValue) {
    setField(config.inputName, "");
    readFormIntoState(state);
    renderCard(state);
    renderReadiness(state);
    return;
  }
  const metersValue = parseMeasurementInputToMeters(rawValue, previousUnit);
  syncMeasurementDisplayFromMeters(key, metersValue);
  readFormIntoState(state);
  renderCard(state);
  renderReadiness(state);
}

function formatMetricImperial(valueInMeters) {
  const meters = toNullableNum(valueInMeters);
  if (meters === null) return "-";
  const roundedMeters = Math.round(meters);
  const feet = Math.round(metersToFeet(roundedMeters));
  return `${roundedMeters} m / ${feet} ft`;
}

function splitCsv(value) {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function toNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toNullableNum(value) {
  if (value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatCoordinates(coords) {
  if (!coords || typeof coords.lat !== "number" || typeof coords.lon !== "number") {
    return bi("not_provided");
  }
  return `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`;
}

function buildMapHtml(diveSite) {
  const coords = diveSite.coordinates;
  if (coords && typeof coords.lat === "number" && typeof coords.lon === "number") {
    const bbox = buildBbox(coords.lat, coords.lon, 0.02);
    const src =
      `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lon}`;
    const link = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=14/${coords.lat}/${coords.lon}`;
    return `<iframe class="map-frame" title="Dive site map" src="${src}" loading="lazy"></iframe>
    <p class="map-note"><a href="${link}" target="_blank" rel="noopener noreferrer">${escapeHtml(bi("open_large_map"))}</a></p>`;
  }
  if (diveSite.address) {
    const q = encodeURIComponent(diveSite.address);
    const src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&query=${q}`;
    const link = `https://www.openstreetmap.org/search?query=${q}`;
    return `<iframe class="map-frame" title="Dive site map" src="${src}" loading="lazy"></iframe>
    <p class="map-note"><a href="${link}" target="_blank" rel="noopener noreferrer">${escapeHtml(bi("open_search_map"))}</a> - ${escapeHtml(bi("precise_marker_hint"))}</p>`;
  }
  return `<p class="map-note">${escapeHtml(bi("no_map_data"))}</p>`;
}

function buildBbox(lat, lon, pad) {
  const minLon = (lon - pad).toFixed(6);
  const minLat = (lat - pad).toFixed(6);
  const maxLon = (lon + pad).toFixed(6);
  const maxLat = (lat + pad).toFixed(6);
  return `${minLon},${minLat},${maxLon},${maxLat}`;
}

function buildDiveSiteLookupQueries(name, address) {
  const safeName = String(name || "").trim();
  const safeAddress = String(address || "").trim();
  const queries = [];

  const addQuery = (query) => {
    const text = String(query || "").trim();
    if (!text) return;
    if (!queries.some((item) => item.toLowerCase() === text.toLowerCase())) {
      queries.push(text);
    }
  };

  if (safeName && safeAddress) {
    addQuery(`${safeName}, ${safeAddress}`);
  }
  addQuery(safeName);
  addQuery(safeAddress);

  for (const variant of buildJoinedWordVariants(safeAddress)) {
    if (safeName) {
      addQuery(`${safeName}, ${variant}`);
    }
    addQuery(variant);
  }

  for (const variant of buildJoinedWordVariants(safeName)) {
    if (safeAddress) {
      addQuery(`${variant}, ${safeAddress}`);
    }
    addQuery(variant);
  }

  return queries.slice(0, 5);
}

function formatElevationForExport(elevationM) {
  const elevation = toNullableNum(elevationM);
  if (elevation === null) return "-";
  const base = formatMetricImperial(elevation);
  if (elevation > 300) {
    return `${base} <strong>| Altitude Dive!</strong>`;
  }
  return base;
}

async function geocodeDiveSite(queries) {
  for (const query of queries) {
    const result = await geocodeAddress(query);
    if (result) return result;
  }
  return null;
}

function buildJoinedWordVariants(text) {
  const tokens = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return [];

  const variants = [];
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const merged = tokens
      .map((token, tokenIndex) => {
        if (tokenIndex === index) return `${token}${tokens[tokenIndex + 1]}`;
        if (tokenIndex === index + 1) return null;
        return token;
      })
      .filter(Boolean)
      .join(" ");
    variants.push(merged);
  }

  variants.push(tokens.join(""));
  return uniquePreserveOrder(variants);
}

async function geocodeAddress(address) {
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&namedetails=1&extratags=1&q=${encodeURIComponent(address)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;
  const result = results[0];
  const lat = toNullableNum(result.lat);
  const lon = toNullableNum(result.lon);
  const countryCode = (result.address?.country_code || "").toLowerCase() || null;
  const extraTags = result.extratags || {};
  if (lat === null || lon === null) return null;
  return {
    lat: roundTo5(lat),
    lon: roundTo5(lon),
    countryCode,
    resolvedName: extractResolvedPlaceName(result),
    resolvedAddress: extractResolvedAddress(result),
    diveBasePhone: extractContactValue(extraTags, ["contact:phone", "phone"]),
    diveBaseWebsite: extractContactValue(extraTags, ["contact:website", "website", "url"])
  };
}

function extractContactValue(extraTags, keys) {
  for (const key of keys) {
    const value = String(extraTags?.[key] || "").trim();
    if (value) return value;
  }
  return "";
}

function extractResolvedPlaceName(result) {
  const candidates = [
    result?.namedetails?.name,
    result?.namedetails?.official_name,
    result?.namedetails?.brand,
    result?.namedetails?.operator,
    result?.name,
    result?.address?.attraction,
    result?.address?.tourism,
    result?.address?.leisure,
    result?.address?.amenity,
    result?.address?.shop,
    result?.address?.building
  ];

  for (const candidate of candidates) {
    const text = String(candidate || "").trim();
    if (text) return text;
  }

  return "";
}

function extractResolvedAddress(result) {
  const placeName = extractResolvedPlaceName(result).toLowerCase();
  const address = result?.address || {};
  const parts = [
    joinStreetAddress(address),
    address.postcode,
    address.city || address.town || address.village || address.municipality || address.hamlet,
    address.state,
    address.country
  ]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .filter((part) => part.toLowerCase() !== placeName);

  const compact = uniquePreserveOrder(parts).join(", ");
  if (compact) return compact;

  const fallback = String(result?.display_name || "").trim();
  if (!fallback) return "";

  if (!placeName) return fallback;
  const fallbackParts = fallback
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => part.toLowerCase() !== placeName);
  return uniquePreserveOrder(fallbackParts).join(", ");
}

function joinStreetAddress(address) {
  const number = String(address?.house_number || "").trim();
  const street = String(address?.road || address?.pedestrian || address?.footway || address?.path || "").trim();
  if (street && number) return `${street} ${number}`;
  return street || number;
}

function uniquePreserveOrder(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const normalized = String(item || "").trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

async function fetchApproxElevation(lat, lon) {
  try {
    const url =
      `https://api.open-meteo.com/v1/elevation?latitude=${encodeURIComponent(String(lat))}&longitude=${encodeURIComponent(String(lon))}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    const elevation = toNullableNum(payload?.elevation?.[0] ?? "");
    if (elevation === null) return null;
    return Math.round(elevation);
  } catch {
    return null;
  }
}

function roundTo5(value) {
  return Math.round(value * 100000) / 100000;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function showErrorToast(text) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast toast-error";
  toast.textContent = text;
  toastContainer.appendChild(toast);
  window.setTimeout(() => {
    toast.classList.add("toast-hide");
    window.setTimeout(() => toast.remove(), 250);
  }, TOAST_DURATION_MS);
}

function renderReadiness(data) {
  const elevation = toNullableNum(data?.dive_site?.elevation_m ?? "");
  const isAltitudeDive = elevation !== null && elevation > 300;
  altitudeDiveNote.classList.toggle("hidden", !isAltitudeDive);
}

function updateLanguageUiState() {
  const auto = state.meta.auto_local_language || "none";
  const effective = getEffectiveLocalLanguage();
  const extra = state.meta.optional_extra_language || "none";
  const cc = state.dive_site.country_code ? state.dive_site.country_code.toUpperCase() : null;
  const autoLabel = auto !== "none" ? (LANGUAGE_LABEL[auto] || auto) : "not resolved";
  const effectiveLabel = effective !== "none" ? (LANGUAGE_LABEL[effective] || effective) : "none";
  const overrideOn = state.meta.country_override_code !== "none";
  autoLocalInfo.textContent = cc
    ? `EN + Local (auto): ${autoLabel} [${cc}] | Effective local: ${effectiveLabel}${overrideOn ? " (override)" : ""}`
    : `EN + Local (auto): ${autoLabel}. Use "Locate Address" to resolve. Effective local: ${effectiveLabel}${overrideOn ? " (override)" : ""}`;

  const translated = [effective, extra].filter((x) => x && x !== "none" && FULLY_TRANSLATED.has(x));
  if (translated.length === 0) {
    langSupportNote.textContent = "Only English labels currently active.";
    return;
  }
  langSupportNote.textContent = "Auto local + optional extra are shown where translations are available.";
}

function renderStaticI18n() {
  const nodes = document.querySelectorAll("[data-i18n-key]");
  for (const node of nodes) {
    const key = node.dataset.i18nKey;
    node.textContent = biText(key);
  }
  syncHeaderLogoHeight();
}

function biText(key) {
  const entry = I18N[key];
  if (!entry) return key;
  const langs = getUiLanguages();
  const labels = [];
  for (const lang of langs) {
    const text = resolveI18nText(key, entry, lang);
    if (!labels.includes(text)) labels.push(text);
  }
  return labels.join(" / ");
}

function bi(key) {
  return biText(key);
}

function biExportText(key) {
  const entry = I18N[key];
  if (!entry) return key;
  const langs = getExportLanguages();
  const labels = [];
  for (const lang of langs) {
    const text = resolveI18nText(key, entry, lang);
    if (!labels.includes(text)) labels.push(text);
  }
  return labels.join(" / ");
}

function biRaw(en, de, es, ar) {
  return biRawText(en, de, es, ar);
}

function biRawText(en, de, es, ar) {
  const langs = getUiLanguages();
  const labels = [en];
  for (const lang of langs) {
    if (lang === "en") continue;
    const t = resolveRawText(en, de, es, ar, lang);
    if (t && !labels.includes(t)) labels.push(t);
  }
  return labels.join(" / ");
}

function biHtml(key) {
  const entry = I18N[key];
  if (!entry) return escapeHtml(key);
  const langs = getExportLanguages();
  const seen = new Set();
  const lines = [];
  for (const lang of langs) {
    const text = resolveI18nText(key, entry, lang);
    if (seen.has(text)) continue;
    seen.add(text);
    const cls = lang === "en" ? "i18n-line i18n-en" : `i18n-line i18n-alt i18n-${lang}`;
    const attrs = lang === "ar" ? ' dir="rtl" lang="ar"' : "";
    const content = lang === "en" ? escapeHtml(text) : `<em>${escapeHtml(text)}</em>`;
    lines.push(`<span class="${cls}"${attrs}>${content}</span>`);
  }
  return lines.join("");
}

function biRawHtml(en, de, es, ar) {
  const langs = getExportLanguages();
  const lines = [];
  const add = (lang, text) => {
    if (!text) return;
    if (lines.some((x) => x.text === text)) return;
    lines.push({ lang, text });
  };
  add("en", en);
  for (const lang of langs) {
    if (lang === "en") continue;
    add(lang, resolveRawText(en, de, es, ar, lang));
  }
  return lines
    .map((line) => {
      const cls = line.lang === "en" ? "i18n-line i18n-en" : `i18n-line i18n-alt i18n-${line.lang}`;
      const attrs = line.lang === "ar" ? ' dir="rtl" lang="ar"' : "";
      const content = line.lang === "en" ? escapeHtml(line.text) : `<em>${escapeHtml(line.text)}</em>`;
      return `<span class="${cls}"${attrs}>${content}</span>`;
    })
    .join("");
}

function getUiLanguages() {
  const langs = ["en"];
  const extra = state.meta.optional_extra_language || "none";
  if (extra !== "none" && !langs.includes(extra)) langs.push(extra);
  return langs;
}

function populateCountryOverrideCountrySelect(continent, selectedCode = "none") {
  if (!countryOverrideCountrySelect || !countryOverrideCountryField) return;
  const options = COUNTRY_OVERRIDE_OPTIONS[continent] || [];
  countryOverrideCountrySelect.innerHTML = [
    `<option value="none">Select country</option>`,
    ...options.map((option) => `<option value="${escapeHtml(option.code)}"${option.code === selectedCode ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
  ].join("");
  countryOverrideCountryField.classList.toggle("hidden", continent === "none");
}

function getCountryOverrideContinent(code) {
  const normalized = String(code || "").toLowerCase();
  if (!normalized || normalized === "none") return "none";
  for (const [continent, options] of Object.entries(COUNTRY_OVERRIDE_OPTIONS)) {
    if (options.some((option) => option.code === normalized)) return continent;
  }
  return "none";
}

function getExportLanguages() {
  const langs = ["en"];
  const local = getEffectiveLocalLanguage();
  const extra = state.meta.optional_extra_language || "none";
  if (local !== "none" && !langs.includes(local)) langs.push(local);
  if (extra !== "none" && !langs.includes(extra)) langs.push(extra);
  return langs;
}

function getEffectiveLocalLanguage() {
  const overrideCode = state.meta.country_override_code || "none";
  if (overrideCode !== "none") {
    return resolveLocalLanguage(overrideCode);
  }
  return state.meta.auto_local_language || "none";
}

function resolveLocalLanguage(countryCode) {
  if (!countryCode) return "none";
  return LOCAL_LANGUAGE_BY_COUNTRY[String(countryCode).toLowerCase()] || "none";
}

function resolveI18nText(key, entry, lang) {
  if (entry[lang]) return entry[lang];
  const extra = I18N_EXTRA_TRANSLATIONS[key];
  if (extra && extra[lang]) return extra[lang];
  return entry.en;
}

function resolveRawText(en, de, es, ar, lang) {
  if (lang === "de" && de) return de;
  if (lang === "es" && es) return es;
  if (lang === "ar" && ar) return ar;
  return RAW_TRANSLATIONS[lang]?.[en] || null;
}

function extractDiveSiteFromImport(data) {
  if (data?.dive_site && typeof data.dive_site === "object") return data.dive_site;
  if (data && typeof data === "object" && ("name" in data || "address" in data)) return data;
  throw new Error("No dive_site section found.");
}

function extractDiversFromImport(data) {
  if (Array.isArray(data?.divers)) {
    return data.divers.map(normalizeDiver).filter(Boolean);
  }
  if (Array.isArray(data)) {
    return data.map(normalizeDiver).filter(Boolean);
  }
  if (data && typeof data === "object" && ("full_name" in data || "birth_date" in data || "phone" in data)) {
    return [normalizeDiver(data)];
  }
  throw new Error("No diver data found.");
}

function normalizeDiveSite(site) {
  const coordinates = normalizeCoordinates(site?.coordinates, site?.lat, site?.lon);
  return {
    name: String(site?.name || ""),
    address: String(site?.address || ""),
    elevation_m: toNum(site?.elevation_m),
    country_code: site?.country_code ? String(site.country_code).toLowerCase() : null,
    coordinates,
    dive_base_phone: String(site?.dive_base_phone || ""),
    dive_base_website: String(site?.dive_base_website || ""),
    oxygen_location: String(site?.oxygen_location || ""),
    local_emergency_number: String(site?.local_emergency_number || getLocalEmergencyNumber(site?.country_code)),
    emergency_phone_location: String(site?.emergency_phone_location || ""),
    chamber_info: String(site?.chamber_info || "")
  };
}

function normalizeCoordinates(coords, latFallback, lonFallback) {
  const lat = toNullableNum(coords?.lat ?? latFallback ?? "");
  const lon = toNullableNum(coords?.lon ?? lonFallback ?? "");
  if (lat === null || lon === null) return null;
  return { lat, lon };
}

function normalizeDiver(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const contacts = normalizeEmergencyContacts(src.emergency_contacts, src.em_name, src.em_relation, src.em_phone);
  return {
    full_name: String(src.full_name || src.name || ""),
    sex: String(src.sex || "M"),
    birth_date: String(src.birth_date || ""),
    address: String(src.address || ""),
    dive_count: Math.trunc(toNum(src.dive_count)),
    certifications: normalizeStringList(src.certifications),
    breathing_gas: String(src.breathing_gas || src.gas || ""),
    allergies: normalizeStringList(src.allergies),
    medical: {
      conditions: normalizeStringList(src.medical?.conditions ?? src.conditions),
      medications: normalizeStringList(src.medical?.medications ?? src.medications)
    },
    insurance: {
      health_insurance: String(src.insurance?.health_insurance ?? src.health_insurance ?? ""),
      dive_insurance_provider: String(src.insurance?.dive_insurance_provider ?? src.dive_insurance_provider ?? ""),
      dive_insurance_member_no: String(src.insurance?.dive_insurance_member_no ?? src.dive_insurance_member_no ?? ""),
      dive_insurance_hotline: String(src.insurance?.dive_insurance_hotline ?? src.dive_insurance_hotline ?? "")
    },
    emergency_contacts: contacts,
    phone: String(src.phone || src.own_phone || "")
  };
}

function normalizeStringList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") return splitCsv(value);
  return [];
}

function normalizeEmergencyContacts(list, name, relation, phone) {
  if (Array.isArray(list) && list.length > 0) {
    const cleaned = list
      .map((c) => ({
        name: String(c?.name || ""),
        relation: String(c?.relation || ""),
        phone: String(c?.phone || "")
      }))
      .filter((c) => c.name || c.relation || c.phone)
      .slice(0, 2);
    if (cleaned.length > 0) {
      while (cleaned.length < 2) cleaned.push(createEmptyEmergencyContact());
      return cleaned;
    }
  }
  if (name || relation || phone) {
    return [
      { name: String(name || ""), relation: String(relation || ""), phone: String(phone || "") },
      createEmptyEmergencyContact()
    ];
  }
  return [createEmptyEmergencyContact(), createEmptyEmergencyContact()];
}

function isDiverEffectivelyEmpty(diver) {
  if (!diver) return true;
  return !diver.full_name &&
    !diver.birth_date &&
    !diver.phone &&
    !diver.address &&
    !diver.breathing_gas &&
    (diver.dive_count || 0) === 0 &&
    normalizeStringList(diver.certifications).length === 0 &&
    normalizeStringList(diver.allergies).length === 0 &&
    normalizeStringList(diver.medical?.conditions).length === 0 &&
    normalizeStringList(diver.medical?.medications).length === 0;
}

function initializeCallerStartAddress(data) {
  if (data.dive_site?.address) return;
  data.dive_site.address = "United States";
  data.dive_site.country_code = "us";
  data.dive_site.local_emergency_number = getLocalEmergencyNumber(data.dive_site.country_code);
  data.meta.auto_local_language = resolveLocalLanguage("us");
  shouldClearInitialDiveSiteAddress = true;
}

function clearInitialDiveSiteAddressAfterBootstrap() {
  if (!shouldClearInitialDiveSiteAddress) return;
  shouldClearInitialDiveSiteAddress = false;
  state.dive_site.address = "";
  state.dive_site.country_code = null;
  state.dive_site.local_emergency_number = "";
  state.meta.auto_local_language = "none";
  setField("dive_site.address", "");
  setField("dive_site.local_emergency_number", "");
}

function getLocalEmergencyNumber(countryCode) {
  const code = String(countryCode || "").toLowerCase();
  if (!code || !ALL_ISO_COUNTRY_CODES.has(code)) return "";
  return VERIFIED_EMERGENCY_NUMBER_BY_COUNTRY[code] || "";
}

function inferCallerCountryCode() {
  const langs = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || ""];
  for (const lang of langs) {
    const m = String(lang).match(/-([A-Za-z]{2})\b/);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

function getCountryName(code) {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return dn.of(code) || code;
  } catch {
    return code;
  }
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildPdfFileName(data) {
  const site = sanitizeFilePart(data.dive_site?.name || "DiveSite");
  const date = todayIso();
  return `SafeDiveCard-${site}-${date}`;
}

function buildDiveDataFileName(data) {
  const site = sanitizeFilePart(data.dive_site?.name || "DiveSite");
  const date = todayIso();
  return `SafeDiveCard-Dive-${site}-${date}`;
}

function buildDiveSiteFileName(data) {
  const site = sanitizeFilePart(data.dive_site?.name || "DiveSite");
  return `SafeDiveCard-Site-${site}`;
}

function buildDiverFileName(diver) {
  const name = sanitizeFilePart(diver?.full_name || "Diver");
  return `SafeDiveCard-Diver-${name}`;
}

function sanitizeFilePart(input) {
  const ascii = String(input ?? "DiveSite")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return ascii
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "DiveSite";
}

function escapeHtml(input) {
  const text = String(input ?? "");
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function syncHeaderLogoHeight() {
  if (!toolTitleGroupEl || !toolBrandLogoEl) return;
  const h = toolTitleGroupEl.offsetHeight;
  if (!h) return;
  toolBrandLogoEl.style.height = `${Math.round(h * 2.12)}px`;
}

function fitCardPages() {
  const pages = [...cardEl.querySelectorAll(".card-page")];
  for (const pageEl of pages) {
    fitSingleCardPage(pageEl);
  }
}

function fitSingleCardPage(pageEl) {
  if (!pageEl) return;
  const minScale = pageEl.classList.contains("card-page-cont") ? 0.62 : 0.58;
  const maxScale = pageEl.classList.contains("card-page-cont") ? 1.3 : 1.45;
  let low = minScale;
  let high = maxScale;
  let best = minScale;

  while ((high - low) > 0.01) {
    const mid = (low + high) / 2;
    if (cardPageFits(pageEl, mid)) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  pageEl.style.setProperty("--page-scale", best.toFixed(3));
  fitCardHeaderTitle(pageEl);
}

function cardPageFits(pageEl, scale) {
  pageEl.style.setProperty("--page-scale", scale.toFixed(3));
  fitCardHeaderTitle(pageEl);
  return pageEl.scrollHeight <= (pageEl.clientHeight + 1) &&
    pageEl.scrollWidth <= (pageEl.clientWidth + 1) &&
    !pageHasClippedContent(pageEl);
}

function pageHasClippedContent(pageEl) {
  const boxes = pageEl.querySelectorAll(
    ".card-page-body, .card-section-row, .section-body, .card-header h3, .side-label, .data-table, .data-table th, .data-table td"
  );
  for (const box of boxes) {
    if (!box.clientHeight || !box.clientWidth) continue;
    if (box.scrollHeight > (box.clientHeight + 1) || box.scrollWidth > (box.clientWidth + 1)) {
      return true;
    }
  }
  return false;
}

function fitCardHeaderTitle(pageEl) {
  const titleEl = pageEl?.querySelector(".card-header h3");
  if (!titleEl) return;
  titleEl.style.fontSize = "";
  const min = 10;
  let size = parseFloat(window.getComputedStyle(titleEl).fontSize) || 28;
  while (titleEl.scrollWidth > titleEl.clientWidth && size > min) {
    size -= 0.5;
    titleEl.style.fontSize = `${size}px`;
  }
}
