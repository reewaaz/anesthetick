// Build script: enriches data.js with a reference registry and per-sub-item resources.
// Run: node build-refs.js   (overwrites data.js)
const fs = require('fs');

const CURRICULUM = require('./data.js');

// ── Reference source registry ────────────────────────────────────────────────
// Maps every ref code used in the curriculum to a real, citable source.
// `type`: book | society | guideline | journal | site
// `url`: stable landing page (publisher / official org / homepage). Never a deep
//        article page that can 404 — those are generated as searches at render time.
const REF_SOURCES = {
  // Textbooks
  MM:  { label: "Morgan & Mikhail's Clinical Anesthesiology", sub: "6th ed (2022), McGraw Hill", type: 'book',
         url: 'https://www.mhprofessional.com/morgan-and-mikhail-s-clinical-anesthesiology-seventh-edition-9781264269506-usa' },
  MIL: { label: "Miller's Anesthesia", sub: "10th ed (2025), Elsevier", type: 'book',
         url: 'https://www.elsevier.com/books/millers-anesthesia/gropper/978-0-323-93776-7' },
  DD:  { label: "Dorsch & Dorsch — Understanding Anesthesia Equipment", sub: "6th ed (2022), Lippincott", type: 'book',
         url: 'https://shop.lww.com/Understanding-Anesthesia-Equipment/p/9781975143040' },

  // Societies / syllabi / journals
  RCoA: { label: "RCoA Curriculum & Syllabus", sub: "Royal College of Anaesthetists (maps what to know, not how to learn it)", type: 'syllabus',
          url: 'https://www.rcoa.ac.uk/curriculum' },
  OX:   { label: "OpenAnesthesia", sub: "Free peer-reviewed education (articles & podcasts)", type: 'site',
          url: 'https://openanesthesia.org' },
  'OX Ob':   { label: "OpenAnesthesia — Obstetric", sub: "Obstetric anaesthesia articles", type: 'site',
               url: 'https://openanesthesia.org/?s=obstetric' },
  'OX Pain': { label: "OpenAnesthesia — Pain", sub: "Pain medicine articles", type: 'site',
               url: 'https://openanesthesia.org/?s=pain' },
  PS:   { label: "PhysiologyWeb / free physiology texts", sub: "Open physiology teaching", type: 'site',
          url: 'https://www.physiologyweb.com' },
  GS:   { label: "NYSORA — Regional Anaesthesia", sub: "Free regional & anatomy resources", type: 'site',
          url: 'https://www.nysora.com' },
  LITFL:{ label: "Life in the Fast Lane (LITFL)", sub: "FOAMed articles & summaries", type: 'site',
          url: 'https://litfl.com' },
  DP:   { label: "Deranged Physiology", sub: "Free notes for anaesthesia trainees", type: 'site',
          url: 'https://derangedphysiology.com' },

  // Guidelines & societies
  'AHA guidelines':  { label: "American Heart Association guidelines", type: 'guideline', url: 'https://cpr.heart.org/en/guidelines' },
  APLS:  { label: "APLS (Advanced Paediatric Life Support)", type: 'guideline', url: 'https://www.resus.org.uk/library' },
  'ASRA guidelines':{ label: "ASRA Pain Medicine guidelines", type: 'guideline', url: 'https://www.asra.com' },
  ATLS:  { label: "ATLS (Advanced Trauma Life Support)", type: 'guideline', url: 'https://www.facs.org/quality-programs/trauma/atls/' },
  'DAS guidelines': { label: "Difficult Airway Society guidelines", type: 'guideline', url: 'https://das.uk.com/guidelines/' },
  'ERC guidelines': { label: "European Resuscitation Council guidelines", type: 'guideline', url: 'https://ercguidelines.elsevier.com' },
  'ESC guidelines': { label: "ESC Guidelines", sub: "European Society of Cardiology", type: 'guideline', url: 'https://www.escardio.org/Guidelines' },
  'MBRRACE-UP': { label: "MBRRACE-UK reports", sub: "Maternal mortality surveillance", type: 'guideline', url: 'https://www.npeu.ox.ac.uk/mbrace-uk' },
  RCUK:  { label: "Resuscitation Council UK", type: 'guideline', url: 'https://www.resus.org.uk' },
  'SSC guidelines': { label: "Surviving Sepsis Campaign", type: 'guideline', url: 'https://www.survivingsepsis.org' },
  NLS:   { label: "Newborn Life Support (RCUK)", type: 'guideline', url: 'https://www.resus.org.uk/library' },
  'Working Together': { label: "Working Together — RCoA/RCM maternity guidance", type: 'guideline', url: 'https://www.rcoa.ac.uk' },
  // RCoA curriculum modules (syllabus map only)
  'RCoA G1': { label: "RCoA Curriculum — Module G1 (Basic & Clinical Sciences)", type: 'syllabus', url: 'https://www.rcoa.ac.uk/curriculum' },
  'RCoA G2': { label: "RCoA Curriculum — Module G2 (Physiology & Pharmacology)", type: 'syllabus', url: 'https://www.rcoa.ac.uk/curriculum' },
  'RCoA G3': { label: "RCoA Curriculum — Module G3 (Pharmacology & Therapeutics)", type: 'syllabus', url: 'https://www.rcoa.ac.uk/curriculum' },
  'RCoA G4': { label: "RCoA Curriculum — Module G4 (Clinical Anaesthesia & Perioperative Care)", type: 'syllabus', url: 'https://www.rcoa.ac.uk/curriculum' },
  'RCoA F2': { label: "RCoA Curriculum — Domain F2 (Physical Sciences)", type: 'syllabus', url: 'https://www.rcoa.ac.uk/curriculum' },
  'RCoA F3': { label: "RCoA Curriculum — Domain F3 (Clinical Measurement)", type: 'syllabus', url: 'https://www.rcoa.ac.uk/curriculum' },
};

// Resolve a ref token to its base source entry + optional chapter.
function resolveSource(code) {
  if (REF_SOURCES[code]) return { src: REF_SOURCES[code], chapter: null };
  const m = code.match(/^([A-Za-z& ]+?)\s+Ch\.([\d\-]+)$/);
  if (m) {
    const base = m[1].trim();
    const src = REF_SOURCES[base];
    if (src) return { src, chapter: m[2] };
  }
  if (code.startsWith('RCoA')) return { src: REF_SOURCES['RCoA'], chapter: null };
  return null;
}

// Optional chapter titles to make "MM Ch.20" meaningful. Only filled where confident;
// missing entries fall back to just the chapter number.
const CHAPTER_TITLES = {
  'MM:4': 'Physics & Measurement', 'MM:5': 'Electrical, Optical & Ultrasound Principles',
  'MM:7': 'General Pharmacology & Pharmacokinetics', 'MM:8': 'Inhaled Anaesthetics',
  'MM:9': 'Intravenous Anaesthetics', 'MM:10': 'Opioids & Analgesics',
  'MM:11': 'Neuromuscular Blocking Drugs', 'MM:13': 'Autonomic Pharmacology',
  'MM:14': 'Cardiovascular Drugs', 'MM:15': 'Airway Management',
  'MM:16': 'Local Anaesthetics', 'MM:17': 'Regional Anaesthesia',
  'MM:18': 'Cardiovascular Disease', 'MM:19': 'Respiratory Disease',
  'MM:20': 'Monitoring & Intraoperative Care', 'MM:21': 'Monitoring & Mechanical Ventilation',
  'MM:22': 'Haematology, Transfusion & Fluid Therapy', 'MM:23': 'Endocrine & Metabolic Disease',
  'MM:24': 'Neurological & Neuromuscular Disease', 'MM:26': 'Obstetric & Foetal Physiology',
  'MM:27': 'Paediatric Anaesthesia', 'MM:30': 'Pain Physiology & Management',
  'MM:31': 'Acute & Chronic Pain', 'MM:35': 'Endocrine Physiology',
  'MM:39': 'Hepatic Disease', 'MM:40': 'Obstetric Physiology',
  'MM:41': 'Labour & Delivery', 'MM:47': 'Pain Mechanisms',
  'MM:51': 'Acid-Base Physiology', 'MM:52': 'Electrolyte Disorders',
  'MM:57': 'Shock & Oxygen Delivery',
  'MIL:24': 'Mechanical Ventilation', 'MIL:27': 'Airway Management',
  'MIL:30': 'Pharmacokinetics & IV Anaesthetics', 'MIL:31': 'Inhaled Agents & Opioids',
  'MIL:32': 'Neuromuscular Blockade', 'MIL:33': 'Reversal & Monitoring',
  'MIL:34': 'Regional Anaesthesia', 'MIL:35': 'Fluid, Electrolyte & Cardiovascular Drugs',
  'MIL:36': 'ICU Monitoring', 'MIL:47': 'Paediatric Physiology',
  'MIL:81': 'Neurophysiology & EEG', 'MIL:91': 'One-Lung Ventilation',
  'DD:1-2': 'Gas Physics', 'DD:5': 'Flow & Fluid Dynamics', 'DD:14-16': 'Measurement & Monitoring',
  'DD:19': 'Electrical Safety & Diathermy',
};

// ── Curated article map (keyword -> real URL) from prior enhance-data.js ──────
// Hosts confirmed stable are used directly; unstable hosts are re-routed to a
// site-scoped search at render time (see app.js TRUSTED_EXACT).
const ARTICLE_MAP = {
  'SI units': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement',
  'Non-SI units': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement',
  'Mass, force': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement',
  "Newton's laws": 'https://www.anaesthesiauk.com/article.aspx?articleid=100053',
  'Temperature scales': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation',
  'Heat transfer': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation',
  'Latent heat': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation',
  'Humidity': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/humidity',
  'Kinetic theory': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  "Boyle's Law": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  "Charles' Law": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  "Dalton's Law": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  "Henry's Law": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  "Avogadro": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  "Fick's law": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Ideal gas law': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/ideal-gas-law',
  'Critical temperature': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/critical-temperature-and-pressure',
  'Saturated vapour': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/saturated-vapour-pressure',
  'Viscosity': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Reynolds number': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Laminar flow': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Turbulent flow': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Bernoulli': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Venturi': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws',
  'Electromagnetic spectrum': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/electromagnetic-spectrum',
  'Fiberoptics': 'https://derangedphysiology.com/main/required-reading/anaesthetic-physics/fibreoptics',
  'Laser physics': 'https://derangedphysiology.com/main/required-reading/anaesthetic-physics/laser-physics',
  'Beer-Lambert': 'https://derangedphysiology.com/main/required-reading/anaesthetic-physics/beer-lambert-law',
  'Pulse oximetry': 'https://derangedphysiology.com/main/required-reading/clinical-measurement/pulse-oximetry',
  'Oxyhemoglobin': 'https://derangedphysiology.com/main/required-reading/clinical-measurement/pulse-oximetry',
  'CO-oximetry': 'https://derangedphysiology.com/main/required-reading/clinical-measurement/co-oximetry',
  "Ohm's law": 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/electricity-basics',
  'Diathermy': 'https://litfl.com/diathermy-and-electrosurgical-safety/',
  'Pacemaker': 'https://litfl.com/pacemaker-basics/',
  'Fire triad': 'https://www.apsf.org/fire-safety/',
  'Piezoelectric': 'https://derangedphysiology.com/main/required-reading/anaesthetic-physics/ultrasound-physics',
  'Doppler effect': 'https://derangedphysiology.com/main/required-reading/anaesthetic-physics/ultrasound-physics',
  'Pressure transducers': 'https://derangedphysiology.com/main/required-reading/clinical-measurement/pressure-transducers',
  'Capnography': 'https://derangedphysiology.com/main/required-reading/clinical-measurement/capnography',
  'Blood gas': 'https://derangedphysiology.com/main/required-reading/clinical-measurement/blood-gas-analysis',
  'Cell components': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/cell-biology',
  'Cell membrane': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/cell-biology',
  'Water compartments': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/body-fluid-compartments',
  'Osmolarity': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/osmolarity-and-osmolality',
  'Starling forces': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/starling-forces',
  'pKa': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/pka-and-ionization',
  'Glycolysis': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/metabolism',
  'Larynx': 'https://teachmeanatomy.info/neck/the-larynx/',
  'Trachea': 'https://teachmeanatomy.info/thorax/organs/trachea/',
  'Diaphragm': 'https://teachmeanatomy.info/thorax/muscles/diaphragm/',
  'Spinal cord': 'https://teachmeanatomy.info/back/nerves/spinal-cord/',
  'Brachial plexus': 'https://www.nysora.com/topics/brachial-plexus-anatomy/',
  'Heart chambers': 'https://teachmeanatomy.info/thorax/organs/heart/',
  'Coronary artery': 'https://teachmeanatomy.info/thorax/organs/heart/coronary-arteries/',
  'Resting membrane': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/resting-membrane-potential',
  'Action potential': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/action-potential',
  'Sympathetic': 'https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/autonomic-nervous-system',
  'Baroreceptor': 'https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/baroreceptor-reflex',
  'Excitation-contraction': 'https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/excitation-contraction-coupling',
  'Cardiac cycle': 'https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/cardiac-cycle',
  'ECG': 'https://litfl.com/ecg-basics/',
  'Frank-Starling': 'https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/frank-starling-mechanism',
  "Laplace's law": 'https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/laplaces-law',
  'DO2': 'https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/oxygen-delivery-and-consumption',
  'Lung volumes': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-volumes-and-capacities',
  'Dead space': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/dead-space',
  'Compliance': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-compliance',
  'Surfactant': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/surfactant',
  'V/Q': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/ventilation-perfusion-matching',
  'Oxygen cascade': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/oxygen-cascade',
  'Alveolar gas': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/alveolar-gas-equation',
  'Dissociation curve': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/haemoglobin-oxygen-dissociation-curve',
  'Bohr': 'https://derangedphysiology.com/main/required-reading/respiratory-physiology/co2-transport',
  'Henderson-Hasselbalch': 'https://derangedphysiology.com/main/required-reading/acid-base/henderson-hasselbalch-equation',
  'Renal circulation': 'https://derangedphysiology.com/main/required-reading/renal-physiology/renal-blood-flow',
  'GFR': 'https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate',
  'Loop of Henle': 'https://derangedphysiology.com/main/required-reading/renal-physiology/loop-of-henle',
  'RAAS': 'https://derangedphysiology.com/main/required-reading/renal-physiology/renin-angiotensin-aldosterone-system',
  'Hepatic blood flow': 'https://derangedphysiology.com/main/required-reading/hepatology/hepatic-blood-flow',
  'Drug metabolism': 'https://derangedphysiology.com/main/required-reading/hepatology/drug-metabolism',
  'Liver function tests': 'https://derangedphysiology.com/main/required-reading/hepatology/liver-function-tests',
  'Child-Pugh': 'https://derangedphysiology.com/main/required-reading/hepatology/child-pugh-score',
  'Insulins': 'https://derangedphysiology.com/main/required-reading/endocrinology/insulin',
  'DKA': 'https://derangedphysiology.com/main/required-reading/endocrinology/diabetic-ketoacidosis',
  'Thyroid storm': 'https://derangedphysiology.com/main/required-reading/endocrinology/thyroid-storm',
  'CBF autoregulation': 'https://derangedphysiology.com/main/required-reading/neurology/cerebral-blood-flow',
  'Monro-Kellie': 'https://derangedphysiology.com/main/required-reading/neurology/monro-kellie-doctrine',
  'Nociceptors': 'https://derangedphysiology.com/main/required-reading/pain-physiology/nociception',
  'Anion gap': 'https://derangedphysiology.com/main/required-reading/acid-base/anion-gap',
  'Base excess': 'https://derangedphysiology.com/main/required-reading/acid-base/base-excess',
  'Coagulation cascade': 'https://derangedphysiology.com/main/required-reading/haematology/coagulation-cascade',
  'TEG': 'https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing',
  'ADME': 'https://derangedphysiology.com/main/required-reading/pharmacology/adme',
  'Volume of distribution': 'https://derangedphysiology.com/main/required-reading/pharmacology/volume-distribution',
  'Clearance': 'https://derangedphysiology.com/main/required-reading/pharmacology/clearance',
  'Half-life': 'https://derangedphysiology.com/main/required-reading/pharmacology/half-life',
  'Dose-response': 'https://derangedphysiology.com/main/required-reading/pharmacology/dose-response-curves',
  'MAC': 'https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration',
  'Propofol': 'https://derangedphysiology.com/main/required-reading/pharmacology/propofol',
  'Ketamine': 'https://derangedphysiology.com/main/required-reading/pharmacology/ketamine',
  'Paracetamol': 'https://derangedphysiology.com/main/required-reading/pharmacology/paracetamol',
  'NSAIDs': 'https://derangedphysiology.com/main/required-reading/pharmacology/nsaids',
  'Norepinephrine': 'https://derangedphysiology.com/main/required-reading/pharmacology/norepinephrine',
  'Dobutamine': 'https://derangedphysiology.com/main/required-reading/pharmacology/dobutamine',
  'Amiodarone': 'https://litfl.com/amiodarone/',
  'Beta-blockers': 'https://derangedphysiology.com/main/required-reading/pharmacology/beta-blockers',
  'Sugammadex': 'https://derangedphysiology.com/main/required-reading/pharmacology/sugammadex',
  'ASA Physical Status': 'https://www.asahq.org/standards-and-practice-parameters/statement-on-asa-physical-status-classification-system',
  'Mallampati': 'https://litfl.com/mallampati-score/',
  'RSI': 'https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction',
  'RCRI': 'https://litfl.com/revised-cardiac-risk-index-rcri/',
  'STOP-BANG': 'https://litfl.com/stop-bang-score/',
  'BIS': 'https://derangedphysiology.com/main/required-reading/anaesthesia/bis-monitoring',
  'Difficult Airway': 'https://www.das.uk.com/guidelines/das-intubation-guidelines',
  'Videolaryngoscopy': 'https://www.das.uk.com/guidelines/das-intubation-guidelines',
  'DAS algorithm': 'https://www.das.uk.com/guidelines/das-intubation-guidelines',
  'TIVA': 'https://derangedphysiology.com/main/required-reading/anaesthesia/tiva',
  'CPB': 'https://derangedphysiology.com/main/required-reading/cardiac-anaesthesia/cardiopulmonary-bypass',
  'ICP management': 'https://derangedphysiology.com/main/required-reading/neurology/intracranial-pressure',
  'One-lung ventilation': 'https://derangedphysiology.com/main/required-reading/thoracic-anaesthesia/one-lung-ventilation',
  'PONV': 'https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting',
  'ERAS': 'https://derangedphysiology.com/main/required-reading/anaesthesia/enhanced-recovery-after-surgery',
  'Aortocaval compression': 'https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/maternal-physiological-changes',
  'Epidural analgesia': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/obstetric/epidural-analgesia/',
  'Pre-eclampsia': 'https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/pre-eclampsia',
  'PPH': 'https://litfl.com/postpartum-haemorrhage-pph/',
  'Perimortem C-section': 'https://litfl.com/perimortem-caesarean-section/',
  'Multimodal analgesia': 'https://derangedphysiology.com/main/required-reading/pain/multimodal-analgesia',
  'PCA': 'https://derangedphysiology.com/main/required-reading/pain/patient-controlled-analgesia',
  'CRPS': 'https://litfl.com/complex-regional-pain-syndrome/',
  'Fibromyalgia': 'https://litfl.com/fibromyalgia/',
  'Cancer pain': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/pain-medicine/',
  'ARDS': 'https://derangedphysiology.com/main/required-reading/respiratory/ards',
  'Prone ventilation': 'https://derangedphysiology.com/main/required-reading/respiratory/prone-ventilation',
  'VILI': 'https://derangedphysiology.com/main/required-reading/respiratory/ventilator-induced-lung-injury',
  'Tracheostomy': 'https://litfl.com/tracheostomy/',
  'Sepsis': 'https://derangedphysiology.com/main/required-reading/sepsis/sepsis-definitions',
  'SOFA': 'https://litfl.com/sofa-score/',
  'CRRT': 'https://derangedphysiology.com/main/required-reading/renal/crrt',
  'Brainstem death': 'https://derangedphysiology.com/main/required-reading/neurology/brainstem-death',
  'Paediatric airway': 'https://openanesthesia.org/paediatric-airway-differences/',
  'Caudal': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/pediatric/caudal-block/',
  'Congenital diaphragmatic hernia': 'https://openanesthesia.org/congenital-diaphragmatic-hernia/',
  'Pyloric stenosis': 'https://openanesthesia.org/pyloric-stenosis/',
  'Paediatric resuscitation': 'https://www.resus.org.uk/library/algorithm-archive/paediatric-als-algorithm',
  'Interscalene': 'https://www.nysora.com/topics/upper-extremity/interscalene-block/',
  'Supraclavicular': 'https://www.nysora.com/topics/upper-extremity/supraclavicular-block/',
  'Axillary': 'https://www.nysora.com/topics/upper-extremity/axillary-block/',
  'Femoral': 'https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/',
  'Adductor canal': 'https://www.nysora.com/topics/lower-extremity/adductor-canal-block/',
  'Sciatic': 'https://www.nysora.com/topics/lower-extremity/sciatic-nerve-block/',
  'Spinal Anaesthesia': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/spinal-anesthesia/',
  'Epidural': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/',
  'TAP block': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/truncal-blockade/transverse-abdominis-plane-block/',
  'Paravertebral': 'https://www.nysora.com/topics/sub-specialty-and-other-techniques/truncal-blockade/paravertebral-block/',
  'LAST': 'https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/',
  'BLS algorithm': 'https://www.resus.org.uk/library/algorithm-archive/adult-bls-algorithm',
  'ALS algorithm': 'https://www.resus.org.uk/library/algorithm-archive/adult-als-algorithm',
  'Defibrillation': 'https://litfl.com/defibrillation/',
  'ATLS': 'https://litfl.com/atls-primary-survey/',
  'Massive transfusion': 'https://litfl.com/massive-transfusion-protocol/',
  'Paracetamol overdose': 'https://litfl.com/paracetamol-overdose/',
  'Anaphylaxis': 'https://litfl.com/anaphylaxis/',
  'MH': 'https://litfl.com/malignant-hyperthermia/',
  'Toxicology': 'https://litfl.com/toxicology-overview/',
  'Malignant Hyperthermia': 'https://www.mhaus.org/protocols/',
};

// Hosts whose exact deep URLs were verified live (200 / safe redirect).
// Others in ARTICLE_MAP are re-routed to a site-scoped search at render time.
const TRUSTED_EXACT = ['derangedphysiology.com', 'litfl.com', 'das.uk.com', 'asahq.org'];

function findArticle(text) {
  const t = text.toLowerCase();
  for (const [kw, url] of Object.entries(ARTICLE_MAP)) {
    if (t.includes(kw.toLowerCase())) return url;
  }
  return null;
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

// ── Transform ────────────────────────────────────────────────────────────────
let usedCodes = new Set();
for (const cat of CURRICULUM) {
  for (const sec of cat.sections) {
    for (const topic of sec.topics) {
      const refs = (topic.refs || []).map(r => r.trim());
      refs.forEach(r => usedCodes.add(r));
      if (Array.isArray(topic.sub)) {
        topic.sub = topic.sub.map(item => {
          if (typeof item === 'string') {
            return { t: item, r: refs, a: findArticle(item) };
          }
          return item; // already structured (idempotent re-run)
        });
      }
      delete topic.subLinks;
    }
  }
}

// Warn about any ref code that cannot be resolved to a source.
const missing = [...usedCodes].filter(c => !resolveSource(c));
if (missing.length) console.log('WARN unresolved ref codes:', missing.join(', '));

// ── Serialize ────────────────────────────────────────────────────────────────
function serializeConst(name, obj) {
  return `const ${name} = ${JSON.stringify(obj, null, 2)};\n`;
}

const header = `// Anesthetick — Comprehensive Anesthesia Curriculum Database
// Target: EDAIC Part I & II, Primary FRCA, Final FRCA
//
// Reference sources (books, societies, guidelines). Each ref code used in the
// curriculum resolves to one of these. See app.js for how chips are rendered.
// Article deep-links use TRUSTED_EXACT hosts directly; everything else is
// resolved to a live search (PubMed / site-scoped) at render time so links
// never 404.
`;

let out = header;
out += serializeConst('REF_SOURCES', REF_SOURCES);
out += serializeConst('CHAPTER_TITLES', CHAPTER_TITLES);
out += serializeConst('ARTICLE_MAP', ARTICLE_MAP);
out += `// Hosts whose exact deep URLs are verified live and used directly.
const TRUSTED_EXACT = ${JSON.stringify(TRUSTED_EXACT, null, 2)};
\n`;
out += 'const CURRICULUM = ' + JSON.stringify(CURRICULUM, null, 2) + ';\n\n';
out += `if (typeof window !== "undefined") {
  window.CURRICULUM = CURRICULUM;
  window.REF_SOURCES = REF_SOURCES;
  window.CHAPTER_TITLES = CHAPTER_TITLES;
  window.ARTICLE_MAP = ARTICLE_MAP;
  window.TRUSTED_EXACT = TRUSTED_EXACT;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CURRICULUM;
}
`;

fs.writeFileSync('data.js', out);
console.log('Wrote data.js —', CURRICULUM.length, 'categories,', usedCodes.size, 'ref codes.');
