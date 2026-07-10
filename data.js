// Anesthetick — Comprehensive Anesthesia Curriculum Database
// Target: EDAIC Part I & II, Primary FRCA, Final FRCA
//
// Reference sources (books, societies, guidelines). Each ref code used in the
// curriculum resolves to one of these. See app.js for how chips are rendered.
// Article deep-links use TRUSTED_EXACT hosts directly; everything else is
// resolved to a live search (PubMed / site-scoped) at render time so links
// never 404.
const REF_SOURCES = {
  "MM": {
    "label": "Morgan & Mikhail's Clinical Anesthesiology",
    "sub": "6th ed (2022), McGraw Hill",
    "type": "book",
    "url": "https://www.mhprofessional.com/morgan-and-mikhail-s-clinical-anesthesiology-seventh-edition-9781264269506-usa"
  },
  "MIL": {
    "label": "Miller's Anesthesia",
    "sub": "10th ed (2025), Elsevier",
    "type": "book",
    "url": "https://www.elsevier.com/books/millers-anesthesia/gropper/978-0-323-93776-7"
  },
  "DD": {
    "label": "Dorsch & Dorsch — Understanding Anesthesia Equipment",
    "sub": "6th ed (2022), Lippincott",
    "type": "book",
    "url": "https://shop.lww.com/Understanding-Anesthesia-Equipment/p/9781975143040"
  },
  "RCoA": {
    "label": "RCoA Curriculum & Syllabus",
    "sub": "Royal College of Anaesthetists (maps what to know, not how to learn it)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  },
  "OX": {
    "label": "OpenAnesthesia",
    "sub": "Free peer-reviewed education (articles & podcasts)",
    "type": "site",
    "url": "https://openanesthesia.org"
  },
  "OX Ob": {
    "label": "OpenAnesthesia — Obstetric",
    "sub": "Obstetric anaesthesia articles",
    "type": "site",
    "url": "https://openanesthesia.org/?s=obstetric"
  },
  "OX Pain": {
    "label": "OpenAnesthesia — Pain",
    "sub": "Pain medicine articles",
    "type": "site",
    "url": "https://openanesthesia.org/?s=pain"
  },
  "PS": {
    "label": "PhysiologyWeb / free physiology texts",
    "sub": "Open physiology teaching",
    "type": "site",
    "url": "https://www.physiologyweb.com"
  },
  "GS": {
    "label": "NYSORA — Regional Anaesthesia",
    "sub": "Free regional & anatomy resources",
    "type": "site",
    "url": "https://www.nysora.com"
  },
  "LITFL": {
    "label": "Life in the Fast Lane (LITFL)",
    "sub": "FOAMed articles & summaries",
    "type": "site",
    "url": "https://litfl.com"
  },
  "DP": {
    "label": "Deranged Physiology",
    "sub": "Free notes for anaesthesia trainees",
    "type": "site",
    "url": "https://derangedphysiology.com"
  },
  "AHA guidelines": {
    "label": "American Heart Association guidelines",
    "type": "guideline",
    "url": "https://cpr.heart.org/en/guidelines"
  },
  "APLS": {
    "label": "APLS (Advanced Paediatric Life Support)",
    "type": "guideline",
    "url": "https://www.resus.org.uk/library"
  },
  "ASRA guidelines": {
    "label": "ASRA Pain Medicine guidelines",
    "type": "guideline",
    "url": "https://www.asra.com"
  },
  "ATLS": {
    "label": "ATLS (Advanced Trauma Life Support)",
    "type": "guideline",
    "url": "https://www.facs.org/quality-programs/trauma/atls/"
  },
  "DAS guidelines": {
    "label": "Difficult Airway Society guidelines",
    "type": "guideline",
    "url": "https://das.uk.com/guidelines/"
  },
  "ERC guidelines": {
    "label": "European Resuscitation Council guidelines",
    "type": "guideline",
    "url": "https://ercguidelines.elsevier.com"
  },
  "ESC guidelines": {
    "label": "ESC Guidelines",
    "sub": "European Society of Cardiology",
    "type": "guideline",
    "url": "https://www.escardio.org/Guidelines"
  },
  "MBRRACE-UP": {
    "label": "MBRRACE-UK reports",
    "sub": "Maternal mortality surveillance",
    "type": "guideline",
    "url": "https://www.npeu.ox.ac.uk/mbrace-uk"
  },
  "RCUK": {
    "label": "Resuscitation Council UK",
    "type": "guideline",
    "url": "https://www.resus.org.uk"
  },
  "SSC guidelines": {
    "label": "Surviving Sepsis Campaign",
    "type": "guideline",
    "url": "https://www.survivingsepsis.org"
  },
  "NLS": {
    "label": "Newborn Life Support (RCUK)",
    "type": "guideline",
    "url": "https://www.resus.org.uk/library"
  },
  "Working Together": {
    "label": "Working Together — RCoA/RCM maternity guidance",
    "type": "guideline",
    "url": "https://www.rcoa.ac.uk"
  },
  "RCoA G1": {
    "label": "RCoA Curriculum — Module G1 (Basic & Clinical Sciences)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  },
  "RCoA G2": {
    "label": "RCoA Curriculum — Module G2 (Physiology & Pharmacology)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  },
  "RCoA G3": {
    "label": "RCoA Curriculum — Module G3 (Pharmacology & Therapeutics)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  },
  "RCoA G4": {
    "label": "RCoA Curriculum — Module G4 (Clinical Anaesthesia & Perioperative Care)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  },
  "RCoA F2": {
    "label": "RCoA Curriculum — Domain F2 (Physical Sciences)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  },
  "RCoA F3": {
    "label": "RCoA Curriculum — Domain F3 (Clinical Measurement)",
    "type": "syllabus",
    "url": "https://www.rcoa.ac.uk/curriculum"
  }
};
const CHAPTER_TITLES = {
  "MM:4": "Physics & Measurement",
  "MM:5": "Electrical, Optical & Ultrasound Principles",
  "MM:7": "General Pharmacology & Pharmacokinetics",
  "MM:8": "Inhaled Anaesthetics",
  "MM:9": "Intravenous Anaesthetics",
  "MM:10": "Opioids & Analgesics",
  "MM:11": "Neuromuscular Blocking Drugs",
  "MM:13": "Autonomic Pharmacology",
  "MM:14": "Cardiovascular Drugs",
  "MM:15": "Airway Management",
  "MM:16": "Local Anaesthetics",
  "MM:17": "Regional Anaesthesia",
  "MM:18": "Cardiovascular Disease",
  "MM:19": "Respiratory Disease",
  "MM:20": "Monitoring & Intraoperative Care",
  "MM:21": "Monitoring & Mechanical Ventilation",
  "MM:22": "Haematology, Transfusion & Fluid Therapy",
  "MM:23": "Endocrine & Metabolic Disease",
  "MM:24": "Neurological & Neuromuscular Disease",
  "MM:26": "Obstetric & Foetal Physiology",
  "MM:27": "Paediatric Anaesthesia",
  "MM:30": "Pain Physiology & Management",
  "MM:31": "Acute & Chronic Pain",
  "MM:35": "Endocrine Physiology",
  "MM:39": "Hepatic Disease",
  "MM:40": "Obstetric Physiology",
  "MM:41": "Labour & Delivery",
  "MM:47": "Pain Mechanisms",
  "MM:51": "Acid-Base Physiology",
  "MM:52": "Electrolyte Disorders",
  "MM:57": "Shock & Oxygen Delivery",
  "MIL:24": "Mechanical Ventilation",
  "MIL:27": "Airway Management",
  "MIL:30": "Pharmacokinetics & IV Anaesthetics",
  "MIL:31": "Inhaled Agents & Opioids",
  "MIL:32": "Neuromuscular Blockade",
  "MIL:33": "Reversal & Monitoring",
  "MIL:34": "Regional Anaesthesia",
  "MIL:35": "Fluid, Electrolyte & Cardiovascular Drugs",
  "MIL:36": "ICU Monitoring",
  "MIL:47": "Paediatric Physiology",
  "MIL:81": "Neurophysiology & EEG",
  "MIL:91": "One-Lung Ventilation",
  "DD:1-2": "Gas Physics",
  "DD:5": "Flow & Fluid Dynamics",
  "DD:14-16": "Measurement & Monitoring",
  "DD:19": "Electrical Safety & Diathermy"
};
const ARTICLE_MAP = {
  "SI units": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement",
  "Non-SI units": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement",
  "Mass, force": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement",
  "Newton's laws": "https://www.anaesthesiauk.com/article.aspx?articleid=100053",
  "Temperature scales": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation",
  "Heat transfer": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation",
  "Latent heat": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation",
  "Humidity": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/humidity",
  "Kinetic theory": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Boyle's Law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Charles' Law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Dalton's Law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Henry's Law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Avogadro": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Fick's law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Ideal gas law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/ideal-gas-law",
  "Critical temperature": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/critical-temperature-and-pressure",
  "Saturated vapour": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/saturated-vapour-pressure",
  "Viscosity": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Reynolds number": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Laminar flow": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Turbulent flow": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Bernoulli": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Venturi": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws",
  "Electromagnetic spectrum": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/electromagnetic-spectrum",
  "Fiberoptics": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/fibreoptics",
  "Laser physics": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/laser-physics",
  "Beer-Lambert": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/beer-lambert-law",
  "Pulse oximetry": "https://derangedphysiology.com/main/required-reading/clinical-measurement/pulse-oximetry",
  "Oxyhemoglobin": "https://derangedphysiology.com/main/required-reading/clinical-measurement/pulse-oximetry",
  "CO-oximetry": "https://derangedphysiology.com/main/required-reading/clinical-measurement/co-oximetry",
  "Ohm's law": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/electricity-basics",
  "Diathermy": "https://litfl.com/diathermy-and-electrosurgical-safety/",
  "Pacemaker": "https://litfl.com/pacemaker-basics/",
  "Fire triad": "https://www.apsf.org/fire-safety/",
  "Piezoelectric": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/ultrasound-physics",
  "Doppler effect": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/ultrasound-physics",
  "Pressure transducers": "https://derangedphysiology.com/main/required-reading/clinical-measurement/pressure-transducers",
  "Capnography": "https://derangedphysiology.com/main/required-reading/clinical-measurement/capnography",
  "Blood gas": "https://derangedphysiology.com/main/required-reading/clinical-measurement/blood-gas-analysis",
  "Cell components": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/cell-biology",
  "Cell membrane": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/cell-biology",
  "Water compartments": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/body-fluid-compartments",
  "Osmolarity": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/osmolarity-and-osmolality",
  "Starling forces": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/starling-forces",
  "pKa": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/pka-and-ionization",
  "Glycolysis": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/metabolism",
  "Larynx": "https://teachmeanatomy.info/neck/the-larynx/",
  "Trachea": "https://teachmeanatomy.info/thorax/organs/trachea/",
  "Diaphragm": "https://teachmeanatomy.info/thorax/muscles/diaphragm/",
  "Spinal cord": "https://teachmeanatomy.info/back/nerves/spinal-cord/",
  "Brachial plexus": "https://www.nysora.com/topics/brachial-plexus-anatomy/",
  "Heart chambers": "https://teachmeanatomy.info/thorax/organs/heart/",
  "Coronary artery": "https://teachmeanatomy.info/thorax/organs/heart/coronary-arteries/",
  "Resting membrane": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/resting-membrane-potential",
  "Action potential": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/action-potential",
  "Sympathetic": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/autonomic-nervous-system",
  "Baroreceptor": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/baroreceptor-reflex",
  "Excitation-contraction": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/excitation-contraction-coupling",
  "Cardiac cycle": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/cardiac-cycle",
  "ECG": "https://litfl.com/ecg-basics/",
  "Frank-Starling": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/frank-starling-mechanism",
  "Laplace's law": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/laplaces-law",
  "DO2": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/oxygen-delivery-and-consumption",
  "Lung volumes": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-volumes-and-capacities",
  "Dead space": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/dead-space",
  "Compliance": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-compliance",
  "Surfactant": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/surfactant",
  "V/Q": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/ventilation-perfusion-matching",
  "Oxygen cascade": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/oxygen-cascade",
  "Alveolar gas": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/alveolar-gas-equation",
  "Dissociation curve": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/haemoglobin-oxygen-dissociation-curve",
  "Bohr": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/co2-transport",
  "Henderson-Hasselbalch": "https://derangedphysiology.com/main/required-reading/acid-base/henderson-hasselbalch-equation",
  "Renal circulation": "https://derangedphysiology.com/main/required-reading/renal-physiology/renal-blood-flow",
  "GFR": "https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate",
  "Loop of Henle": "https://derangedphysiology.com/main/required-reading/renal-physiology/loop-of-henle",
  "RAAS": "https://derangedphysiology.com/main/required-reading/renal-physiology/renin-angiotensin-aldosterone-system",
  "Hepatic blood flow": "https://derangedphysiology.com/main/required-reading/hepatology/hepatic-blood-flow",
  "Drug metabolism": "https://derangedphysiology.com/main/required-reading/hepatology/drug-metabolism",
  "Liver function tests": "https://derangedphysiology.com/main/required-reading/hepatology/liver-function-tests",
  "Child-Pugh": "https://derangedphysiology.com/main/required-reading/hepatology/child-pugh-score",
  "Insulins": "https://derangedphysiology.com/main/required-reading/endocrinology/insulin",
  "DKA": "https://derangedphysiology.com/main/required-reading/endocrinology/diabetic-ketoacidosis",
  "Thyroid storm": "https://derangedphysiology.com/main/required-reading/endocrinology/thyroid-storm",
  "CBF autoregulation": "https://derangedphysiology.com/main/required-reading/neurology/cerebral-blood-flow",
  "Monro-Kellie": "https://derangedphysiology.com/main/required-reading/neurology/monro-kellie-doctrine",
  "Nociceptors": "https://derangedphysiology.com/main/required-reading/pain-physiology/nociception",
  "Anion gap": "https://derangedphysiology.com/main/required-reading/acid-base/anion-gap",
  "Base excess": "https://derangedphysiology.com/main/required-reading/acid-base/base-excess",
  "Coagulation cascade": "https://derangedphysiology.com/main/required-reading/haematology/coagulation-cascade",
  "TEG": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing",
  "ADME": "https://derangedphysiology.com/main/required-reading/pharmacology/adme",
  "Volume of distribution": "https://derangedphysiology.com/main/required-reading/pharmacology/volume-distribution",
  "Clearance": "https://derangedphysiology.com/main/required-reading/pharmacology/clearance",
  "Half-life": "https://derangedphysiology.com/main/required-reading/pharmacology/half-life",
  "Dose-response": "https://derangedphysiology.com/main/required-reading/pharmacology/dose-response-curves",
  "MAC": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration",
  "Propofol": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol",
  "Ketamine": "https://derangedphysiology.com/main/required-reading/pharmacology/ketamine",
  "Paracetamol": "https://derangedphysiology.com/main/required-reading/pharmacology/paracetamol",
  "NSAIDs": "https://derangedphysiology.com/main/required-reading/pharmacology/nsaids",
  "Norepinephrine": "https://derangedphysiology.com/main/required-reading/pharmacology/norepinephrine",
  "Dobutamine": "https://derangedphysiology.com/main/required-reading/pharmacology/dobutamine",
  "Amiodarone": "https://litfl.com/amiodarone/",
  "Beta-blockers": "https://derangedphysiology.com/main/required-reading/pharmacology/beta-blockers",
  "Sugammadex": "https://derangedphysiology.com/main/required-reading/pharmacology/sugammadex",
  "ASA Physical Status": "https://www.asahq.org/standards-and-practice-parameters/statement-on-asa-physical-status-classification-system",
  "Mallampati": "https://litfl.com/mallampati-score/",
  "RSI": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction",
  "RCRI": "https://litfl.com/revised-cardiac-risk-index-rcri/",
  "STOP-BANG": "https://litfl.com/stop-bang-score/",
  "BIS": "https://derangedphysiology.com/main/required-reading/anaesthesia/bis-monitoring",
  "Difficult Airway": "https://www.das.uk.com/guidelines/das-intubation-guidelines",
  "Videolaryngoscopy": "https://www.das.uk.com/guidelines/das-intubation-guidelines",
  "DAS algorithm": "https://www.das.uk.com/guidelines/das-intubation-guidelines",
  "TIVA": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva",
  "CPB": "https://derangedphysiology.com/main/required-reading/cardiac-anaesthesia/cardiopulmonary-bypass",
  "ICP management": "https://derangedphysiology.com/main/required-reading/neurology/intracranial-pressure",
  "One-lung ventilation": "https://derangedphysiology.com/main/required-reading/thoracic-anaesthesia/one-lung-ventilation",
  "PONV": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting",
  "ERAS": "https://derangedphysiology.com/main/required-reading/anaesthesia/enhanced-recovery-after-surgery",
  "Aortocaval compression": "https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/maternal-physiological-changes",
  "Epidural analgesia": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/obstetric/epidural-analgesia/",
  "Pre-eclampsia": "https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/pre-eclampsia",
  "PPH": "https://litfl.com/postpartum-haemorrhage-pph/",
  "Perimortem C-section": "https://litfl.com/perimortem-caesarean-section/",
  "Multimodal analgesia": "https://derangedphysiology.com/main/required-reading/pain/multimodal-analgesia",
  "PCA": "https://derangedphysiology.com/main/required-reading/pain/patient-controlled-analgesia",
  "CRPS": "https://litfl.com/complex-regional-pain-syndrome/",
  "Fibromyalgia": "https://litfl.com/fibromyalgia/",
  "Cancer pain": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/pain-medicine/",
  "ARDS": "https://derangedphysiology.com/main/required-reading/respiratory/ards",
  "Prone ventilation": "https://derangedphysiology.com/main/required-reading/respiratory/prone-ventilation",
  "VILI": "https://derangedphysiology.com/main/required-reading/respiratory/ventilator-induced-lung-injury",
  "Tracheostomy": "https://litfl.com/tracheostomy/",
  "Sepsis": "https://derangedphysiology.com/main/required-reading/sepsis/sepsis-definitions",
  "SOFA": "https://litfl.com/sofa-score/",
  "CRRT": "https://derangedphysiology.com/main/required-reading/renal/crrt",
  "Brainstem death": "https://derangedphysiology.com/main/required-reading/neurology/brainstem-death",
  "Paediatric airway": "https://openanesthesia.org/paediatric-airway-differences/",
  "Caudal": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/pediatric/caudal-block/",
  "Congenital diaphragmatic hernia": "https://openanesthesia.org/congenital-diaphragmatic-hernia/",
  "Pyloric stenosis": "https://openanesthesia.org/pyloric-stenosis/",
  "Paediatric resuscitation": "https://www.resus.org.uk/library/algorithm-archive/paediatric-als-algorithm",
  "Interscalene": "https://www.nysora.com/topics/upper-extremity/interscalene-block/",
  "Supraclavicular": "https://www.nysora.com/topics/upper-extremity/supraclavicular-block/",
  "Axillary": "https://www.nysora.com/topics/upper-extremity/axillary-block/",
  "Femoral": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/",
  "Adductor canal": "https://www.nysora.com/topics/lower-extremity/adductor-canal-block/",
  "Sciatic": "https://www.nysora.com/topics/lower-extremity/sciatic-nerve-block/",
  "Spinal Anaesthesia": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/spinal-anesthesia/",
  "Epidural": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/",
  "TAP block": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/truncal-blockade/transverse-abdominis-plane-block/",
  "Paravertebral": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/truncal-blockade/paravertebral-block/",
  "LAST": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/",
  "BLS algorithm": "https://www.resus.org.uk/library/algorithm-archive/adult-bls-algorithm",
  "ALS algorithm": "https://www.resus.org.uk/library/algorithm-archive/adult-als-algorithm",
  "Defibrillation": "https://litfl.com/defibrillation/",
  "ATLS": "https://litfl.com/atls-primary-survey/",
  "Massive transfusion": "https://litfl.com/massive-transfusion-protocol/",
  "Paracetamol overdose": "https://litfl.com/paracetamol-overdose/",
  "Anaphylaxis": "https://litfl.com/anaphylaxis/",
  "MH": "https://litfl.com/malignant-hyperthermia/",
  "Toxicology": "https://litfl.com/toxicology-overview/",
  "Malignant Hyperthermia": "https://www.mhaus.org/protocols/"
};
// Hosts whose exact deep URLs are verified live and used directly.
const TRUSTED_EXACT = [
  "derangedphysiology.com",
  "litfl.com",
  "das.uk.com",
  "asahq.org"
];

const CURRICULUM = [
  {
    "id": "physics-measurement",
    "name": "Physics & Clinical Measurement",
    "icon": "atom",
    "color": "#0ea5e9",
    "sections": [
      {
        "id": "basic-physics",
        "name": "Basic Physical Principles",
        "topics": [
          {
            "id": "units-mechanics",
            "name": "Units, Mechanics & Force",
            "icon": "zap",
            "refs": [
              "RCoA F2"
            ],
            "sub": [
              {
                "t": "SI units: fundamental and derived",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement"
              },
              {
                "t": "Non-SI units in anesthesia (mmHg, cmH2O, bar, atm, PSI)",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement"
              },
              {
                "t": "Mass, force, weight, gravity",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20511/units-measurement"
              },
              {
                "t": "Work, energy, power",
                "r": [
                  "RCoA F2"
                ],
                "a": null
              },
              {
                "t": "Newton's laws of motion",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://www.anaesthesiauk.com/article.aspx?articleid=100053"
              }
            ]
          },
          {
            "id": "thermo-physics",
            "name": "Heat & Thermodynamics",
            "icon": "thermometer",
            "refs": [
              "RCoA F2"
            ],
            "sub": [
              {
                "t": "Temperature scales & absolute zero",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation"
              },
              {
                "t": "Heat transfer: conduction, convection, radiation, evaporation",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation"
              },
              {
                "t": "Latent heat & specific heat capacity",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation"
              },
              {
                "t": "Relevance to clinical anesthesia (heat loss in theatre)",
                "r": [
                  "RCoA F2"
                ],
                "a": null
              },
              {
                "t": "Humidity & absolute vs relative humidity",
                "r": [
                  "RCoA F2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/humidity"
              }
            ]
          },
          {
            "id": "gas-laws-physics",
            "name": "Gas Laws & Properties",
            "icon": "thermometer",
            "refs": [
              "RCoA F2",
              "DD Ch.1-2",
              "MM Ch.4"
            ],
            "sub": [
              {
                "t": "Kinetic theory of gases",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Boyle's Law (P/V relationship)",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Charles' Law (V/T relationship)",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Gay-Lussac's Law (P/T relationship)",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Dalton's Law of partial pressures",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Henry's Law (gas dissolution)",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Avogadro's hypothesis",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Fick's law of diffusion",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Graham's law (effusion)",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Ideal gas law & universal gas constant",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/ideal-gas-law"
              },
              {
                "t": "Critical temperature & critical pressure",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/critical-temperature-and-pressure"
              },
              {
                "t": "Adiabatic processes & Joule-Thomson effect",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Physics of vapours vs gases",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Saturated vapour pressure (SVP)",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/saturated-vapour-pressure"
              },
              {
                "t": "Latent heat of vaporization",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/heat-and-thermoregulation"
              },
              {
                "t": "Viscosity, density, Reynolds number",
                "r": [
                  "RCoA F2",
                  "DD Ch.1-2",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              }
            ]
          },
          {
            "id": "flow-dynamics",
            "name": "Flow & Fluid Dynamics",
            "icon": "droplets",
            "refs": [
              "RCoA F2",
              "DD Ch.5"
            ],
            "sub": [
              {
                "t": "Laminar flow & Hagen-Poiseuille equation",
                "r": [
                  "RCoA F2",
                  "DD Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Turbulent flow & Reynolds number",
                "r": [
                  "RCoA F2",
                  "DD Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Effect of gas density (Helium) and viscosity",
                "r": [
                  "RCoA F2",
                  "DD Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Bernoulli principle & Venturi effect",
                "r": [
                  "RCoA F2",
                  "DD Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Entrainment devices (nebulizers, Venturi masks)",
                "r": [
                  "RCoA F2",
                  "DD Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Orifice flow & flowmeters",
                "r": [
                  "RCoA F2",
                  "DD Ch.5"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "optics-spectrophotometry",
        "name": "Optics, Spectrophotometry & Light",
        "topics": [
          {
            "id": "optics-principles",
            "name": "Optics & Light Principles",
            "icon": "radio",
            "refs": [
              "RCoA F2",
              "MM Ch.5"
            ],
            "sub": [
              {
                "t": "Electromagnetic spectrum & light properties",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/electromagnetic-spectrum"
              },
              {
                "t": "Reflection, refraction, absorption",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Fiberoptics: total internal reflection, light transmission",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/fibreoptics"
              },
              {
                "t": "Laser physics: spontaneous vs stimulated emission",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/laser-physics"
              },
              {
                "t": "Laser types: CO2, Nd:YAG, KTP, Argon",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Laser safety & classification",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "spectrophotometry",
            "name": "Spectrophotometry",
            "icon": "radio",
            "refs": [
              "RCoA F2",
              "MM Ch.5"
            ],
            "sub": [
              {
                "t": "Beer-Lambert law principles",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/beer-lambert-law"
              },
              {
                "t": "Infrared absorption spectroscopy",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Pulse oximetry: red/IR light absorption",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/pulse-oximetry"
              },
              {
                "t": "Oxyhemoglobin & deoxyhemoglobin absorption spectra",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/pulse-oximetry"
              },
              {
                "t": "CO-oximetry: multiple wavelength analysis",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/co-oximetry"
              },
              {
                "t": "Dyshemoglobin detection (COHb, MetHb)",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "electricity-electronics",
        "name": "Electricity & Electronics",
        "topics": [
          {
            "id": "electrical-principles",
            "name": "Electrical Principles",
            "icon": "zap",
            "refs": [
              "RCoA F2",
              "DD Ch.19"
            ],
            "sub": [
              {
                "t": "Current, voltage, resistance, impedance",
                "r": [
                  "RCoA F2",
                  "DD Ch.19"
                ],
                "a": null
              },
              {
                "t": "Ohm's law & power calculations",
                "r": [
                  "RCoA F2",
                  "DD Ch.19"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/electricity-basics"
              },
              {
                "t": "Capacitance and inductance",
                "r": [
                  "RCoA F2",
                  "DD Ch.19"
                ],
                "a": null
              },
              {
                "t": "Alternating vs direct current",
                "r": [
                  "RCoA F2",
                  "DD Ch.19"
                ],
                "a": null
              },
              {
                "t": "Transformers (step-up/step-down)",
                "r": [
                  "RCoA F2",
                  "DD Ch.19"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "electrical-safety-theatre",
            "name": "Electrical Safety & Hazards",
            "icon": "zap",
            "refs": [
              "RCoA F2",
              "DD Ch.19",
              "MM Ch.4"
            ],
            "sub": [
              {
                "t": "Macroshock vs microshock",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Earth leakage currents",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Line isolation monitors & isolated power",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Equipotential bonding & grounding",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Ground fault circuit interrupters",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Defibrillator physics (capacitor discharge, thoracic impedance)",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Diathermy: monopolar vs bipolar circuits, grounding pad safety",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": "https://litfl.com/diathermy-and-electrosurgical-safety/"
              },
              {
                "t": "Pacemaker sensitivity to electromagnetic interference",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": "https://litfl.com/pacemaker-basics/"
              },
              {
                "t": "Fire triad: oxidizer, fuel, ignition",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": "https://www.apsf.org/fire-safety/"
              },
              {
                "t": "Laser & electrosurgery plume hazards",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              },
              {
                "t": "Bowel prep & methane explosion risk",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Fire risk assessment score",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              },
              {
                "t": "Waste anesthetic gas exposure limits",
                "r": [
                  "RCoA F2",
                  "DD Ch.19",
                  "MM Ch.4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "ultrasound-physics",
        "name": "Ultrasound Physics",
        "topics": [
          {
            "id": "us-principles",
            "name": "Principles of Ultrasound",
            "icon": "radio",
            "refs": [
              "RCoA F2",
              "MM Ch.5"
            ],
            "sub": [
              {
                "t": "Piezoelectric effect",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/ultrasound-physics"
              },
              {
                "t": "Frequency, wavelength, propagation speed",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Attenuation, impedance, depth tradeoff",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Resolution: axial vs lateral vs penetration",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Modes: B-mode, M-mode, Doppler",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Acoustic artifacts (shadowing, enhancement, reverberation)",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": null
              },
              {
                "t": "Doppler effect principle & color Doppler",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/ultrasound-physics"
              },
              {
                "t": "Probes: linear, curvilinear, phased array",
                "r": [
                  "RCoA F2",
                  "MM Ch.5"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ventilator-induced-lung-injury"
              }
            ]
          }
        ]
      },
      {
        "id": "clinical-measurement",
        "name": "Clinical Measurement Principles",
        "topics": [
          {
            "id": "measurement-theory",
            "name": "Measurement Theory",
            "icon": "bar-chart",
            "refs": [
              "RCoA F3"
            ],
            "sub": [
              {
                "t": "Accuracy vs precision",
                "r": [
                  "RCoA F3"
                ],
                "a": null
              },
              {
                "t": "Linearity, drift, hysteresis",
                "r": [
                  "RCoA F3"
                ],
                "a": null
              },
              {
                "t": "Signal-to-noise ratio",
                "r": [
                  "RCoA F3"
                ],
                "a": null
              },
              {
                "t": "Static vs dynamic response",
                "r": [
                  "RCoA F3"
                ],
                "a": null
              },
              {
                "t": "Calibration principles (zeroing, spanning)",
                "r": [
                  "RCoA F3"
                ],
                "a": null
              },
              {
                "t": "Limits of monitoring equipment",
                "r": [
                  "RCoA F3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "specific-measurements",
            "name": "Equipment & Measurement Applications",
            "icon": "monitor",
            "refs": [
              "RCoA F3",
              "DD Ch.14-16"
            ],
            "sub": [
              {
                "t": "Pressure transducers: strain gauge principle",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/pressure-transducers"
              },
              {
                "t": "Blood pressure: oscillotonometer physics",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": null
              },
              {
                "t": "Capnography: infrared absorption physics",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/capnography"
              },
              {
                "t": "Pulse oximetry: Beer-Lambert law application",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthetic-physics/beer-lambert-law"
              },
              {
                "t": "Temperature measurement: thermistor vs thermocouple",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": null
              },
              {
                "t": "Gas analysis: paramagnetic (O2), mass spectrometry, Raman",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": null
              },
              {
                "t": "Blood gas analysis: electrode principles, pH/blood gas electrodes",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/blood-gas-analysis"
              },
              {
                "t": "Flow measurement: pneumotachograph",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": null
              },
              {
                "t": "Electrical interference: causes and reduction",
                "r": [
                  "RCoA F3",
                  "DD Ch.14-16"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "biochemistry-cell",
    "name": "Biochemistry, Cell Biology & Mathematics",
    "icon": "flask-conical",
    "color": "#22c55e",
    "sections": [
      {
        "id": "cell-biology",
        "name": "Cell Biology & Genetics",
        "topics": [
          {
            "id": "cell-structure-function",
            "name": "Cell Structure & Function",
            "icon": "flask-conical",
            "refs": [
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Cell components and organelles (mitochondria, ER, ribosomes)",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/cell-biology"
              },
              {
                "t": "Cell membrane: phospholipid bilayer, proteins, cholesterol",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/cell-biology"
              },
              {
                "t": "Cell junctions (tight, gap, desmosomes)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Receptors: membrane bound, intracellular, nuclear",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Ion channels: voltage-gated, ligand-gated, leak channels",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Active vs passive transport mechanisms",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Genes and expression (DNA to RNA to protein)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "body-fluids",
            "name": "Body Fluids & Homeostasis",
            "icon": "droplets",
            "refs": [
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Water compartments (ICF, ECF, Interstitial, Plasma)",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/body-fluid-compartments"
              },
              {
                "t": "Osmolarity vs osmolality vs tonicity",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/osmolarity-and-osmolality"
              },
              {
                "t": "Colligative properties (osmotic pressure, freezing point depression)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Capillary dynamics (Starling forces, glycocalyx model)",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/starling-forces"
              },
              {
                "t": "Special fluids: CSF, pleural, pericardial, peritoneal",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Lymphatic system structure and function",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "molecular-biochem",
        "name": "Molecular Biochemistry",
        "topics": [
          {
            "id": "organic-chemistry",
            "name": "Organic & Physical Chemistry",
            "icon": "flask-conical",
            "refs": [
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Intermolecular bonds (van der Waals, hydrogen, ionic)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Ionization of molecules, pKa, pH effect",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/pka-and-ionization"
              },
              {
                "t": "Isomers: structural and stereo (optical isomers in anesthesia)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Oxidation and reduction reactions",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Quaternary ammonium compounds (permanently charged drugs)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Drug solubility and partition coefficients",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "metabolism-nutrition",
            "name": "Metabolism & Nutrition",
            "icon": "flask-conical",
            "refs": [
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Carbohydrate metabolism (glycolysis, TCA cycle, gluconeogenesis)",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/metabolism"
              },
              {
                "t": "Lactate production and metabolism",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Lipid metabolism (beta-oxidation, ketogenesis)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Protein metabolism and nitrogen balance",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Energy requirements and measurement (indirect calorimetry)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Vitamins and minerals (cofactors)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Body mass index and body composition",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "pharm-math",
        "name": "Mathematics for Pharmacology",
        "topics": [
          {
            "id": "pharmacokinetic-math",
            "name": "Pharmacokinetic Mathematics",
            "icon": "pill",
            "refs": [
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Exponential functions (wash-in, wash-out curves)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Logarithms (base 10, natural logs)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Area Under the Curve (AUC) and integration",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Rate of change and differentiation",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Half-life calculation and time constants",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/half-life"
              },
              {
                "t": "Clearance calculations",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/clearance"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "applied-anatomy",
    "name": "Applied Anatomy",
    "icon": "bone",
    "color": "#a855f7",
    "sections": [
      {
        "id": "airway-anatomy",
        "name": "Airway & Respiratory Anatomy",
        "topics": [
          {
            "id": "upper-airway",
            "name": "Upper Airway",
            "icon": "lungs",
            "refs": [
              "RCoA G1",
              "MM Ch.19"
            ],
            "sub": [
              {
                "t": "Mouth, nose, pharynx structural anatomy",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Larynx: cartilages, ligaments, joints",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": "https://teachmeanatomy.info/neck/the-larynx/"
              },
              {
                "t": "Vocal cords & glottic aperture",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Innervation: external branch of superior laryngeal, recurrent laryngeal nerve",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Blood supply to the airway",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Age-related changes (neonate to adult)",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Surface anatomy of the airway",
                "r": [
                  "RCoA G1",
                  "MM Ch.19"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "lower-respiratory-tract",
            "name": "Lower Respiratory Tract",
            "icon": "lungs",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Trachea: structure, length, rings",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://teachmeanatomy.info/thorax/organs/trachea/"
              },
              {
                "t": "Main bronchi & segmental bronchi (anatomical differences)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Lung lobes and microstructure (alveoli)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Pleura: layers, surface anatomy, reflections",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Mediastinum: compartments and contents",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Diaphragm: attachments, apertures, innervation (phrenic C3-5)",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://teachmeanatomy.info/thorax/muscles/diaphragm/"
              },
              {
                "t": "Intercostal muscles & neurovascular bundle orientation",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "spine-neuraxial-anatomy",
        "name": "Spinal & Neuraxial Anatomy",
        "topics": [
          {
            "id": "vertebral-column",
            "name": "Vertebral Column & Spinal Cord",
            "icon": "brain",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Cervical, thoracic, lumbar vertebrae: distinguishing features",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Sacrum & sacral hiatus anatomy",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Ligaments of vertebral column (Supraspinous, Ligamentum Flavum, PLL, ALL)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Spinal cord: length vs vertebral column length",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              },
              {
                "t": "Spinal meninges (Dura, Arachnoid, Pia)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Epidural space: contents (fat, veins, nerves)",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "Subarachnoid space & CSF",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Surface anatomy of vertebral spaces",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Major ascending tracts (DCML, Spinothalamic)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Major descending tracts (Corticospinal)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Blood supply (Anterior spinal artery, Radicular arteries)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Spinal nerves: structure and formation",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Dermatomes: clinical mapping and relevance",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Autonomic outflow from spinal cord",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              }
            ]
          }
        ]
      },
      {
        "id": "cardiovascular-anat",
        "name": "Cardiovascular Anatomy",
        "topics": [
          {
            "id": "heart-great-vessels",
            "name": "Heart & Great Vessels",
            "icon": "heart",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Heart chambers: internal features",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://teachmeanatomy.info/thorax/organs/heart/"
              },
              {
                "t": "Cardiac valves: anatomy and relations",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Conducting system (SA node, AV node, bundles)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Coronary artery dominance and supply",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://teachmeanatomy.info/thorax/organs/heart/coronary-arteries/"
              },
              {
                "t": "Pericardium: layers and sinuses",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Great vessels: aorta, SVC, IVC, pulmonary arteries/veins",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "peripheral-vasculature",
            "name": "Peripheral Vasculature",
            "icon": "heart",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Large veins of the neck (IJV anatomy for CVC)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Anterior triangle of the neck (surface & US anatomy)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Axilla & antecubital fossa structures",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Femoral triangle anatomy",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/"
              },
              {
                "t": "Arteries of upper and lower limbs",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Celiac plexus & autonomic ganglia",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "regional-anatomy",
        "name": "Regional Anaesthesia Anatomy",
        "topics": [
          {
            "id": "plexus-anatomy",
            "name": "Brachial & Lumbar Plexuses",
            "icon": "needle",
            "refs": [
              "RCoA G1",
              "GS"
            ],
            "sub": [
              {
                "t": "Brachial plexus: roots, trunks, divisions, cords, terminal branches",
                "r": [
                  "RCoA G1",
                  "GS"
                ],
                "a": "https://www.nysora.com/topics/brachial-plexus-anatomy/"
              },
              {
                "t": "Brachial plexus relations (scalene muscles, clavicle, axilla)",
                "r": [
                  "RCoA G1",
                  "GS"
                ],
                "a": "https://www.nysora.com/topics/brachial-plexus-anatomy/"
              },
              {
                "t": "Lumbar plexus: roots and branches (femoral, lateral cutaneous, obturator)",
                "r": [
                  "RCoA G1",
                  "GS"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/"
              },
              {
                "t": "Sacral plexus: roots and branches (sciatic, posterior cutaneous)",
                "r": [
                  "RCoA G1",
                  "GS"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/sciatic-nerve-block/"
              },
              {
                "t": "Nerves of the abdominal wall (intercostals, ilioinguinal, iliohypogastric)",
                "r": [
                  "RCoA G1",
                  "GS"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "head-neck-eye-anat",
            "name": "Head, Neck & Eye Anatomy",
            "icon": "bone",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Cranial nerves (overview and specific relevant nerves)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Cervical plexus: roots and branches",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Stellate ganglion anatomy",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Eye and orbit anatomy",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Functional anatomy of hypothalamic/pituitary, adrenal, thyroid glands",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Trigeminal & facial nerve anatomy",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Surface markings of relevant structures",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "physiology",
    "name": "Physiology for Anesthesia",
    "icon": "activity",
    "color": "#10b981",
    "sections": [
      {
        "id": "cellular-physio",
        "name": "Cellular & General Physiology",
        "topics": [
          {
            "id": "membrane-potential",
            "name": "Membrane & Resting Potential",
            "icon": "activity",
            "refs": [
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Resting membrane potential genesis (Na/K ATPase)",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/resting-membrane-potential"
              },
              {
                "t": "Nernst equation & equilibrium potential",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Action potential generation and phases",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/action-potential"
              },
              {
                "t": "Conduction velocity and myelination",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Synaptic transmission (neurotransmitter release)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Changes with advancing age",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "ans-physio",
        "name": "Autonomic Nervous System",
        "topics": [
          {
            "id": "ans-physiology",
            "name": "ANS Pharmacology & Physiology",
            "icon": "pill",
            "refs": [
              "MM Ch.13",
              "PS"
            ],
            "sub": [
              {
                "t": "Sympathetic vs parasympathetic anatomy",
                "r": [
                  "MM Ch.13",
                  "PS"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/autonomic-nervous-system"
              },
              {
                "t": "Neurotransmitters & receptors",
                "r": [
                  "MM Ch.13",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Adrenergic receptor distribution & effects",
                "r": [
                  "MM Ch.13",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Baroreceptor reflex",
                "r": [
                  "MM Ch.13",
                  "PS"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/baroreceptor-reflex"
              },
              {
                "t": "Direct vs reflex effects of drugs",
                "r": [
                  "MM Ch.13",
                  "PS"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "cardio-physio",
        "name": "Cardiovascular Physiology",
        "topics": [
          {
            "id": "cardiac-muscle",
            "name": "Cardiac Muscle & Electrophysiology",
            "icon": "heart",
            "refs": [
              "MM Ch.20",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Cardiac vs skeletal vs smooth muscle contraction",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Excitation-contraction coupling in heart",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/excitation-contraction-coupling"
              },
              {
                "t": "Cardiac cycle: pressure-volume loops, work, power",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/cardiac-cycle"
              },
              {
                "t": "Rhythmicity and impulse generation (SA node)",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Action potentials (nodal vs ventricular)",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/action-potential"
              },
              {
                "t": "Refractory periods",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "ECG origin and interval meanings",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Effects of temperature, ischaemia, electrolytes on ECG",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Arrhythmia mechanisms (reentry, ectopic, afterdepolarizations)",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Effect of anesthetics on conduction",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "haemodynamics",
            "name": "Haemodynamics & Control",
            "icon": "heart",
            "refs": [
              "MM Ch.20",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Preload, afterload, contractility (Frank-Starling)",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/frank-starling-mechanism"
              },
              {
                "t": "Laplace's law & wall stress",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/laplaces-law"
              },
              {
                "t": "Determinants of myocardial oxygen supply/demand",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Coronary perfusion & autoregulation",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Compliance & elastance",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-compliance"
              },
              {
                "t": "Fluid challenge and heart failure response",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Autonomic control of BP (baroreceptors, vasomotor centre)",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/baroreceptor-reflex"
              },
              {
                "t": "Humoral control (RAAS, ADH, catecholamines)",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/renin-angiotensin-aldosterone-system"
              },
              {
                "t": "Local metabolic control of circulation",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Effects of ventilation & intrathoracic pressure on circulation",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Peripheral circulation: endothelium, arteriolar smooth muscle",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Special circulations: pulmonary, coronary, cerebral, renal, fetal",
                "r": [
                  "MM Ch.20",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "shock-oxygen-delivery",
            "name": "Shock States & Oxygen Delivery",
            "icon": "lungs",
            "refs": [
              "MM Ch.20",
              "MM Ch.57"
            ],
            "sub": [
              {
                "t": "DO2 = CO x CaO2; VO2 & extraction ratio",
                "r": [
                  "MM Ch.20",
                  "MM Ch.57"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/oxygen-delivery-and-consumption"
              },
              {
                "t": "Types: hypovolemic, cardiogenic, distributive, obstructive",
                "r": [
                  "MM Ch.20",
                  "MM Ch.57"
                ],
                "a": null
              },
              {
                "t": "Compensated vs decompensated shock",
                "r": [
                  "MM Ch.20",
                  "MM Ch.57"
                ],
                "a": null
              },
              {
                "t": "Lactate & base excess as markers",
                "r": [
                  "MM Ch.20",
                  "MM Ch.57"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/acid-base/base-excess"
              }
            ]
          }
        ]
      },
      {
        "id": "resp-physio",
        "name": "Respiratory Physiology",
        "topics": [
          {
            "id": "lung-mechanics",
            "name": "Lung Mechanics & Ventilation",
            "icon": "lungs",
            "refs": [
              "MM Ch.21",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Lung volumes & capacities (definitions)",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-volumes-and-capacities"
              },
              {
                "t": "Dead space: anatomical, alveolar, physiological",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/dead-space"
              },
              {
                "t": "Compliance & elastance, hysteresis (static vs dynamic)",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-compliance"
              },
              {
                "t": "Surfactant function & Laplace's law",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiovascular-physiology/laplaces-law"
              },
              {
                "t": "Airway resistance: laminar vs turbulent flow",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/Chapter%20510/gas-laws"
              },
              {
                "t": "Work of breathing components",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Closing capacity & aging",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Flow-volume loops",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Effect of IPPV on lungs",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "gas-exchange",
            "name": "Gas Exchange & Transport",
            "icon": "lungs",
            "refs": [
              "MM Ch.21",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "V/Q relationships, shunt equation & regional V/Q",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/ventilation-perfusion-matching"
              },
              {
                "t": "Oxygen cascade & alveolar gas equation",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/oxygen-cascade"
              },
              {
                "t": "PAO2 = FiO2(Patm-PH2O) - PaCO2/R",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Diffusion capacity & Fick law",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "A-a gradient causes",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Hypoxic pulmonary vasoconstriction",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Hemoglobin dissociation curve & P50",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/haemoglobin-oxygen-dissociation-curve"
              },
              {
                "t": "Bohr & Haldane effects",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/co2-transport"
              },
              {
                "t": "2,3-DPG, pH, temperature shifts on O2 dissociation",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "CO2 transport (bicarbonate, carbamino, dissolved)",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Henderson-Hasselbalch",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/acid-base/henderson-hasselbalch-equation"
              },
              {
                "t": "CO2 stores & apneic diffusion",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Hypoxia and hyper/hypocapnia effects",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Effects of altitude and hyperbaric pressures",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Non-respiratory functions of the lungs",
                "r": [
                  "MM Ch.21",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "control-ventilation",
            "name": "Control of Ventilation",
            "icon": "lungs",
            "refs": [
              "MM Ch.21",
              "PS"
            ],
            "sub": [
              {
                "t": "Central & peripheral chemoreceptors",
                "r": [
                  "MM Ch.21",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Effect of anesthetics on ventilatory drive",
                "r": [
                  "MM Ch.21",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Hypoxic ventilatory response",
                "r": [
                  "MM Ch.21",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Apneic threshold & CO2 response curve",
                "r": [
                  "MM Ch.21",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Sleep-disordered breathing",
                "r": [
                  "MM Ch.21",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Acute and chronic ventilatory failure",
                "r": [
                  "MM Ch.21",
                  "PS"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "anesthesia-resp-effects",
            "name": "Effects of Anesthesia on Respiration",
            "icon": "lungs",
            "refs": [
              "MM Ch.21"
            ],
            "sub": [
              {
                "t": "Reduced FRC, atelectasis, V/Q mismatch",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/ventilation-perfusion-matching"
              },
              {
                "t": "Reduced hypoxic pulmonary vasoconstriction",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Apnea, altered CO2 response",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Changes in dead space & compliance",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/dead-space"
              },
              {
                "t": "Positioning & cephalad diaphragm shift",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://teachmeanatomy.info/thorax/muscles/diaphragm/"
              }
            ]
          }
        ]
      },
      {
        "id": "renal-physio",
        "name": "Renal Physiology",
        "topics": [
          {
            "id": "renal-hemodynamics",
            "name": "Renal Hemodynamics & GFR",
            "icon": "kidney",
            "refs": [
              "MM Ch.31",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Renal circulation and autoregulation",
                "r": [
                  "MM Ch.31",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/renal-blood-flow"
              },
              {
                "t": "GFR determinants & clearance concepts",
                "r": [
                  "MM Ch.31",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate"
              },
              {
                "t": "Tubuloglomerular feedback",
                "r": [
                  "MM Ch.31",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Effects of anesthesia on RBF",
                "r": [
                  "MM Ch.31",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Assessment of renal function (GFR, clearance, urea/creatinine, cystatin C)",
                "r": [
                  "MM Ch.31",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate"
              },
              {
                "t": "Pathophysiology of acute kidney injury",
                "r": [
                  "MM Ch.31",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "tubular-function",
            "name": "Tubular Function & Handling",
            "icon": "kidney",
            "refs": [
              "MM Ch.31",
              "PS"
            ],
            "sub": [
              {
                "t": "Sodium, water, potassium handling",
                "r": [
                  "MM Ch.31",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "Loop of Henle & countercurrent multiplier",
                "r": [
                  "MM Ch.31",
                  "PS"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/loop-of-henle"
              },
              {
                "t": "ADH/vasopressin & aquaporins",
                "r": [
                  "MM Ch.31",
                  "PS"
                ],
                "a": null
              },
              {
                "t": "RAAS & aldosterone",
                "r": [
                  "MM Ch.31",
                  "PS"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/renin-angiotensin-aldosterone-system"
              },
              {
                "t": "Acid-base regulation by kidney",
                "r": [
                  "MM Ch.31",
                  "PS"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "perioperative-renal",
            "name": "Perioperative Renal Evaluation",
            "icon": "kidney",
            "refs": [
              "MM Ch.31"
            ],
            "sub": [
              {
                "t": "BUN/Cr, eGFR, cystatin C",
                "r": [
                  "MM Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate"
              },
              {
                "t": "Fractional excretion of sodium",
                "r": [
                  "MM Ch.31"
                ],
                "a": null
              },
              {
                "t": "AKI biomarkers (NGAL, KIM-1)",
                "r": [
                  "MM Ch.31"
                ],
                "a": null
              },
              {
                "t": "Contrast nephropathy & prevention",
                "r": [
                  "MM Ch.31"
                ],
                "a": null
              },
              {
                "t": "Effects of drugs (NSAIDs, ACE-I)",
                "r": [
                  "MM Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/nsaids"
              }
            ]
          }
        ]
      },
      {
        "id": "hepatic-physio",
        "name": "Hepatic Physiology",
        "topics": [
          {
            "id": "liver-function-metabolism",
            "name": "Liver Function & Measurement",
            "icon": "liver",
            "refs": [
              "MM Ch.7",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Hepatic blood flow (dual supply)",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/hepatology/hepatic-blood-flow"
              },
              {
                "t": "Drug metabolism phases I/II",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/hepatology/drug-metabolism"
              },
              {
                "t": "Bilirubin metabolism",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Coagulation factor synthesis",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Protein synthesis & drug binding",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Liver function tests (ALT, AST, ALP, GGT, bilirubin)",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/hepatology/liver-function-tests"
              },
              {
                "t": "Synthetic function (albumin, INR, clotting factors)",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Child-Pugh & MELD scoring",
                "r": [
                  "MM Ch.7",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/hepatology/child-pugh-score"
              }
            ]
          },
          {
            "id": "anesthesia-liver",
            "name": "Anesthesia & Liver Disease",
            "icon": "liver",
            "refs": [
              "MM Ch.7",
              "MM Ch.39"
            ],
            "sub": [
              {
                "t": "Effects of anesthetics on hepatic blood flow",
                "r": [
                  "MM Ch.7",
                  "MM Ch.39"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/hepatology/hepatic-blood-flow"
              },
              {
                "t": "Altered pharmacokinetics in cirrhosis",
                "r": [
                  "MM Ch.7",
                  "MM Ch.39"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Hepatorenal syndrome",
                "r": [
                  "MM Ch.7",
                  "MM Ch.39"
                ],
                "a": null
              },
              {
                "t": "Hepatic encephalopathy",
                "r": [
                  "MM Ch.7",
                  "MM Ch.39"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "endocrine-physio",
        "name": "Endocrine Physiology",
        "topics": [
          {
            "id": "dm-physio",
            "name": "Diabetes Mellitus",
            "icon": "gauge",
            "refs": [
              "MM Ch.35",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Type 1 vs type 2 pathophysiology",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Insulins (rapid, short, intermediate, long)",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/insulin"
              },
              {
                "t": "DKA & HHS",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/diabetic-ketoacidosis"
              },
              {
                "t": "Perioperative insulin management & glucose targets",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Hypoglycemia recognition",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "thyroid-adrenal",
            "name": "Thyroid, Adrenal & Pituitary",
            "icon": "kidney",
            "refs": [
              "MM Ch.35",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Hormone types, receptors, and feedback mechanisms",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Hypothalamic and pituitary function",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Thyroid storm & myxedema coma",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/thyroid-storm"
              },
              {
                "t": "Hyperthyroid perioperative risks",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Adrenal insufficiency & steroid replacement",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Pheochromocytoma physiology & blockade",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Cushing & Addison syndromes",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Parathyroid hormones & calcium homeostasis",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Metabolic response to trauma and stress",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Physiological changes in starvation and exercise",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Body temperature regulation (including extremes of age)",
                "r": [
                  "MM Ch.35",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "neurophysiology",
        "name": "Neurophysiology",
        "topics": [
          {
            "id": "cbf-icp",
            "name": "Cerebral Blood Flow & ICP",
            "icon": "brain",
            "refs": [
              "MM Ch.26",
              "PS",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Brain: functional divisions",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Brainstem: organization, ICP, CSF flow",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "CBF autoregulation (50-150 mmHg)",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/neurology/cerebral-blood-flow"
              },
              {
                "t": "PaCO2 & PaO2 effects on CBF",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Intracranial compliance & Monro-Kellie doctrine",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/lung-compliance"
              },
              {
                "t": "Cerebral metabolic rate & effects of anesthetics",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Lund vs CPP-targeted therapy",
                "r": [
                  "MM Ch.26",
                  "PS",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "pain-neurophysio",
            "name": "Pain Pathways & Nociception",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.47",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Nociceptors & transduction",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pain-physiology/nociception"
              },
              {
                "t": "A-delta vs C fibers",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Spinal cord processing & gate control",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              },
              {
                "t": "Descending inhibition",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Central & peripheral sensitization",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Wind-up & NMDA receptor",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Neuropathic vs visceral pain mechanisms",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Physiology of nausea and vomiting",
                "r": [
                  "MM Ch.47",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "neuroprotection-eeg",
            "name": "Neuroprotection & EEG",
            "icon": "brain",
            "refs": [
              "MM Ch.26",
              "MIL Ch.81"
            ],
            "sub": [
              {
                "t": "EEG patterns & anesthetic depth",
                "r": [
                  "MM Ch.26",
                  "MIL Ch.81"
                ],
                "a": null
              },
              {
                "t": "Burst suppression",
                "r": [
                  "MM Ch.26",
                  "MIL Ch.81"
                ],
                "a": null
              },
              {
                "t": "Ischemic preconditioning",
                "r": [
                  "MM Ch.26",
                  "MIL Ch.81"
                ],
                "a": null
              },
              {
                "t": "Hypothermia for neuroprotection",
                "r": [
                  "MM Ch.26",
                  "MIL Ch.81"
                ],
                "a": null
              },
              {
                "t": "Glucose control in neuro injury",
                "r": [
                  "MM Ch.26",
                  "MIL Ch.81"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "acid-base-electrolytes",
        "name": "Acid-Base & Electrolytes",
        "topics": [
          {
            "id": "acid-base-interp",
            "name": "Acid-Base Interpretation",
            "icon": "flask-conical",
            "refs": [
              "MM Ch.51",
              "MM Ch.52",
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "pH definition (negative log of H+)",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Strong vs weak acids",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Buffer systems (bicarbonate, haemoglobin, protein, phosphate)",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Henderson-Hasselbalch equation",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/acid-base/henderson-hasselbalch-equation"
              },
              {
                "t": "Anion gap & osmolar gap",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/acid-base/anion-gap"
              },
              {
                "t": "Base excess interpretation",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/acid-base/base-excess"
              },
              {
                "t": "Boston vs Stewart approach",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Strong ion difference",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Compensatory mechanisms & expected values",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Renal regulation of acid-base",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Respiratory compensation limits",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Common perioperative derangements",
                "r": [
                  "MM Ch.51",
                  "MM Ch.52",
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "electrolyte-disorders",
            "name": "Electrolyte Disorders",
            "icon": "droplets",
            "refs": [
              "MM Ch.52"
            ],
            "sub": [
              {
                "t": "Sodium: hyponatremia/hypernatremia (DKA, SIADH, diabetes insipidus)",
                "r": [
                  "MM Ch.52"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/diabetic-ketoacidosis"
              },
              {
                "t": "Potassium: causes & ECG changes",
                "r": [
                  "MM Ch.52"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Calcium: ionized vs total, citrate chelation",
                "r": [
                  "MM Ch.52"
                ],
                "a": null
              },
              {
                "t": "Magnesium: treatment of pre-eclampsia, arrhythmias",
                "r": [
                  "MM Ch.52"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/pre-eclampsia"
              },
              {
                "t": "Phosphate disorders",
                "r": [
                  "MM Ch.52"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "blood-immune-physio",
        "name": "Blood & Immune Physiology",
        "topics": [
          {
            "id": "coagulation-physio",
            "name": "Coagulation & Fibrinolysis",
            "icon": "droplets",
            "refs": [
              "MM Ch.22"
            ],
            "sub": [
              {
                "t": "Coagulation cascade (intrinsic/extrinsic/common)",
                "r": [
                  "MM Ch.22"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/coagulation-cascade"
              },
              {
                "t": "Cell-based model of coagulation",
                "r": [
                  "MM Ch.22"
                ],
                "a": null
              },
              {
                "t": "Platelet function",
                "r": [
                  "MM Ch.22"
                ],
                "a": null
              },
              {
                "t": "Fibrinolysis & D-dimer",
                "r": [
                  "MM Ch.22"
                ],
                "a": null
              },
              {
                "t": "Inherited disorders (vWD, hemophilia A/B)",
                "r": [
                  "MM Ch.22"
                ],
                "a": null
              },
              {
                "t": "Viscoelastic testing interpretation (TEG/ROTEM)",
                "r": [
                  "MM Ch.22"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Coagulation measurement (aPTT, PT/INR, anti-Xa)",
                "r": [
                  "MM Ch.22"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "transfusion-physio",
            "name": "Transfusion Physiology",
            "icon": "droplets",
            "refs": [
              "MM Ch.51"
            ],
            "sub": [
              {
                "t": "ABO/Rh & crossmatch",
                "r": [
                  "MM Ch.51"
                ],
                "a": null
              },
              {
                "t": "Component therapy",
                "r": [
                  "MM Ch.51"
                ],
                "a": null
              },
              {
                "t": "Massive transfusion ratios",
                "r": [
                  "MM Ch.51"
                ],
                "a": "https://litfl.com/massive-transfusion-protocol/"
              },
              {
                "t": "TACO vs TRALI",
                "r": [
                  "MM Ch.51"
                ],
                "a": null
              },
              {
                "t": "Transfusion reactions",
                "r": [
                  "MM Ch.51"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "obstetric-physio",
        "name": "Obstetric Physiology",
        "topics": [
          {
            "id": "pregnancy-physio",
            "name": "Maternal Physiology & Fetal Circulation",
            "icon": "baby",
            "refs": [
              "RCoA G2",
              "MM Ch.40",
              "MM Ch.41"
            ],
            "sub": [
              {
                "t": "Physiological alterations in pregnancy (CVS, Resp, GI, Renal)",
                "r": [
                  "RCoA G2",
                  "MM Ch.40",
                  "MM Ch.41"
                ],
                "a": null
              },
              {
                "t": "Materno-fetal circulation",
                "r": [
                  "RCoA G2",
                  "MM Ch.40",
                  "MM Ch.41"
                ],
                "a": null
              },
              {
                "t": "Fetal and neonatal circulation transitions at birth",
                "r": [
                  "RCoA G2",
                  "MM Ch.40",
                  "MM Ch.41"
                ],
                "a": null
              },
              {
                "t": "Functions of the placenta and placental transfer",
                "r": [
                  "RCoA G2",
                  "MM Ch.40",
                  "MM Ch.41"
                ],
                "a": null
              },
              {
                "t": "Pain pathways relevant to stages of labour",
                "r": [
                  "RCoA G2",
                  "MM Ch.40",
                  "MM Ch.41"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pharmacology",
    "name": "Pharmacology",
    "icon": "pill",
    "color": "#ef4444",
    "sections": [
      {
        "id": "pkpd",
        "name": "Pharmacokinetics & Pharmacodynamics",
        "topics": [
          {
            "id": "pk",
            "name": "Pharmacokinetics",
            "icon": "pill",
            "refs": [
              "RCoA G3",
              "MM Ch.7",
              "MIL Ch.30"
            ],
            "sub": [
              {
                "t": "Absorption, distribution, metabolism, excretion (ADME)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/adme"
              },
              {
                "t": "Bioavailability and first-pass metabolism",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Volume of distribution and compartments (1, 2, 3 compartment models)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/volume-distribution"
              },
              {
                "t": "Clearance mechanisms (hepatic, renal)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/clearance"
              },
              {
                "t": "First-order vs zero-order kinetics",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Half-life and context-sensitive half-time",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/half-life"
              },
              {
                "t": "Protein binding (plasma and tissue)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Enzyme induction and inhibition",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Effect-site concentration (ke0)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Target Controlled Infusion (TCI) principles",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Pharmacogenetics (CYP450 variants, pseudocholinesterase)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              }
            ]
          },
          {
            "id": "pd",
            "name": "Pharmacodynamics",
            "icon": "pill",
            "refs": [
              "RCoA G3",
              "MM Ch.7",
              "MIL Ch.30"
            ],
            "sub": [
              {
                "t": "Drug-receptor interactions (lock and key, induced fit)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Dose-response curves (Emax, EC50, slope)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/dose-response-curves"
              },
              {
                "t": "Agonists, partial agonists, antagonists",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Potency vs efficacy",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Reversible and irreversible antagonism",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Receptor types & signal transduction",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Receptor regulation, downregulation, tachyphylaxis",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Therapeutic index & margin of safety",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Non-specific drug actions (chelation, adsorption)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Drug interactions (synergism, additivity, isobolograms)",
                "r": [
                  "RCoA G3",
                  "MM Ch.7",
                  "MIL Ch.30"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "uptake-distribution",
            "name": "Uptake & Distribution of Inhaled Agents",
            "icon": "pill",
            "refs": [
              "MM Ch.8",
              "MIL Ch.31"
            ],
            "sub": [
              {
                "t": "Solubility (blood/gas partition coefficient, oil/gas)",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Cardiac output effects on uptake",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Alveolar-venous partial pressure difference",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Concentration effect & second gas effect",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Overpressurization technique",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Effect of minute ventilation",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "inhalational",
        "name": "Inhalational Anesthetics",
        "topics": [
          {
            "id": "inh-properties",
            "name": "Properties of Inhaled Agents",
            "icon": "pill",
            "refs": [
              "MM Ch.8",
              "MIL Ch.31",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Mechanisms of anaesthetic action (Meyer-Overton hypothesis)",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "MAC concept and factors affecting MAC",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Vapor pressure & boiling points",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Halogenation & chemical stability",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Solubility: blood/gas and oil/gas coefficients — onset/offset",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Distribution: vessel-rich group vs vessel-poor",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Metabolism & toxicity (halothane hepatitis, compound A, CO formation)",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Greenhouse & ozone effects of volatile agents",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "sevoflurane",
            "name": "Sevoflurane",
            "icon": "pill",
            "refs": [
              "MM Ch.8",
              "MIL Ch.31"
            ],
            "sub": [
              {
                "t": "Properties & metabolism (CYP2E1)",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Compound A formation",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Renal effects debate",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Slow washout vs desflurane",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Use in inhalational induction",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "iso-des-nt",
            "name": "Isoflurane, Desflurane & Nitrous Oxide",
            "icon": "pill",
            "refs": [
              "MM Ch.8",
              "MIL Ch.31"
            ],
            "sub": [
              {
                "t": "Isoflurane: vasodilation, pungency",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Desflurane: airway irritation, Tec 6 vaporizer, sympathetic surge",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/autonomic-nervous-system"
              },
              {
                "t": "N2O: diffusion hypoxia, expansion of gas spaces, B12/methionine synthase, PONV, teratogenicity",
                "r": [
                  "MM Ch.8",
                  "MIL Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              }
            ]
          },
          {
            "id": "inha-clinical",
            "name": "Clinical Pharmacology of Inhaled Agents",
            "icon": "pill",
            "refs": [
              "MM Ch.7",
              "MIL Ch.27",
              "OX"
            ],
            "sub": [
              {
                "t": "Effects on CMR, CBF, ICP, cerebral autoregulation",
                "r": [
                  "MM Ch.7",
                  "MIL Ch.27",
                  "OX"
                ],
                "a": null
              },
              {
                "t": "Effects on bronchial tone & hypoxic pulmonary vasoconstriction",
                "r": [
                  "MM Ch.7",
                  "MIL Ch.27",
                  "OX"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "iv-anesthetics",
        "name": "Intravenous Anesthetics",
        "topics": [
          {
            "id": "propofol",
            "name": "Propofol",
            "icon": "pill",
            "refs": [
              "MM Ch.9",
              "MIL Ch.30"
            ],
            "sub": [
              {
                "t": "Pharmacokinetics (high clearance, redistribution)",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/clearance"
              },
              {
                "t": "Pharmacodynamics (GABA-A agonist)",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Effect on BP, CO, SVR, ventilation",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Pain on injection, lipid formulation",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Propofol infusion syndrome (PRIS)",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol"
              },
              {
                "t": "TCI models (Marsh, Schnider, Eleveld)",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "thiopental-etomidate",
            "name": "Thiopental & Etomidate",
            "icon": "pill",
            "refs": [
              "MM Ch.9",
              "MIL Ch.30"
            ],
            "sub": [
              {
                "t": "Thiopental: pharmacokinetics, status epilepticus, porphyria contraindication",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Etomidate: adrenal suppression, hemodynamic stability, myoclonus, pain",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Induction doses & contexts",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ketamine-benzodiazepines",
            "name": "Ketamine & Benzodiazepines",
            "icon": "pill",
            "refs": [
              "MM Ch.9",
              "MIL Ch.30"
            ],
            "sub": [
              {
                "t": "Ketamine: NMDA antagonism, dissociative anesthesia, bronchodilation, sympathetic stimulation, emergence phenomena, catecholamine depletion risk",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/autonomic-nervous-system"
              },
              {
                "t": "Midazolam vs diazepam vs lorazepam pharmacokinetics",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Flumazenil reversal & risks",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "dexmedetomidine",
            "name": "Dexmedetomidine & Alpha-2 Agonists",
            "icon": "pill",
            "refs": [
              "MM Ch.9",
              "MIL Ch.30"
            ],
            "sub": [
              {
                "t": "Alpha-2 selectivity",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Cooperative sedation, analgesia, no respiratory depression",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Hemodynamic effects (biphasic BP)",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              },
              {
                "t": "Uses in extubation, awake intubation, delirium",
                "r": [
                  "MM Ch.9",
                  "MIL Ch.30"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "droperidol-haloperidol",
            "name": "Butyrophenones & Adjuncts",
            "icon": "pill",
            "refs": [
              "MM Ch.9"
            ],
            "sub": [
              {
                "t": "Droperidol: dopamine antagonist, QT prolongation, PONV dosing & black box warning",
                "r": [
                  "MM Ch.9"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              },
              {
                "t": "Haloperidol for delirium",
                "r": [
                  "MM Ch.9"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "opioids-analgesics",
        "name": "Opioids & Analgesics",
        "topics": [
          {
            "id": "opioid-pharm",
            "name": "Opioid Pharmacology",
            "icon": "pill",
            "refs": [
              "MM Ch.10",
              "MIL Ch.31"
            ],
            "sub": [
              {
                "t": "Receptors (mu, kappa, delta, ORL-1) & signaling",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Full vs partial agonists",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Equianalgesic dosing & conversion",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Pharmacokinetics of morphine, fentanyl, sufentanil, alfentanil, remifentanil",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Remifentanil: ester hydrolysis, context-insensitive half-time",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Methadone: NMDA action, long half-life",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/half-life"
              },
              {
                "t": "Tramadol & tapentadol mechanisms",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "opioid-effects",
            "name": "Opioid Effects & Toxicity",
            "icon": "pill",
            "refs": [
              "MM Ch.10",
              "MIL Ch.31"
            ],
            "sub": [
              {
                "t": "Respiratory depression kinetics",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Tolerance, hyperalgesia, dependence",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Naloxone & naltrexone",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Opioid-induced constipation & mu antagonists (methylnaltrexone)",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Rapid opioid tolerance",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              },
              {
                "t": "Serotonin syndrome risk (tramadol, meperidine, fentanyl)",
                "r": [
                  "MM Ch.10",
                  "MIL Ch.31"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "nonopioid-analgesics",
            "name": "Non-Opioid Analgesics",
            "icon": "pill",
            "refs": [
              "MM Ch.10",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Paracetamol: mechanism, metabolism, toxicity",
                "r": [
                  "MM Ch.10",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/paracetamol"
              },
              {
                "t": "Aspirin: mechanism, Reye's syndrome, antiplatelet effects",
                "r": [
                  "MM Ch.10",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "NSAIDs: COX-1 vs COX-2 selectivity, classification, side effects (renal, GI, asthma, CV)",
                "r": [
                  "MM Ch.10",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/nsaids"
              },
              {
                "t": "Gabapentinoids (gabapentin, pregabalin) for acute pain",
                "r": [
                  "MM Ch.10",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Ketamine (low dose), lidocaine infusion, dexmedetomidine",
                "r": [
                  "MM Ch.10",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/ketamine"
              },
              {
                "t": "Magnesium & alpha-2 agonists as adjuncts",
                "r": [
                  "MM Ch.10",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "nmbs",
        "name": "Neuromuscular Blocking Agents",
        "topics": [
          {
            "id": "nmj-physiology",
            "name": "NMJ Physiology & Depolarizing Agents",
            "icon": "pill",
            "refs": [
              "MM Ch.11",
              "MIL Ch.32",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "NMJ physiology and transmission",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Succinylcholine: depolarizing phase I block",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Pharmacokinetics (plasma cholinesterase)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Hyperkalemia (burns, denervation, immobilization)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Malignant hyperthermia trigger",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": "https://www.mhaus.org/protocols/"
              },
              {
                "t": "Phase II block",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Pseudocholinesterase deficiency (genetics, dibucaine number)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/enhanced-recovery-after-surgery"
              },
              {
                "t": "Bradycardia, myalgia, increased ICP/IOP/Intragastric pressure",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "nondepolarizing",
            "name": "Nondepolarizing NMBAs",
            "icon": "pill",
            "refs": [
              "MM Ch.11",
              "MIL Ch.32"
            ],
            "sub": [
              {
                "t": "Benzylisoquinoliniums (atracurium, cisatracurium, mivacurium, doxacurium)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32"
                ],
                "a": null
              },
              {
                "t": "Aminosteroids (rocuronium, vecuronium, pancuronium)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32"
                ],
                "a": null
              },
              {
                "t": "Hofmann elimination & Laudanosine",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32"
                ],
                "a": null
              },
              {
                "t": "Histamine release (atracurium, mivacurium)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32"
                ],
                "a": null
              },
              {
                "t": "Vagolytic & sympathomimetic (pancuronium)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32"
                ],
                "a": null
              },
              {
                "t": "Onset/duration comparison & dosing",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.32"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "reversal-nmb",
            "name": "Reversal Agents & Monitoring",
            "icon": "pill",
            "refs": [
              "MM Ch.11",
              "MIL Ch.33",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Acetylcholinesterase inhibitors (neostigmine, edrophonium)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.33",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/enhanced-recovery-after-surgery"
              },
              {
                "t": "Muscarinic co-administration (glycopyrrolate, atropine)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.33",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Sugammadex: encapsulation, dosing, contraindications, allergic reactions",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.33",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/sugammadex"
              },
              {
                "t": "Comparison of reversal strategies",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.33",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Residual blockade detection & monitoring (TOF, double burst, PTC)",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.33",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Dantrolene & Malignant Hyperthermia management",
                "r": [
                  "MM Ch.11",
                  "MIL Ch.33",
                  "RCoA G3"
                ],
                "a": "https://www.mhaus.org/protocols/"
              }
            ]
          }
        ]
      },
      {
        "id": "local-anesthetics",
        "name": "Local Anesthetics",
        "topics": [
          {
            "id": "la-pharm",
            "name": "LA Pharmacology",
            "icon": "pill",
            "refs": [
              "MM Ch.16",
              "MIL Ch.34",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Structure: amide vs ester, pKa, lipid solubility, protein binding",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/pka-and-ionization"
              },
              {
                "t": "Mechanism of action (voltage-gated Na+ channels)",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Differential block (small fibers first)",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "pH and effect of additives",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Pregnancy effects on LA",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Anti-arrhythmic effects of LAs",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "la-toxicity",
            "name": "Local Anesthetic Systemic Toxicity (LAST)",
            "icon": "pill",
            "refs": [
              "MM Ch.16",
              "ASRA guidelines",
              "MIL Ch.34"
            ],
            "sub": [
              {
                "t": "CNS toxicity: circumoral, tinnitus, seizures",
                "r": [
                  "MM Ch.16",
                  "ASRA guidelines",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Cardiac toxicity (more with bupivacaine)",
                "r": [
                  "MM Ch.16",
                  "ASRA guidelines",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Bupivacaine cardiotoxicity mechanism",
                "r": [
                  "MM Ch.16",
                  "ASRA guidelines",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Lipid emulsion therapy protocol (20%)",
                "r": [
                  "MM Ch.16",
                  "ASRA guidelines",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Prevention: test dose, incremental dosing, aspiration",
                "r": [
                  "MM Ch.16",
                  "ASRA guidelines",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Treatment algorithm (ASRA)",
                "r": [
                  "MM Ch.16",
                  "ASRA guidelines",
                  "MIL Ch.34"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "la-additives",
            "name": "Additives & Formulations",
            "icon": "flask-conical",
            "refs": [
              "MM Ch.16"
            ],
            "sub": [
              {
                "t": "Epinephrine (vasoconstriction, test dose, duration)",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "Bicarbonate (speeds onset)",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "Clonidine, dexmedetomidine, opioids",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "Dextran for prolonged effect",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "EMLA cream",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "la-agents",
            "name": "Specific Agents & Max Doses",
            "icon": "pill",
            "refs": [
              "MM Ch.16"
            ],
            "sub": [
              {
                "t": "Lidocaine, mepivacaine, bupivacaine, ropivacaine, levobupivacaine, prilocaine, chloroprocaine",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "Maximum doses with/without epinephrine",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "Methemoglobinemia (prilocaine, benzocaine)",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              },
              {
                "t": "Plain vs hyperbaric formulations for spinal",
                "r": [
                  "MM Ch.16"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "cardiovascular-drugs",
        "name": "Cardiovascular Drugs",
        "topics": [
          {
            "id": "vasopressors-inotropes",
            "name": "Vasopressors & Inotropes",
            "icon": "pill",
            "refs": [
              "MM Ch.14",
              "MIL Ch.35"
            ],
            "sub": [
              {
                "t": "Norepinephrine, epinephrine, phenylephrine, vasopressin",
                "r": [
                  "MM Ch.14",
                  "MIL Ch.35"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/norepinephrine"
              },
              {
                "t": "Dopamine, dobutamine, milrinone",
                "r": [
                  "MM Ch.14",
                  "MIL Ch.35"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/dobutamine"
              },
              {
                "t": "Receptor profiles & clinical choice",
                "r": [
                  "MM Ch.14",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Dobutamine vs milrinone (PDE inhibitor comparison)",
                "r": [
                  "MM Ch.14",
                  "MIL Ch.35"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/dobutamine"
              },
              {
                "t": "Vasopressin in vasodilatory shock",
                "r": [
                  "MM Ch.14",
                  "MIL Ch.35"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "antiarrhythmics",
            "name": "Antiarrhythmics & Antihypertensives",
            "icon": "pill",
            "refs": [
              "MM Ch.14",
              "MM Ch.18"
            ],
            "sub": [
              {
                "t": "Vaughan-Williams classification",
                "r": [
                  "MM Ch.14",
                  "MM Ch.18"
                ],
                "a": null
              },
              {
                "t": "Amiodarone, lidocaine, adenosine, beta-blockers, calcium channel blockers",
                "r": [
                  "MM Ch.14",
                  "MM Ch.18"
                ],
                "a": "https://litfl.com/amiodarone/"
              },
              {
                "t": "Esmolol, labetalol, metoprolol",
                "r": [
                  "MM Ch.14",
                  "MM Ch.18"
                ],
                "a": null
              },
              {
                "t": "Nitroglycerin, nitroprusside, hydralazine",
                "r": [
                  "MM Ch.14",
                  "MM Ch.18"
                ],
                "a": null
              },
              {
                "t": "ACE-I, ARBs, alpha-blockers",
                "r": [
                  "MM Ch.14",
                  "MM Ch.18"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "anticoag-antiplatelet",
            "name": "Anticoagulants & Antiplatelets",
            "icon": "pill",
            "refs": [
              "MM Ch.22",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Heparin (UFH, LMWH) & protamine reversal",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Warfarin & vitamin K, FFP/PCC",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "DOACs (dabigatran, rivaroxaban, apixaban) & reversal (idarucizumab, andexanet)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Aspirin, clopidogrel, prasugrel, ticagrelor, GPIIb/IIIa",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Pro-coagulants: vitamin K, FFP, specific factor concentrates",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Coagulation monitoring (aPTT, anti-Xa, viscoelastic)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Neuraxial timing guidelines (ASRA)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "respiratory-drugs",
        "name": "Respiratory Drugs",
        "topics": [
          {
            "id": "resp-drugs",
            "name": "Drugs for Respiratory System",
            "icon": "lungs",
            "refs": [
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Bronchodilators: beta-agonists, anticholinergics, methylxanthines",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Drugs for acute severe asthma",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Volatile agents as bronchodilators",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Pulmonary vasodilators (Nitric oxide, prostacyclin)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Surfactant therapy",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory-physiology/surfactant"
              },
              {
                "t": "Mucolytics",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "other-periop-drugs",
        "name": "Other Perioperative Drugs",
        "topics": [
          {
            "id": "gi-endocrine-cns",
            "name": "GI, Endocrine & CNS Drugs",
            "icon": "pill",
            "refs": [
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Antisialogogues (glycopyrrolate, atropine)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Drugs reducing gastric acidity (H2 blockers, PPIs, antacids)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Prokinetic agents (metoclopramide, erythromycin)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Antiemetics: sites of action, dexamethasone, 5HT3 antagonists",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Insulins: types, perioperative management, DKA/HHS",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/insulin"
              },
              {
                "t": "Corticosteroids: effects, perioperative supplementation",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Thyroid drugs (carbimazole, levothyroxine, liothyronine)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Antiepileptics: mechanisms, anaesthetic relevance",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Antidepressants: classes (SSRI, TCA, MAOI), toxicity/interactions",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "fluids-blood-pharm",
            "name": "Fluids & Blood Products",
            "icon": "droplets",
            "refs": [
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Crystalloids: composition (Na, Cl, K, buffer), maintenance vs replacement",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Colloids: gelatins, starches, albumin",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Blood products: PRBC, FFP, platelets, cryoprecipitate composition",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Electrolyte solutions (molar, %, mg/ml conversions)",
                "r": [
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Diuretics: classification (loop, thiazide, K-sparing), mechanisms",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "clinical-anaesthesia",
    "name": "Clinical Anaesthesia",
    "icon": "syringe",
    "color": "#f97316",
    "sections": [
      {
        "id": "preop-assessment",
        "name": "Preoperative Assessment & Preparation",
        "topics": [
          {
            "id": "preop-general",
            "name": "Preoperative Assessment",
            "icon": "clipboard-check",
            "refs": [
              "MM Ch.20",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "History, examination, airway assessment",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ASA Physical Status classification",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": "https://www.asahq.org/standards-and-practice-parameters/statement-on-asa-physical-status-classification-system"
              },
              {
                "t": "Mallampati, Wilson, thyromental distance, mouth opening",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/mallampati-score/"
              },
              {
                "t": "Investigations (ECG, CXR, labs) — NICE & ASA guidelines",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Medication optimisation (antiplatelets, anticoagulants, antihypertensives)",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Fasting guidelines (ASA, RCoA)",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "PONV risk scoring (Apfel, Koivuranta)",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              }
            ]
          },
          {
            "id": "aspiration-risk",
            "name": "Aspiration Risk & Prophylaxis",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.20",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Risk factors: emergency, obesity, pregnancy, GERD, ileus",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Prevention: fasting, H2 blockers, PPIs, metoclopramide",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Rapid Sequence Induction (RSI) — drugs, cricoid pressure evidence",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              }
            ]
          },
          {
            "id": "preop-cardiac",
            "name": "Preoperative Cardiac Evaluation",
            "icon": "heart",
            "refs": [
              "MM Ch.18",
              "ESC guidelines"
            ],
            "sub": [
              {
                "t": "Revised Cardiac Risk Index (Lee criteria)",
                "r": [
                  "MM Ch.18",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "METs assessment & functional capacity",
                "r": [
                  "MM Ch.18",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "ECG interpretation & stress testing indication",
                "r": [
                  "MM Ch.18",
                  "ESC guidelines"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Valvular heart disease evaluation",
                "r": [
                  "MM Ch.18",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "Coronary stent types & antiplatelet management",
                "r": [
                  "MM Ch.18",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "Beta-blocker & statin continuation",
                "r": [
                  "MM Ch.18",
                  "ESC guidelines"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "preop-resp",
            "name": "Preoperative Respiratory Evaluation",
            "icon": "lungs",
            "refs": [
              "MM Ch.19"
            ],
            "sub": [
              {
                "t": "Preoperative spirometry & ABG indication",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Optimization in COPD, OSA, asthma",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Smoking cessation timing & benefit",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Prehabilitation: inspiratory muscle training, exercise",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "OSA screening (STOP-BANG, Berlin questionnaire)",
                "r": [
                  "MM Ch.19"
                ],
                "a": "https://litfl.com/stop-bang-score/"
              }
            ]
          }
        ]
      },
      {
        "id": "intraop-care",
        "name": "Intraoperative Care & Monitoring",
        "topics": [
          {
            "id": "iv-access",
            "name": "IV Access & Invasive Monitoring",
            "icon": "monitor",
            "refs": [
              "MM Ch.21",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Peripheral IV, central venous access (IJ, SC, femoral) — Seldinger & landmark",
                "r": [
                  "MM Ch.21",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/"
              },
              {
                "t": "Arterial line insertion & complications",
                "r": [
                  "MM Ch.21",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pulmonary artery catheter & complications",
                "r": [
                  "MM Ch.21",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "CVP waveform analysis",
                "r": [
                  "MM Ch.21",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ultrasound-guided vascular access",
                "r": [
                  "MM Ch.21",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "gas-monitoring",
            "name": "Gas Monitoring & Ventilation",
            "icon": "lungs",
            "refs": [
              "MM Ch.21"
            ],
            "sub": [
              {
                "t": "Capnography waveform analysis (normal, obstructed, rebreathing)",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/capnography"
              },
              {
                "t": "Oxygen analysers (paramagnetic, fuel cell, galvanic)",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Anaesthetic agent monitoring",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Volumetric capnography & dead space calculation (Bohr, Enghoff)",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/capnography"
              },
              {
                "t": "Ventilator modes during anaesthesia (VC, PC, PRVC, PSV)",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "depth-monitoring",
            "name": "Depth of Anaesthesia Monitoring",
            "icon": "monitor",
            "refs": [
              "MM Ch.21"
            ],
            "sub": [
              {
                "t": "BIS, entropy, Narcotrend, evoked potentials (AEP, SSEP)",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/bis-monitoring"
              },
              {
                "t": "Frontalis EMG and isolated forearm technique",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Awareness incidence and risk factors",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Techniques to reduce awareness (MAC-wake, end-tidal agent monitoring)",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              }
            ]
          },
          {
            "id": "temperature",
            "name": "Temperature Management",
            "icon": "thermometer",
            "refs": [
              "MM Ch.21"
            ],
            "sub": [
              {
                "t": "Hypothermia complications (coagulopathy, infection, prolonged recovery)",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Forced-air warming, fluid warmers, passive insulation",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Malignant hyperthermia recognition and treatment",
                "r": [
                  "MM Ch.21"
                ],
                "a": "https://www.mhaus.org/protocols/"
              },
              {
                "t": "Site-specific temperature monitoring (nasopharynx, esophagus, bladder, tympanic)",
                "r": [
                  "MM Ch.21"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "positioning",
            "name": "Surgical Positioning & Complications",
            "icon": "move",
            "refs": [
              "MM Ch.20"
            ],
            "sub": [
              {
                "t": "Supine, prone (complications: blindness, nerve injury, VAE), Trendelenburg, lithotomy",
                "r": [
                  "MM Ch.20"
                ],
                "a": null
              },
              {
                "t": "Lateral position: axillary roll, dependent lung considerations",
                "r": [
                  "MM Ch.20"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/axillary-block/"
              },
              {
                "t": "Nerve injury physics: stretch, compression, ischemia",
                "r": [
                  "MM Ch.20"
                ],
                "a": null
              },
              {
                "t": "Pressure injuries (arms, eyes, genitalia)",
                "r": [
                  "MM Ch.20"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "electrical-safety",
            "name": "Electrical Safety & Diathermy",
            "icon": "zap",
            "refs": [
              "RCoA G2"
            ],
            "sub": [
              {
                "t": "Electrosurgery (monopolar vs bipolar) — circuit, dispersive pad",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Burns: diathermy pad burns, direct coupling, capacitive coupling",
                "r": [
                  "RCoA G2"
                ],
                "a": "https://litfl.com/diathermy-and-electrosurgical-safety/"
              },
              {
                "t": "Explosion risk (alcohol prep, bowel gas)",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              },
              {
                "t": "Fire triangle & airway fires during laser surgery",
                "r": [
                  "RCoA G2"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "airway",
        "name": "Airway Management",
        "topics": [
          {
            "id": "basic-airway",
            "name": "Basic Airway & Supraglottic Devices",
            "icon": "lungs",
            "refs": [
              "MM Ch.15",
              "MIL Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Bag-mask ventilation technique & adjuncts (OPA, NPA)",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "LMA types (Classic, ProSeal, Supreme, i-gel)",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Second generation SADs",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "LMA insertion, complications (aspiration, sore throat, nerve injuries)",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "endotracheal",
            "name": "Endotracheal Intubation",
            "icon": "syringe",
            "refs": [
              "MM Ch.15",
              "MIL Ch.27"
            ],
            "sub": [
              {
                "t": "Direct laryngoscopy (Macintosh vs Miller blades) & C-L grade",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "RSI: sequence, drugs, evidence for cricoid pressure",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Tube types: reinforced, RAE, microlaryngeal, double-lumen, MLT",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": null
              },
              {
                "t": "Confirmation (ETCO2, auscultation, ultrasound)",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": null
              },
              {
                "t": "Complications: esophageal intubation, dental injury, laryngospasm",
                "r": [
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "difficult-airway",
            "name": "Difficult Airway Management",
            "icon": "lungs",
            "refs": [
              "DAS guidelines",
              "MM Ch.15",
              "MIL Ch.27"
            ],
            "sub": [
              {
                "t": "DAS algorithm (Plan A–D)",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://www.das.uk.com/guidelines/das-intubation-guidelines"
              },
              {
                "t": "Airway assessment: Mallampati, Wilson, thyromental, mouth opening",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://litfl.com/mallampati-score/"
              },
              {
                "t": "Videolaryngoscopy (MacGrath, GlideScope, Airtraq)",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Fiberoptic intubation (awake, asleep, nasal, oral)",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": null
              },
              {
                "t": "Front-of-neck access (cricothyroidotomy, tracheostomy)",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://litfl.com/tracheostomy/"
              },
              {
                "t": "CICO (Can't Intubate, Can't Oxygenate) management",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": null
              },
              {
                "t": "Difficult Airway Society 2015 guidelines",
                "r": [
                  "DAS guidelines",
                  "MM Ch.15",
                  "MIL Ch.27"
                ],
                "a": "https://www.das.uk.com/guidelines/das-intubation-guidelines"
              }
            ]
          },
          {
            "id": "one-lung",
            "name": "One-Lung Ventilation",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "MIL Ch.91"
            ],
            "sub": [
              {
                "t": "Indications (thoracic, esophageal, aortic surgery)",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.91"
                ],
                "a": null
              },
              {
                "t": "Double-lumen tube vs bronchial blocker vs EZ-blocker",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.91"
                ],
                "a": null
              },
              {
                "t": "Hypoxic pulmonary vasoconstriction",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.91"
                ],
                "a": null
              },
              {
                "t": "Hypoxia during OLV: management",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.91"
                ],
                "a": null
              },
              {
                "t": "TIVA vs volatile for OLV (effect on HPV)",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.91"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva"
              },
              {
                "t": "Prevention of lung injury (VILI, protective ventilation)",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.91"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ventilator-induced-lung-injury"
              }
            ]
          }
        ]
      },
      {
        "id": "general-anaesthesia",
        "name": "General Anaesthesia Techniques",
        "topics": [
          {
            "id": "tci",
            "name": "TIVA & TCI",
            "icon": "syringe",
            "refs": [
              "MM Ch.9",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "TIVA components & advantages",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva"
              },
              {
                "t": "TCI pumps: Diprifusor (Marsh), Schnider, Eleveld",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Target setting: plasma vs effect-site",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Context-sensitive half-time",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "TIVA vs volatile comparison (PONV, emergence, cost)",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva"
              }
            ]
          },
          {
            "id": "induction-maintenance",
            "name": "Induction & Maintenance Techniques",
            "icon": "syringe",
            "refs": [
              "MM Ch.7"
            ],
            "sub": [
              {
                "t": "Inhalational induction (sevoflurane vs halothane)",
                "r": [
                  "MM Ch.7"
                ],
                "a": null
              },
              {
                "t": "IV induction vs inhalational: choice rationale",
                "r": [
                  "MM Ch.7"
                ],
                "a": null
              },
              {
                "t": "IV vs volatile maintenance and recovery profile",
                "r": [
                  "MM Ch.7"
                ],
                "a": null
              },
              {
                "t": "LM vs circle system and fresh gas flow management",
                "r": [
                  "MM Ch.7"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "emergence",
            "name": "Emergence & Postoperative Care",
            "icon": "syringe",
            "refs": [
              "MM Ch.20"
            ],
            "sub": [
              {
                "t": "Tracheal extubation criteria",
                "r": [
                  "MM Ch.20"
                ],
                "a": "https://teachmeanatomy.info/thorax/organs/trachea/"
              },
              {
                "t": "Deep vs awake extubation",
                "r": [
                  "MM Ch.20"
                ],
                "a": null
              },
              {
                "t": "Atropine/neostigmine reversal",
                "r": [
                  "MM Ch.20"
                ],
                "a": null
              },
              {
                "t": "Transport & handover to recovery",
                "r": [
                  "MM Ch.20"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "special-anaesthesia",
        "name": "Anaesthesia for Special Surgery",
        "topics": [
          {
            "id": "cardiac-anes",
            "name": "Cardiac Anaesthesia",
            "icon": "heart",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "CPB physiology & complication management",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/cardiac-anaesthesia/cardiopulmonary-bypass"
              },
              {
                "t": "Pharmacology of cardioplegia",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Myocardial protection strategies",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "TEE monitoring & interpretation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Fast-tracking & early extubation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Aortic surgery, cerebral protection",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Off-pump vs on-pump CABG",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "neuro-anes",
            "name": "Neuroanaesthesia",
            "icon": "brain",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "ICP management & brain relaxation",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/neurology/intracranial-pressure"
              },
              {
                "t": "Cerebral protection strategies",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "TIVA vs volatile for neurosurgery",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva"
              },
              {
                "t": "Supratentorial, infratentorial, spinal surgery",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Awake craniotomy techniques",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Positioning: sitting (VAE risk), prone, park bench",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "thoracic-anes",
            "name": "Thoracic Anaesthesia",
            "icon": "activity",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "One-lung ventilation: double-lumen tube + bronchial blockers",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/thoracic-anaesthesia/one-lung-ventilation"
              },
              {
                "t": "Hypoxia management during OLV",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Lung isolation, lung separation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Thoracoscopic surgery (VATS) anaesthetic considerations",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Bronchopleural fistula management",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Mediastinal mass: anaesthetic risks & management",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "transplant-anes",
            "name": "Transplant Anaesthesia",
            "icon": "activity",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Brainstem death criteria & organ donor management",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/neurology/brainstem-death"
              },
              {
                "t": "Liver transplant: venovenous bypass, reperfusion syndrome",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Renal transplant: fluid, electrolyte, immunosuppression",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ambulatory",
            "name": "Ambulatory & Day-Case Anaesthesia",
            "icon": "activity",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Patient selection criteria and scoring systems",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Anaesthetic technique (TIVA, volatile, regional)",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva"
              },
              {
                "t": "PONV & pain management for day case",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              },
              {
                "t": "Discharge criteria (Aldrete, PADSS)",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "bariatric",
            "name": "Bariatric Anaesthesia",
            "icon": "activity",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Pathophysiology of obesity (CV, respiratory, metabolic)",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Airway management challenges & strategies",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Pharmacokinetic alterations in obesity",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Positioning, RSI, PONV prophylaxis",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Enhanced recovery after bariatric surgery",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "trauma-anes",
            "name": "Trauma & Emergency Anaesthesia",
            "icon": "ambulance",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Damage control resuscitation & MTP",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "RSI in trauma",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Hybrid resuscitation (REBOA)",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Massive transfusion protocol & complications",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://litfl.com/massive-transfusion-protocol/"
              },
              {
                "t": "Burn anaesthesia: fluid resuscitation (Parkland), airway, escharotomy",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Traumatic brain injury & spinal cord injury management",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              },
              {
                "t": "Polytrauma: prioritisation (ATLS framework)",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://litfl.com/atls-primary-survey/"
              }
            ]
          }
        ]
      },
      {
        "id": "postop-care",
        "name": "Postoperative Care & Complications",
        "topics": [
          {
            "id": "postop-complications",
            "name": "Postoperative Complications",
            "icon": "activity",
            "refs": [
              "MM Ch.20",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Postoperative nausea & vomiting: risk factors, prophylaxis, treatment",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Delayed emergence: causes and management",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Postoperative cognitive dysfunction & delirium",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Shivering: physiology, prevention, treatment",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Postoperative respiratory failure (atelectasis, pneumonia, PE)",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Postoperative oliguria: pre-renal, renal, post-renal",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Surgical site infection (SSI) prevention",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "VTE prophylaxis (Caprini score, mechanical, pharmacological)",
                "r": [
                  "MM Ch.20",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              }
            ]
          },
          {
            "id": "enhanced-recovery",
            "name": "Enhanced Recovery After Surgery (ERAS)",
            "icon": "activity",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Multimodal analgesia, goal-directed fluid therapy",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pain/multimodal-analgesia"
              },
              {
                "t": "Early feeding, early mobilisation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Prehabilitation, carbohydrate loading",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Audit & outcome measurement",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "fluid-electrolytes-haematology",
    "name": "Fluid, Electrolytes & Haematology",
    "icon": "droplets",
    "color": "#ec4899",
    "sections": [
      {
        "id": "fluid-therapy",
        "name": "Fluid Therapy & Composition",
        "topics": [
          {
            "id": "crystalloids",
            "name": "Crystalloids & Colloids",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "MIL Ch.35",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Composition of crystalloids (plasmalyte, hartmanns, 0.9% saline, dextrose)",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Maintenance vs replacement vs resuscitation fluids",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Colloid vs crystalloid controversy (SALTIRE, SAFE, CHEST, 6S trials)",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Albumin: SAFE study, indications",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Starches: renal injury, coagulation effects, FDA/EMA warnings",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Gelatins: low molecular weight, allergic reactions",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Balanced solutions vs 0.9% saline: hyperchloraemic acidosis",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "fluid-assessment",
            "name": "Fluid Status Assessment & GDFT",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Dynamic vs static measures (PPV, SVV, passive leg raise)",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Lactate, base deficit, ScvO2",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Goal-directed fluid therapy protocols",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Oesophageal Doppler, PiCCO, LiDCO, FloTrac",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Resuscitation end-points",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "electrolytes",
        "name": "Electrolytes & Acid-Base",
        "topics": [
          {
            "id": "sodium-water",
            "name": "Sodium and Water Balance",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "MIL Ch.35"
            ],
            "sub": [
              {
                "t": "Hyponatraemia: causes, SIADH vs CSW, treatment",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Hypernatraemia: causes, diabetes insipidus, management",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Osmolality and ADH physiology",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Syndrome of Inappropriate ADH (SIADH)",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Cerebral salt wasting",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Osmotic demyelination syndrome",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "k-mg-ca-phos",
            "name": "Potassium, Magnesium, Calcium & Phosphate",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "MIL Ch.35"
            ],
            "sub": [
              {
                "t": "Hypokalaemia & hyperkalaemia: ECG changes, causes, emergency management (insulin/dextrose, Ca2+, salbutamol, resonium)",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Hypomagnesaemia & hypermagnesaemia: causes, ECG, treatment",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Hypocalcaemia & hypercalcaemia: causes, signs, treatment",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              },
              {
                "t": "Phosphate: hypophosphataemia in refeeding, hyperphosphataemia in renal failure",
                "r": [
                  "MM Ch.22",
                  "MIL Ch.35"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "haematology",
        "name": "Haematology & Transfusion",
        "topics": [
          {
            "id": "coagulation",
            "name": "Coagulation & Haemostasis",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Coagulation cascade (intrinsic, extrinsic, common pathway)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/coagulation-cascade"
              },
              {
                "t": "Platelet function, adhesion, aggregation",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Fibrinolysis & D-dimer",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Viscoelastic testing (TEG, ROTEM, Sonoclot)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Tests of coagulation: PT, aPTT, TT, fibrinogen, bleeding time",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Liver disease coagulopathy",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Disseminated intravascular coagulation (DIC)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "blood-products",
            "name": "Blood Products & Transfusion",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Components: PRBC, FFP, platelets, cryoprecipitate, factor concentrates",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Transfusion triggers (restrictive vs liberal)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Massive transfusion protocol & damage control resuscitation",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": "https://litfl.com/massive-transfusion-protocol/"
              },
              {
                "t": "Complications: TRALI, TACO, haemolytic, febrile, allergic, infection",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Blood storage lesion",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Crossmatch, group & screen, emergency O-negative blood",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Cell salvage: indications, contraindications, leukocyte depletion",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Patient Blood Management (PBM) principles",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "anaemia",
            "name": "Anaemia & Haemoglobinopathies",
            "icon": "droplets",
            "refs": [
              "MM Ch.22",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Preoperative anaemia: causes, investigation, treatment (Fe, EPO, B12, folate)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Sickle cell disease: pathophysiology, perioperative management",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Thalassaemia: alpha vs beta, perioperative considerations",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "G6PD deficiency: triggers, hemolysis, drug avoidance",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Hereditary spherocytosis, elliptocytosis",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "antiplatelet-anticoag",
            "name": "Antiplatelet & Anticoagulant Drugs",
            "icon": "pill",
            "refs": [
              "MM Ch.22",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Aspirin, clopidogrel, prasugrel, ticagrelor, GPIIb/IIIa inhibitors",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Heparin (UFH, LMWH) & protamine",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Warfarin, DOACs (dabigatran, rivaroxaban, apixaban, edoxaban)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Reversal: vitamin K, PCC, idarucizumab, andexanet alfa",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Neuraxial timing (ASRA/ESRA guidelines)",
                "r": [
                  "MM Ch.22",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "haematological-malignancy",
            "name": "Haematological Malignancy & Disorders",
            "icon": "droplets",
            "refs": [
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Preoperative optimization in haematological malignancy",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Myeloproliferative disorders & thrombosis risk",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Thrombophilia: factor V Leiden, antiphospholipid syndrome",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Thrombocytopenia: ITP, HIT (types I & II), TTP, aHUS",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "HIT: 4Ts score, alternative anticoagulation (danaparoid, argatroban, fondaparinux)",
                "r": [
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "perioperative-medicine",
    "name": "Perioperative Medicine & Coexisting Disease",
    "icon": "heart-pulse",
    "color": "#8b5cf6",
    "sections": [
      {
        "id": "cardiac-disease",
        "name": "Cardiovascular Disease",
        "topics": [
          {
            "id": "ihd",
            "name": "Ischaemic Heart Disease",
            "icon": "heart",
            "refs": [
              "MM Ch.18",
              "RCoA G4",
              "ESC guidelines"
            ],
            "sub": [
              {
                "t": "Pathophysiology of IHD",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "Perioperative cardiac risk assessment (RCRI, NSQIP MICA)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": "https://litfl.com/revised-cardiac-risk-index-rcri/"
              },
              {
                "t": "Preoperative investigations (ECG, ECHO, stress testing, coronary angiography)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Beta-blocker controversy (POISE, POISE-2)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "Statin continuation",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "Anti-platelet management & stent types (BMS vs DES)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": null
              },
              {
                "t": "Management of perioperative myocardial injury (MINS)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4",
                  "ESC guidelines"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "valvular",
            "name": "Valvular Heart Disease",
            "icon": "heart",
            "refs": [
              "MM Ch.18",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Aortic stenosis: pathophysiology, anaesthetic goals",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Aortic regurgitation: HR goals, afterload reduction",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Mitral stenosis: rate control, pulmonary hypertension",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Mitral regurgitation: afterload reduction",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Prosthetic valves & anticoagulation",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Infective endocarditis prophylaxis (NICE guidelines)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "arrhythmias",
            "name": "Cardiac Arrhythmias & Devices",
            "icon": "heart",
            "refs": [
              "MM Ch.18",
              "MM Ch.21"
            ],
            "sub": [
              {
                "t": "AF: perioperative management, rate vs rhythm control, anticoagulation",
                "r": [
                  "MM Ch.18",
                  "MM Ch.21"
                ],
                "a": null
              },
              {
                "t": "Pacemakers & ICDs: perioperative management, magnet use, reprogramming",
                "r": [
                  "MM Ch.18",
                  "MM Ch.21"
                ],
                "a": "https://litfl.com/pacemaker-basics/"
              },
              {
                "t": "ECG interpretation: ischemia, electrolyte abnormalities, heart block",
                "r": [
                  "MM Ch.18",
                  "MM Ch.21"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Perioperative arrhythmia management",
                "r": [
                  "MM Ch.18",
                  "MM Ch.21"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "heart-failure",
            "name": "Heart Failure & Cardiomyopathy",
            "icon": "heart",
            "refs": [
              "MM Ch.18",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Chronic HF management (ACE-I, beta-blockers, diuretics, SGLT2i)",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/beta-blockers"
              },
              {
                "t": "Acute decompensated HF management",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hypertrophic cardiomyopathy: LVOT obstruction, anaesthetic implications",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Dilated cardiomyopathy: low EF management",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Perioperative management of VADs and transplant patients",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "pulmonary-hypertension",
            "name": "Pulmonary Hypertension & Cor Pulmonale",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "WHO PH classification",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Anaesthetic implications of PH",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pulmonary vasodilators: NO, prostacyclin, sildenafil, bosentan",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "hypertension",
            "name": "Systemic Hypertension",
            "icon": "activity",
            "refs": [
              "MM Ch.18",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Perioperative BP targets",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Antihypertensive classes & perioperative management",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Urgency vs emergency management",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "End-organ damage assessment",
                "r": [
                  "MM Ch.18",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "respiratory-disease",
        "name": "Respiratory Disease",
        "topics": [
          {
            "id": "copd",
            "name": "COPD & Asthma",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "GOLD staging, optimization, perioperative management",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Asthma: stepwise management, acute severe asthma protocols",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Anaesthetic implications of bronchodilators & steroids",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Smoking cessation & perioperative pulmonary risk",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Risk of barotrauma & air trapping in COPD",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "osa-obesity",
            "name": "OSA & Obesity Hypoventilation Syndrome",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "OSA screening (STOP-BANG, Berlin)",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/stop-bang-score/"
              },
              {
                "t": "CPAP/ BiPAP: perioperative management",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "OHS: pathophysiology, perioperative care",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Sedation risks, airway challenges, CPAP continuation",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "restrictive-lung",
            "name": "Restrictive Lung Disease & Infections",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Interstitial lung disease, pulmonary fibrosis, sarcoidosis",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ankylosing spondylitis: airway considerations",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Chest infections: pneumonia, bronchiectasis, cystic fibrosis",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Preoperative physiotherapy & pulmonary rehabilitation",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "renal-disease",
        "name": "Renal Disease",
        "topics": [
          {
            "id": "aki-ckd",
            "name": "Acute Kidney Injury & Chronic Kidney Disease",
            "icon": "kidney",
            "refs": [
              "MM Ch.22",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "AKI: RIFLE/AKIN/KDIGO criteria, causes, prevention",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "CKD: staging, anaemia, electrolyte management",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Perioperative fluid & drug management in CKD",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Dialysis: perioperative timing, types (HD, PD), complications",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Renal transplant: anaesthesia, fluid, immunosuppression",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Contrast-induced nephropathy prevention",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "hepatic-disease",
        "name": "Hepatic & Biliary Disease",
        "topics": [
          {
            "id": "liver-disease",
            "name": "Liver Disease & Failure",
            "icon": "liver",
            "refs": [
              "MM Ch.22",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Child-Pugh & MELD scoring",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/hepatology/child-pugh-score"
              },
              {
                "t": "Coagulopathy in liver disease",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hepatorenal syndrome",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hepatic encephalopathy",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Portal hypertension & varices",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Perioperative mortality risk in cirrhosis",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Acute liver failure: ICP management, transplant listing",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/neurology/intracranial-pressure"
              },
              {
                "t": "Liver function test & synthetic function assessment",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "cholestasis",
            "name": "Cholestasis & Biliary Disease",
            "icon": "liver",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Obstructive jaundice: coagulopathy, renal risk",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Gallstone pancreatitis",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cholangitis",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "endocrine-disease",
        "name": "Endocrine Disease",
        "topics": [
          {
            "id": "dm",
            "name": "Diabetes Mellitus",
            "icon": "gauge",
            "refs": [
              "MM Ch.23",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Type 1 vs Type 2: pathophysiology, complications",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Perioperative glucose management (JBDS guidelines)",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Variable-rate IV insulin infusion protocol",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "DKA & HHS: diagnosis and management",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/diabetic-ketoacidosis"
              },
              {
                "t": "Metformin: lactic acidosis risk, NPO timing",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "SGLT2i: euglycaemic DKA risk",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/diabetic-ketoacidosis"
              },
              {
                "t": "Long-term complications: autonomic neuropathy, gastroparesis, silent ischaemia",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "thyroid",
            "name": "Thyroid & Adrenal Disease",
            "icon": "kidney",
            "refs": [
              "MM Ch.23",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Hyperthyroidism: thyroid storm prevention, beta-blockers, antithyroid drugs",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/endocrinology/thyroid-storm"
              },
              {
                "t": "Hypothyroidism: myxoedema coma, drug sensitivity",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Goitre: airway assessment, retrosternal extension",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Adrenal insufficiency: perioperative steroid coverage",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Phaeochromocytoma: alpha-blockade first, beta-blockade, intraoperative BP management",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cushing's syndrome & Conn's syndrome",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pituitary disease: acromegaly (airway), DI, SIADH",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "obesity-metabolic",
            "name": "Obesity & Metabolic Syndrome",
            "icon": "activity",
            "refs": [
              "MM Ch.23",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Obesity: classification, CV/Respiratory pathophysiology",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Metabolic syndrome and NAFLD",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Anaesthetic drug dosing in obesity",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Bariatric anaesthesia specific considerations",
                "r": [
                  "MM Ch.23",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "porphyria-mh",
            "name": "Porphyria & Inherited Metabolic Disorders",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.23",
              "RCoA G3"
            ],
            "sub": [
              {
                "t": "Acute intermittent porphyria: triggers, safe/unsafe drugs",
                "r": [
                  "MM Ch.23",
                  "RCoA G3"
                ],
                "a": null
              },
              {
                "t": "Malignant hyperthermia susceptibility",
                "r": [
                  "MM Ch.23",
                  "RCoA G3"
                ],
                "a": "https://www.mhaus.org/protocols/"
              },
              {
                "t": "Pseudocholinesterase deficiency",
                "r": [
                  "MM Ch.23",
                  "RCoA G3"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/enhanced-recovery-after-surgery"
              },
              {
                "t": "Carcinoid syndrome: perioperative management, octreotide",
                "r": [
                  "MM Ch.23",
                  "RCoA G3"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "neuromuscular-disease",
        "name": "Neurological & Neuromuscular Disease",
        "topics": [
          {
            "id": "neurologic-conditions",
            "name": "Neurological Conditions",
            "icon": "brain",
            "refs": [
              "MM Ch.24",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Epilepsy: perioperative antiepileptic management",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Parkinson's disease: dopaminergic drug timing, MH-like syndrome",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/malignant-hyperthermia/"
              },
              {
                "t": "Multiple sclerosis: anaesthetic implications, regional vs GA",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Stroke & TIA: perioperative antiplatelet, timing of surgery",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Myasthenia gravis: anticholinesterase management, Sux sensitivity, NMB selection",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/enhanced-recovery-after-surgery"
              },
              {
                "t": "Guillain-Barré syndrome & Eaton-Lambert syndrome",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Spinal cord injury: autonomic hyperreflexia, sux risk (hyperkalemia)",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              }
            ]
          },
          {
            "id": "muscular-dystrophy",
            "name": "Muscular Dystrophies & Myopathies",
            "icon": "dumbbell",
            "refs": [
              "MM Ch.24",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Duchenne & Becker: cardiac/respiratory involvement, MH risk",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/malignant-hyperthermia/"
              },
              {
                "t": "Myotonic dystrophy: sensitivity to sedatives, respiratory depression, MH-like reactions",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/malignant-hyperthermia/"
              },
              {
                "t": "Mitochondrial myopathies: avoid propofol, lactate monitoring",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol"
              },
              {
                "t": "Rhabdomyolysis: causes, complications, management",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "cerebral-palsy",
            "name": "Cerebral Palsy & Learning Disability",
            "icon": "brain",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Perioperative management: communication, consent, behavioural challenges",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Associated comorbidities: reflux, scoliosis, seizures, contractures",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "misc-comorbidities",
        "name": "Miscellaneous Comorbidities",
        "topics": [
          {
            "id": "rheumatology",
            "name": "Rheumatological & Connective Tissue Diseases",
            "icon": "bone",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Rheumatoid arthritis: airway (atlantoaxial instability, TMJ, cricoarytenoid), CV risk",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ankylosing spondylitis: difficult airway, spinal/epidural challenges",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://www.das.uk.com/guidelines/das-intubation-guidelines"
              },
              {
                "t": "Scleroderma: pulmonary fibrosis, difficult IV access, Raynaud's",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Marfan syndrome: aortic root, valvular, pneumothorax",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ehlers-Danlos: vascular fragility, easy bruising",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "renal-hepatic-transplant",
            "name": "Transplant Patients",
            "icon": "activity",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Immunosuppression: drugs, interactions, infection risk",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Post-transplant renal/liver function & drug dosing",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Infection prophylaxis timing",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "psychiatric-substance",
            "name": "Psychiatric & Substance Use Disorders",
            "icon": "brain",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Depression: SSRIs, SNRIs, TCAs, MAOIs — perioperative interactions",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Lithium toxicity & monitoring",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Antipsychotics: neuroleptic malignant syndrome, QT prolongation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Alcohol dependence: withdrawal (CIVVA-Ar), Wernicke-Korsakoff",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Opioid dependence: methadone, buprenorphine, pain management challenges",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Illicit drugs: cocaine (MI, arrhythmias), amphetamines, cannabis",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/bis-monitoring"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "obstetric-anaesthesia",
    "name": "Obstetric Anaesthesia",
    "icon": "baby",
    "color": "#14b8a6",
    "sections": [
      {
        "id": "obstetric-physiology",
        "name": "Obstetric Physiology",
        "topics": [
          {
            "id": "maternal-physiology",
            "name": "Maternal Physiological Changes",
            "icon": "baby",
            "refs": [
              "MM Ch.26",
              "OX Ob",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "CV: increased CO, SVR decrease, aortocaval compression",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/maternal-physiological-changes"
              },
              {
                "t": "Resp: FRC decrease, O2 consumption increase, airway oedema",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Haematological: hypercoagulable, anaemia of pregnancy",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "GIT: delayed gastric emptying, reduced LOS tone (aspiration risk)",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Renal: increased GFR, glycosuria",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate"
              },
              {
                "t": "Endocrine: placental hormones, cortisol, thyroid changes",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pharmacological: MAC reduction, altered protein binding",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Pain pathways relevant to stages of labour",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "placental-physiology",
            "name": "Placental Physiology & Drug Transfer",
            "icon": "pill",
            "refs": [
              "MM Ch.26",
              "OX Ob"
            ],
            "sub": [
              {
                "t": "Placental circulation & gas exchange",
                "r": [
                  "MM Ch.26",
                  "OX Ob"
                ],
                "a": null
              },
              {
                "t": "Drug transfer mechanisms: passive diffusion, active transport",
                "r": [
                  "MM Ch.26",
                  "OX Ob"
                ],
                "a": null
              },
              {
                "t": "Factors affecting transfer: lipid solubility, pKa, protein binding, molecular weight",
                "r": [
                  "MM Ch.26",
                  "OX Ob"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/pka-and-ionization"
              },
              {
                "t": "Uteroplacental blood flow autoregulation",
                "r": [
                  "MM Ch.26",
                  "OX Ob"
                ],
                "a": null
              },
              {
                "t": "Fetal drug distribution & elimination",
                "r": [
                  "MM Ch.26",
                  "OX Ob"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "obstetric-anaesthesia-techniques",
        "name": "Anaesthesia for Labour & Delivery",
        "topics": [
          {
            "id": "labour-analgesia",
            "name": "Labour Analgesia",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.26",
              "OX Ob",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Epidural analgesia: technique, drugs, PCEA, CSE",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/obstetric/epidural-analgesia/"
              },
              {
                "t": "Complications: dural puncture, post-dural puncture headache, PDPH management (blood patch)",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Systemic analgesia: remifentanil PCA (monitoring required), nitrous oxide",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pain/patient-controlled-analgesia"
              },
              {
                "t": "Non-pharmacological: water immersion, TENS, positions",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Contraindications to neuraxial blockade in labour",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "cd-anaesthesia",
            "name": "Anaesthesia for Caesarean Section",
            "icon": "baby",
            "refs": [
              "MM Ch.26",
              "OX Ob",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Spinal anaesthesia for elective CD: dosing, positioning, hypotension management",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/spinal-anesthesia/"
              },
              {
                "t": "Epidural anaesthesia: top-up for emergency CD",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "CSE technique",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "General anaesthesia for CD: RSI, aspiration prophylaxis, thiopental/propofol, sux/rocuronium",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol"
              },
              {
                "t": "Failed intubation in obstetrics: incidence, algorithm (OB DAS)",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Maternal hypotension: prevention (co-load, vasopressors, lateral tilt)",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "high-risk-obstetric",
            "name": "High-Risk Obstetric Conditions",
            "icon": "baby",
            "refs": [
              "MM Ch.26",
              "OX Ob",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Pre-eclampsia & eclampsia: pathophysiology, MgSO4 protocol, fluid management",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/obstetric-anaesthesia/pre-eclampsia"
              },
              {
                "t": "Haemorrhage: PPH (causes, 4Ts, MTP, uterotonics)",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/postpartum-haemorrhage-pph/"
              },
              {
                "t": "Placenta praevia & accreta: planning, blood products, interventional radiology",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Amniotic fluid embolism: recognition, management",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Morbid obesity in pregnancy",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cardiac disease in pregnancy (ESC guidelines)",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Obstetric DIC & transfusion",
                "r": [
                  "MM Ch.26",
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "maternal-resus",
            "name": "Maternal Resuscitation & MBRRACE-UP",
            "icon": "baby",
            "refs": [
              "RCoA G4",
              "MBRRACE-UP"
            ],
            "sub": [
              {
                "t": "Maternal cardiac arrest: perimortem C-section within 5 mins",
                "r": [
                  "RCoA G4",
                  "MBRRACE-UP"
                ],
                "a": "https://litfl.com/perimortem-caesarean-section/"
              },
              {
                "t": "MBRRACE-UP reports: lessons, recurrent themes, Safer Maternity Care",
                "r": [
                  "RCoA G4",
                  "MBRRACE-UP"
                ],
                "a": null
              },
              {
                "t": "Modified obstetric early warning systems (MEOWS)",
                "r": [
                  "RCoA G4",
                  "MBRRACE-UP"
                ],
                "a": null
              },
              {
                "t": "Maternal death review & reporting",
                "r": [
                  "RCoA G4",
                  "MBRRACE-UP"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "fetal-neonatal",
        "name": "Fetal Assessment & Neonatal Resuscitation",
        "topics": [
          {
            "id": "fetal-monitoring",
            "name": "Fetal Wellbeing & Monitoring",
            "icon": "baby",
            "refs": [
              "OX Ob",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Cardiotocography (CTG) interpretation: NICE categories",
                "r": [
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Fetal scalp blood sampling & lactate",
                "r": [
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Fetal acid-base physiology",
                "r": [
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Umbilical cord gases: interpretation",
                "r": [
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Fetal heart rate patterns & anaesthetic implications",
                "r": [
                  "OX Ob",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "neonatal-resus",
            "name": "Neonatal Resuscitation",
            "icon": "child",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "APGAR scoring",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Neonatal resuscitation algorithm (NLS/ILCOR)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Thermoregulation & temperature management",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Oxygen delivery & saturation targets",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Meconium aspiration management",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Umbilical venous access & drugs",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pain-medicine",
    "name": "Pain Medicine",
    "icon": "triangle-alert",
    "color": "#f43f5e",
    "sections": [
      {
        "id": "pain-physiology",
        "name": "Pain Physiology & Mechanisms",
        "topics": [
          {
            "id": "pain-pathways",
            "name": "Pain Pathways & Nociception",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.30",
              "RCoA G4",
              "OX Pain"
            ],
            "sub": [
              {
                "t": "Nociception: transduction, transmission, modulation, perception",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "A-delta, C fibres, A-beta: function, myelination, speed",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Spinothalamic tract & ascending pathways",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Descending inhibitory pathways: PAG, RVM, NA/5-HT",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Gate control theory of pain",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Neuroplasticity: peripheral & central sensitisation",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Wind-up, long-term potentiation, referred pain",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Visceral vs somatic pain: differences",
                "r": [
                  "MM Ch.30",
                  "RCoA G4",
                  "OX Pain"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "pain-classification",
            "name": "Pain Classification & Assessment",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.30",
              "OX Pain"
            ],
            "sub": [
              {
                "t": "Acute vs chronic vs cancer pain",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/pain-medicine/"
              },
              {
                "t": "Nociceptive vs neuropathic vs nociplastic pain",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Neuropathic pain: features, screening tools (LANSS, DN4, painDETECT)",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Pain assessment tools: VAS, NRS, BPS, FLACC, PAINAD",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "WHO analgesic ladder & acute pain escalation",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Chronic pain: biopsychosocial model, fear-avoidance model",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Catastrophising, kinesiophobia, central sensitisation syndromes",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Psychological aspects of pain: anxiety, depression, coping",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "pain-genetics",
            "name": "Genetic & Psychological Factors",
            "icon": "brain",
            "refs": [
              "OX Pain"
            ],
            "sub": [
              {
                "t": "COMT, OPRM1, MC1R polymorphisms and pain sensitivity",
                "r": [
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Placebo & nocebo mechanisms",
                "r": [
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Conditioned pain modulation (CPM), diffuse noxious inhibitory control (DNIC)",
                "r": [
                  "OX Pain"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "acute-pain",
        "name": "Acute Pain Management",
        "topics": [
          {
            "id": "multimodal-analgesia",
            "name": "Multimodal Analgesia",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.30",
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Multimodal analgesia concept & evidence",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pain/multimodal-analgesia"
              },
              {
                "t": "Paracetamol, NSAIDs, COX-2 inhibitors",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/paracetamol"
              },
              {
                "t": "Gabapentinoids (gabapentin, pregabalin)",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ketamine (low dose), lidocaine infusion, magnesium",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/ketamine"
              },
              {
                "t": "Alpha-2 agonists (clonidine, dexmedetomidine)",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "NMDA antagonists: ketamine mechanisms, S-ketamine vs racemic",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/ketamine"
              },
              {
                "t": "Corticosteroids: single-dose dexamethasone effects",
                "r": [
                  "MM Ch.30",
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "opioid-acute",
            "name": "Opioids in Acute Pain",
            "icon": "pill",
            "refs": [
              "MM Ch.10",
              "OX Pain"
            ],
            "sub": [
              {
                "t": "PCA: morphine, fentanyl, hydromorphone",
                "r": [
                  "MM Ch.10",
                  "OX Pain"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pain/patient-controlled-analgesia"
              },
              {
                "t": "Opioid switching & rotation",
                "r": [
                  "MM Ch.10",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "PONV interaction, ileus, urinary retention",
                "r": [
                  "MM Ch.10",
                  "OX Pain"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              },
              {
                "t": "Respiratory depression monitoring (capnography)",
                "r": [
                  "MM Ch.10",
                  "OX Pain"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/capnography"
              },
              {
                "t": "Equianalgesic dosing charts",
                "r": [
                  "MM Ch.10",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Opioid induced hyperalgesia",
                "r": [
                  "MM Ch.10",
                  "OX Pain"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "regional-acute-pain",
            "name": "Regional Analgesia Techniques",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.30",
              "OX Pain"
            ],
            "sub": [
              {
                "t": "Epidural analgesia: indications, drugs, PCEA",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/obstetric/epidural-analgesia/"
              },
              {
                "t": "Continuous peripheral nerve blocks (catheter techniques)",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Local infiltration & wound catheters",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Interfascial plane blocks: TAP, erector spinae, quadratus lumborum, PECS",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              },
              {
                "t": "Evidence for regional vs systemic analgesia",
                "r": [
                  "MM Ch.30",
                  "OX Pain"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "acute-pain-special",
            "name": "Special Populations & Acute Pain",
            "icon": "triangle-alert",
            "refs": [
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Elderly: altered physiology, dosing, delirium risk",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Opioid-tolerant & substance use disorder patients",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Acute on chronic pain management",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Sickle cell disease pain crisis",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Procedural sedation & analgesia",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "chronic-pain",
        "name": "Chronic Pain Management",
        "topics": [
          {
            "id": "chronic-pain-assessment",
            "name": "Assessment & Diagnosis",
            "icon": "clipboard-check",
            "refs": [
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "History taking: PQRST, red flags, yellow flags",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Widespread pain index & symptom severity (Fibromyalgia criteria)",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/fibromyalgia/"
              },
              {
                "t": "Neuropathic pain assessment scales (LANSS, DN4)",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Quantitative sensory testing (QST) basics",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Psychosocial assessment: HADS, PHQ-9, PCS, Tampa Kinesiophobia",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "neuropathic-pain",
            "name": "Neuropathic Pain & Medications",
            "icon": "brain",
            "refs": [
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "NICE guidelines for neuropathic pain: first-line (gabapentinoids, amitriptyline, duloxetine)",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Second-line: lidocaine patch, capsaicin, tramadol",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Third-line: strong opioids, botulinum toxin, TENS",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Antidepressants: amitriptyline, nortriptyline, duloxetine, venlafaxine",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Anticonvulsants: gabapentin, pregabalin, carbamazepine, lamotrigine",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Topical agents: lidocaine, capsaicin, amitriptyline/ketamine",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/ketamine"
              },
              {
                "t": "Cannabinoids for pain: evidence & legal status",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "interventional-chronic",
            "name": "Interventional Pain Procedures",
            "icon": "triangle-alert",
            "refs": [
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Epidural steroid injections & transforaminal vs interlaminar",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "Facet joint injections & medial branch blocks / RF denervation",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Sacroiliac joint injections & RF",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Sympathetic blocks: stellate, coeliac plexus, lumbar sympathetic",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/physiology-and-basic-science/autonomic-nervous-system"
              },
              {
                "t": "Spinal cord stimulation: indications, trial, complications",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              },
              {
                "t": "Intrathecal drug delivery systems",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Vertebroplasty & kyphoplasty",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Trigger point injections & dry needling",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Radiofrequency ablation: pulsed vs thermal",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Peripheral nerve stimulation",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "chronic-pain-conditions",
            "name": "Specific Chronic Pain Conditions",
            "icon": "triangle-alert",
            "refs": [
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Low back pain: red flags, radiculopathy, spinal stenosis, cauda equina",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Fibromyalgia: diagnosis criteria (ACR 2016), management",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/fibromyalgia/"
              },
              {
                "t": "Complex Regional Pain Syndrome (CRPS): Budapest criteria, types I/II, treatment",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/complex-regional-pain-syndrome/"
              },
              {
                "t": "Post-herpetic neuralgia: prevention (vaccination), management",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Phantom limb pain: prevention, treatment",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Peripheral neuropathy: diabetic, alcoholic, HIV",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Headache: migraine, tension, cluster, medication overuse",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Myofascial pain syndrome & trigger points",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pelvic pain: assessment, management",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cancer pain: WHO ladder, neuropathic component, interventional options",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/pain-medicine/"
              }
            ]
          },
          {
            "id": "rehab-psychology",
            "name": "Rehabilitation & Psychological Therapies",
            "icon": "activity",
            "refs": [
              "OX Pain",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Cognitive Behavioural Therapy (CBT) for pain",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Acceptance and Commitment Therapy (ACT)",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Graded exposure & graded exercise therapy",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pain management programmes (PMPs): multidisciplinary approach",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Biofeedback & relaxation techniques",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Physiotherapy & occupational therapy role",
                "r": [
                  "OX Pain",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "intensive-care",
    "name": "Intensive Care",
    "icon": "monitor",
    "color": "#06b6d4",
    "sections": [
      {
        "id": "icu-basics",
        "name": "ICU Basics & Monitoring",
        "topics": [
          {
            "id": "icu-monitoring",
            "name": "ICU Monitoring",
            "icon": "monitor",
            "refs": [
              "MM Ch.21",
              "MIL Ch.36",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Standard monitoring: ECG, SpO2, NIBP, IBP, CVP, temp",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/ecg-basics/"
              },
              {
                "t": "Advanced hemodynamic monitoring: PiCCO, LiDCO, FloTrac/Vigileo, oesophageal Doppler",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cardiac output measurement: thermodilution, Fick, Doppler, pulse contour analysis",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ScvO2, SvO2, lactate, base deficit as resuscitation endpoints",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Echocardiography in ICU (FOCUS, TTE, TOE)",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ICP monitoring: EVD, parenchymal bolt, Camino",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Intracranial pressure waveform analysis",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Near-infrared spectroscopy (NIRS)",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "EEG, BIS, entropy, evoked potentials in ICU",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/bis-monitoring"
              },
              {
                "t": "Blood gas analysis: pH, PaO2, PaCO2, HCO3, BE, lactate, electrolytes",
                "r": [
                  "MM Ch.21",
                  "MIL Ch.36",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/clinical-measurement/blood-gas-analysis"
              }
            ]
          },
          {
            "id": "icu-sedation",
            "name": "Sedation, Delirium & Mobilisation",
            "icon": "monitor",
            "refs": [
              "MM Ch.9",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Sedation targets (RASS, SAS) & sedation holidays",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Drugs: propofol, midazolam, dexmedetomidine, volatile (isocapnic)",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol"
              },
              {
                "t": "Delirium: CAM-ICU, ICDSC, prevention, haloperidol, dexmedetomidine",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "PAD (Pain, Agitation, Delirium) & ABCDEF bundle",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Early mobilisation & family engagement",
                "r": [
                  "MM Ch.9",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "respiratory-failure",
        "name": "Respiratory Failure & Ventilation",
        "topics": [
          {
            "id": "ventilation",
            "name": "Mechanical Ventilation",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "MIL Ch.24",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Ventilator modes: VC, PC, PRVC, SIMV, PSV, BiPAP, APRV, HFO",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ARDS: Berlin definition, severity",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              },
              {
                "t": "Lung protective ventilation: tidal volume 6ml/kg, PEEP, plateau pressure <30",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Recruitment manoeuvres: indications, contraindications",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Prone ventilation: physiology, evidence (PROSEVA), complications",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/prone-ventilation"
              },
              {
                "t": "Permissive hypercapnia: indications, contraindications",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ventilator-induced lung injury (VILI): volutrauma, barotrauma, atelectrauma, biotrauma",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ventilator-induced-lung-injury"
              },
              {
                "t": "Ventilator waveforms: flow, pressure, volume — interpretation",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Extubation: readiness testing, SBT, cuff leak test",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Tracheostomy: timing (TracMan), percutaneous vs surgical, complications",
                "r": [
                  "MM Ch.19",
                  "MIL Ch.24",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/tracheostomy/"
              }
            ]
          },
          {
            "id": "non-invasive",
            "name": "Non-Invasive Ventilation & High-Flow",
            "icon": "lungs",
            "refs": [
              "MM Ch.19",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "NIV/CPAP/BiPAP: indications, settings, monitoring",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "High-flow nasal oxygen (HFNO / Optiflow): physiology, applications",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "NIV in acute respiratory failure vs cardiogenic pulmonary oedema",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Helmet NIV vs face mask",
                "r": [
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "weaning",
            "name": "Weaning & Liberation from Ventilation",
            "icon": "lungs",
            "refs": [
              "MM Ch.19"
            ],
            "sub": [
              {
                "t": "Readiness criteria, SBT methods (T-piece, PSV, CPAP)",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Failed extubation: causes, prevention, cuff leak test",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Respiratory muscle weakness: ICU-acquired weakness",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Weaning protocols: nurse-led, daily screening",
                "r": [
                  "MM Ch.19"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ecmo",
            "name": "ECMO & Advanced Respiratory Support",
            "icon": "lungs",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "ECMO: VV vs VA, indications (EOLIA, CESAR trials), circuit components",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cannulation strategies, anticoagulation management",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Complications: bleeding, thrombosis, limb ischemia, neurological",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ECMO weaning & decannulation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ECCO2R: indications, role in ARDS",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              }
            ]
          }
        ]
      },
      {
        "id": "shock-circulation",
        "name": "Shock & Haemodynamics",
        "topics": [
          {
            "id": "shock-classification",
            "name": "Classification & Management of Shock",
            "icon": "monitor",
            "refs": [
              "MM Ch.18",
              "MM Ch.19",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Hypovolaemic, cardiogenic, distributive (septic, anaphylactic), obstructive",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Initial assessment: history, exam, lactate, ScvO2, echo",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Goal-directed therapy: EGDT vs liberal (ProCESS, ARISE, ProMISe)",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Vasopressors: norepinephrine first-line, vasopressin, epinephrine",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/norepinephrine"
              },
              {
                "t": "Inotropes: dobutamine, milrinone, levosimendan",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/dobutamine"
              },
              {
                "t": "Cardiogenic shock: IABP, Impella, LVAD, ECMO",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Obstructive shock: tension pneumothorax, tamponade, PE — diagnosis and management",
                "r": [
                  "MM Ch.18",
                  "MM Ch.19",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "sepsis",
            "name": "Sepsis & Septic Shock",
            "icon": "monitor",
            "refs": [
              "MM Ch.19",
              "SSC guidelines",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Sepsis definitions: Sepsis-3, SOFA, qSOFA, SIRS",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/sepsis/sepsis-definitions"
              },
              {
                "t": "SSC 1-hour bundle: lactate, cultures, Abx, fluids, vasopressors",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Source control: identification and intervention",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Antibiotic stewardship in ICU: de-escalation, procalcitonin",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              },
              {
                "t": "Adjunctive therapies: hydrocortisone, vitamin C, thiamine (ACTT-1)",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Vasopressor choice & timing: norepinephrine, vasopressin, angiotensin II",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/norepinephrine"
              },
              {
                "t": "Fluid resuscitation in sepsis: crystalloid, albumin, restrictive vs liberal",
                "r": [
                  "MM Ch.19",
                  "SSC guidelines",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/sepsis/sepsis-definitions"
              }
            ]
          }
        ]
      },
      {
        "id": "icu-conditions",
        "name": "Specific ICU Conditions",
        "topics": [
          {
            "id": "aki-icu",
            "name": "Acute Kidney Injury",
            "icon": "kidney",
            "refs": [
              "MM Ch.22",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "KDIGO criteria, staging",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Causes: pre-renal, intrinsic, post-renal",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "RRT: CVVH, CVVHD, CVVHDF, SLED, IHD — indications, anticoagulation",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "CRRT prescription & dose, fluid balance management",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal/crrt"
              },
              {
                "t": "Complications of RRT: hypotension, arrhythmias, electrolyte imbalance, filter clotting",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "neurocritical",
            "name": "Neurocritical Care",
            "icon": "brain",
            "refs": [
              "MM Ch.24",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Traumatic brain injury: ICP/CPP targets (Brain Trauma Foundation)",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Subarachnoid haemorrhage: WFNS grade, vasospasm, nimodipine",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Intracerebral haemorrhage: BP targets, surgical evacuation role",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ischaemic stroke: thrombolysis, thrombectomy, hemicraniectomy",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Status epilepticus: treatment algorithm, EEG monitoring",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Spinal cord injury: MAP goals, steroids controversy, surgical timing",
                "r": [
                  "MM Ch.24",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              }
            ]
          },
          {
            "id": "icu-gi-nutrition",
            "name": "Gastrointestinal & Nutrition",
            "icon": "utensils-crossed",
            "refs": [
              "MM Ch.22",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Stress ulcer prophylaxis",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Intra-abdominal hypertension & abdominal compartment syndrome",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Acute pancreatitis: management, nutrition",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Nutrition: enteral vs parenteral, timing, composition, overfeeding",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Refeeding syndrome: pathophysiology, prevention, monitoring",
                "r": [
                  "MM Ch.22",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "icu-endocrine",
            "name": "Endocrine & Metabolic in ICU",
            "icon": "monitor",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Glycaemic control: NICE-SUGAR, targets, hypoglycaemia avoidance",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Adrenal insufficiency in critical illness: ACTH test, steroid replacement",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Diabetes insipidus & SIADH in ICU",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Electrolyte derangements: Na, K, Ca, Mg, phosphate — ICU-specific",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "icu-prognostication",
            "name": "Prognostication & Scoring in ICU",
            "icon": "monitor",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "APACHE II/IV, SAPS II/III, SOFA, MPM0",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://litfl.com/sofa-score/"
              },
              {
                "t": "Limitations: lead-time bias, case-mix, calibration",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Frailty scoring (Clinical Frailty Scale) in ICU prognostication",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Neuro-prognostication after cardiac arrest: SSEP, EEG, neuron-specific enolase",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "icu-procedures",
        "name": "ICU Procedures & Organisation",
        "topics": [
          {
            "id": "icu-procedures",
            "name": "Procedures & Certification",
            "icon": "monitor",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Central line insertion: US-guided, complications (pneumothorax, arterial puncture, infection)",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Arterial line insertion & complications (thrombosis, infection, hematoma)",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Chest drain insertion: Seldinger vs open, underwater seal, complications",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Bronchoscopy in ICU: indications, technique, BAL",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Percutaneous tracheostomy: technique, complications (bleeding, infection, fistula)",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://litfl.com/tracheostomy/"
              },
              {
                "t": "Lumbar puncture: indications, technique, opening pressure, complications",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Death certification: legal requirements, MCCD, coroner referrals",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "icu-bioethics",
            "name": "Ethics, Withdrawal & Organ Donation",
            "icon": "scale",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Brainstem death testing: criteria, apnoea test, pitfalls",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/neurology/brainstem-death"
              },
              {
                "t": "Donation after Brainstem Death (DBD) & Donation after Circulatory Death (DCD)",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/neurology/brainstem-death"
              },
              {
                "t": "Withdrawal of life-sustaining therapy: process, palliation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "DNACPR, treatment limitation plans, ReSPECT forms",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Futility & best interests decisions",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Communication with families in ICU",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "paediatric-anaesthesia",
    "name": "Paediatric Anaesthesia",
    "icon": "child",
    "color": "#f59e0b",
    "sections": [
      {
        "id": "paediatric-physiology",
        "name": "Paediatric Physiology & Pharmacology",
        "topics": [
          {
            "id": "paed-physiology",
            "name": "Physiological Differences",
            "icon": "child",
            "refs": [
              "MM Ch.27",
              "MIL Ch.47",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Airway: narrower, more cephalad larynx (C3-4), large tongue, funnel-shaped",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/neck/the-larynx/"
              },
              {
                "t": "Respiratory: higher O2 consumption, lower FRC, rib compliance, diaphragmatic breathing",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/thorax/muscles/diaphragm/"
              },
              {
                "t": "CV: higher HR, lower BP, limited cardiac reserve, transition from fetal circulation",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Fluids: higher TBW, insensible losses, immature renal function",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Temperature: large SA:weight, brown fat, limited shivering",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hepatic/renal: immature metabolism, clearance (CYP450, GFR maturation)",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/renal-physiology/glomerular-filtration-rate"
              },
              {
                "t": "Neurological: immature blood-brain barrier, NMDA/GABA balance",
                "r": [
                  "MM Ch.27",
                  "MIL Ch.47",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-pharmacology",
            "name": "Pharmacological Differences",
            "icon": "pill",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "MAC: higher in neonates, decreases with age",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/minimum-alveolar-concentration"
              },
              {
                "t": "Sux: bradycardia risk (pre-treat with atropine)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Volatile: induction characteristics, halothane vs sevoflurane",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Opioid sensitivity: increased risk of respiratory depression",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Propofol: dosing by age, neonatal caution",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol"
              },
              {
                "t": "Paracetamol & NSAID dosing in children",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/paracetamol"
              },
              {
                "t": "Inhalational induction technique",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "paediatric-anaesthesia-techniques",
        "name": "Paediatric Anaesthesia Techniques",
        "topics": [
          {
            "id": "paed-airway",
            "name": "Paediatric Airway & Equipment",
            "icon": "lungs",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Face mask sizing, oral/nasal airways",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "LMA sizes and insertion technique",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "ET tube sizes: formula (age/4 + 4), uncuffed vs cuffed",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Endotracheal intubation: straight blade, depth formula (age/2 + 12)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/thorax/organs/trachea/"
              },
              {
                "t": "Circuit: Mapleson F (Jackson-Rees), circle system with paediatric adaptations",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Preoxygenation limitations in children",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-fluid",
            "name": "Paediatric Fluid & Transfusion",
            "icon": "droplets",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Maintenance: 4-2-1 rule (Holliday-Segar)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Deficit & replacement: NPO deficit + third space losses",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Intraoperative fluid: isotonic solutions (plasmalyte, hartmanns)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hypoglycaemia risk & glucose management",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Blood volume: 80-100 ml/kg, transfusion triggers",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Massive haemorrhage in children",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-regional",
            "name": "Paediatric Regional Anaesthesia",
            "icon": "child",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Caudal epidural: dosing (1ml/kg), drugs (bupivacaine, ropivacaine, additives)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/pediatric/caudal-block/"
              },
              {
                "t": "Ilioinguinal/iliohypogastric, TAP, rectus sheath blocks",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Penile block for circumcision: technique, dose, contraindications",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Femoral, sciatic, supraclavicular blocks in children",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/supraclavicular-block/"
              },
              {
                "t": "Ultrasound guidance in paediatric regional",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "paediatric-special",
        "name": "Special Paediatric Considerations",
        "topics": [
          {
            "id": "paed-neonatal-surgery",
            "name": "Neonatal Surgery & Congenital Conditions",
            "icon": "child",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Congenital diaphragmatic hernia: pathophysiology, anaesthetic management",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/thorax/muscles/diaphragm/"
              },
              {
                "t": "Oesophageal atresia & TEF: aspiration risk, lung isolation, Replogle tube",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Gastroschisis & omphalocele: fluid losses, heat loss, primary vs staged closure",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pyloric stenosis: electrolyte (hypochloraemic hypokalaemic metabolic alkalosis), RSI",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "Necrotising enterocolitis (NEC): sick neonate, haemodynamic instability",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Myelomeningocoele: positioning, latex allergy",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Exomphalos: large defect, abdominal compartment syndrome risk",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-common",
            "name": "Common Paediatric Surgical Conditions",
            "icon": "child",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Tonsillectomy & adenoidectomy: bleeding risk, airway concerns, PONV",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              },
              {
                "t": "Cleft lip & palate: airway management, difficult intubation risk",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Circumcision: penile block, caudal, GIRFT guidelines",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/pediatric/caudal-block/"
              },
              {
                "t": "Inguinal hernia: preterm infant risk (apnoea), spinal/GA debate",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Strabismus surgery: oculocardiac reflex, PONV prophylaxis",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/bis-monitoring"
              },
              {
                "t": "Myringotomy/grommets: day-case, sevoflurane induction",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-trauma",
            "name": "Paediatric Trauma & Emergency",
            "icon": "child",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Paediatric trauma: epidemiology, ATLS modifications, non-accidental injury",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://litfl.com/atls-primary-survey/"
              },
              {
                "t": "Paediatric burns: Parkland formula, airway oedema, escharotomy",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Epiglottitis vs croup: airway management differences",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Foreign body aspiration: anaesthetic concerns, rigid bronchoscopy",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Status epilepticus in children",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-sedation",
            "name": "Paediatric Sedation & Non-OR Anaesthesia",
            "icon": "child",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Sedation for MRI, CT, dental, procedures (chloral hydrate, midazolam, ketamine, propofol)",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/propofol"
              },
              {
                "t": "NICE sedation guidelines: competencies, monitoring, discharge criteria",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Scanning under anaesthesia: implications for transport, monitoring",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "paed-periop",
            "name": "Perioperative Care & Resuscitation",
            "icon": "ambulance",
            "refs": [
              "MM Ch.27",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Preoperative: fasting (RCoA/APAGBI guidelines), EMLA, oral premedication (midazolam, ketamine)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/ketamine"
              },
              {
                "t": "Parental presence at induction: evidence, local policy",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Paediatric resuscitation: PILS algorithm, weight estimation (PAWPER tape, APLS formula)",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://www.resus.org.uk/library/algorithm-archive/paediatric-als-algorithm"
              },
              {
                "t": "Difficult airway in child: APA difficult airway algorithm",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://www.das.uk.com/guidelines/das-intubation-guidelines"
              },
              {
                "t": "PONV in children: risk factors, prophylaxis, rescue",
                "r": [
                  "MM Ch.27",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/postoperative-nausea-and-vomiting"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "regional-anaesthesia",
    "name": "Regional Anaesthesia",
    "icon": "needle",
    "color": "#a855f7",
    "sections": [
      {
        "id": "regional-science",
        "name": "Science of Regional Anaesthesia",
        "topics": [
          {
            "id": "regional-physiology",
            "name": "Nerve Physiology & Blockade",
            "icon": "brain",
            "refs": [
              "MM Ch.16",
              "MIL Ch.34",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Nerve structure: epineurium, perineurium, endoneurium",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Myelination & saltatory conduction",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Differential block: small fibres blocked first",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Local anaesthetic mechanism on Na+ channels (closed, open, inactivated states)",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/tiva"
              },
              {
                "t": "Factors affecting block: concentration, volume, pH, additives",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Anatomy of nerve plexuses: brachial, lumbar, sacral",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "regional-drugs",
            "name": "Drugs & Additives",
            "icon": "pill",
            "refs": [
              "MM Ch.16",
              "MIL Ch.34"
            ],
            "sub": [
              {
                "t": "Lidocaine (short), bupivacaine (long), ropivacaine, levobupivacaine",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Chloroprocaine (spinal/epidural ultra-short)",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "Epinephrine: prolongation, test dose, systemic absorption reduction",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Clonidine, dexmedetomidine, opioids, bicarbonate",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34"
                ],
                "a": null
              },
              {
                "t": "Dexamethasone as adjunct: evidence, perineural vs IV",
                "r": [
                  "MM Ch.16",
                  "MIL Ch.34"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ultrasound-ns",
            "name": "Ultrasound & Nerve Stimulation",
            "icon": "brain",
            "refs": [
              "MM Ch.16",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Ultrasound physics: frequency, depth, anisotropy, acoustic enhancement",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Needle types: echogenic vs non-echogenic, short-bevel vs long-bevel",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Nerve stimulator: current, frequency, response (DCS, PNS, MS)",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "In-plane vs out-of-plane technique",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hydrodissection, perineural vs extrafascial injection",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "regional-complications",
            "name": "Complications & Safety",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.16",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "LAST: presentation, prevention, treatment (lipid emulsion 20%)",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Nerve injury: mechanisms, risk factors, medicolegal",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Haematoma: risk factors, ASRA anticoagulant guidelines",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Infection: prevention, epidural abscess management",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "Pneumothorax (supraclavicular, paravertebral)",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/supraclavicular-block/"
              },
              {
                "t": "Phrenic nerve palsy (interscalene): risk, contraindications",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/interscalene-block/"
              },
              {
                "t": "Horner's syndrome, recurrent laryngeal nerve block (stretched)",
                "r": [
                  "MM Ch.16",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "upper-limb",
        "name": "Upper Limb Blocks",
        "topics": [
          {
            "id": "interscalene",
            "name": "Interscalene Block",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "MIL Ch.34",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: shoulder, proximal humerus surgery",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approach: Winnie (C6 root level), US-guided technique",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Dermatomal coverage: C5-C7",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Phrenic nerve palsy (100% at standard volumes)",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Complications: vertebral artery injection, epidural spread, pneumothorax (rare)",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.34",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              }
            ]
          },
          {
            "id": "supraclavicular",
            "name": "Supraclavicular Block",
            "icon": "monitor",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: elbow, forearm, hand surgery",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approach: 'Stoplight' sign, US-guided (subclavian artery, pleura)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Coverage: C5-T1, entire upper limb except medial arm",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pneumothorax risk: US reduces but not eliminates",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Phrenic nerve involvement: ~20-30% risk",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "infraclavicular",
            "name": "Infraclavicular Block",
            "icon": "monitor",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: elbow, forearm, hand surgery (catheter-friendly)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approach: coracoid, vertical infraclavicular, US-guided (axillary artery, cords)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/axillary-block/"
              },
              {
                "t": "Coverage: C7-T1 best, C5-6 variable (musculocutaneous often missed)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Advantages: catheter site, lower pneumothorax vs supraclavicular",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/supraclavicular-block/"
              }
            ]
          },
          {
            "id": "axillary",
            "name": "Axillary Block",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: forearm, hand surgery",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approach: perivascular, transarterial, US (axillary artery, median/ulnar/radial/musculocutaneous)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/upper-extremity/axillary-block/"
              },
              {
                "t": "Coverage: C5-T1 (musculocutaneous often missed — separate injection)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Advantages: no phrenic/pneumothorax risk",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Limitations: high tourniquet pain (lack of intercostobrachial)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "distal-upper",
            "name": "Distal Upper Limb Blocks",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Elbow blocks: median, ulnar, radial, LACN",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Wrist blocks: median, ulnar, radial",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Digital block: technique, contraindication to epinephrine (debate)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "lower-limb",
        "name": "Lower Limb Blocks",
        "topics": [
          {
            "id": "lumbar-plexus",
            "name": "Lumbar Plexus & Psoas Block",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: hip, proximal femur, knee surgery",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approach: posterior (psoas compartment), US landmark (L4 transverse process)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Coverage: femoral, obturator, lateral femoral cutaneous (LFCN)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/"
              },
              {
                "t": "Complications: epidural spread, bilateral block, retroperitoneal haematoma",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              }
            ]
          },
          {
            "id": "femoral",
            "name": "Femoral Nerve Block",
            "icon": "brain",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: femur, knee, quadriceps tendon, patella surgery",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approach: US (femoral artery landmark, fascia iliaca below)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/"
              },
              {
                "t": "Coverage: anterior thigh, femur, patella, medial leg (saphenous)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Quadriceps weakness: fall risk, discharge precautions",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Adductor canal block as alternative: motor sparing",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/adductor-canal-block/"
              }
            ]
          },
          {
            "id": "adductor-canal",
            "name": "Adductor Canal Block",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: knee surgery, ACL reconstruction, total knee arthroplasty",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Approach: US (mid-thigh, femoral artery in sartorius canal)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/lower-extremity/femoral-nerve-block/"
              },
              {
                "t": "Coverage: saphenous nerve, vastus medialis (variable motor)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "sciatic",
            "name": "Sciatic Nerve Block",
            "icon": "brain",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: foot, ankle, posterior knee, below-knee amputation",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Approaches: Labat (posterior), subgluteal, popliteal (lateral/intertendinous)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Popliteal fossa: tibial vs common peroneal bifurcation — US-guided",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Complete foot/ankle anaesthesia with saphenous block",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ankle-foot",
            "name": "Ankle Block & Foot Blocks",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Posterior tibial, sural, superficial peroneal, deep peroneal, saphenous",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Field block vs individual nerve blocks",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Mayo block for hallux surgery",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "neuraxial",
        "name": "Neuraxial Blockade",
        "topics": [
          {
            "id": "spinal",
            "name": "Spinal Anaesthesia",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "MIL Ch.33",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Anatomy: lumbar puncture, conus medullaris (L1-2), dural sac (S2)",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Technique: median vs paramedian, Whitacre vs Quincke, pencil-point vs cutting",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Baricity: hyperbaric (dextrose 10%), isobaric, hypobaric — effect on spread",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Factors affecting spread: volume, dose, baricity, patient position, age, pregnancy",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Complications: PDPH, spinal haematoma, infection, TNS, cauda equina syndrome",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Total spinal: recognition, management",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Spinal vs epidural vs CSE comparison",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              }
            ]
          },
          {
            "id": "epidural",
            "name": "Epidural Anaesthesia & Analgesia",
            "icon": "triangle-alert",
            "refs": [
              "MM Ch.17",
              "MIL Ch.33",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Lumbar vs thoracic epidural: indication differences",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "Loss of resistance technique (saline vs air)",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Test dose: lidocaine + epinephrine",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Dosing: volume, concentration, age, pregnancy adjustments",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Combined spinal-epidural: technique, indication, complications",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              },
              {
                "t": "Complications: dural puncture, PDPH, haematoma, abscess, catheter shearing",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Epidural top-up for emergency CS",
                "r": [
                  "MM Ch.17",
                  "MIL Ch.33",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/neuraxial-anesthesia/epidural-anesthesia/"
              }
            ]
          },
          {
            "id": "caudal",
            "name": "Caudal Anaesthesia",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Indications: paediatric surgery (circumcision, hernia, hypospadias)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Technique: sacral hiatus, loss of resistance (pop), US guidance",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Dosing: 0.5-1 ml/kg, bupivacaine 0.25% + additives",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Complications: IV injection, rectal puncture, failed block",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "truncal-blocks",
        "name": "Truncal & Fascial Plane Blocks",
        "topics": [
          {
            "id": "abdominal-wall",
            "name": "Abdominal Wall Blocks",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "TAP block: classical (triangle of Petit) vs US-guided subcostal/lateral",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/truncal-blockade/transverse-abdominis-plane-block/"
              },
              {
                "t": "Rectus sheath block: umbilical/ventral hernia repair",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Ilioinguinal/iliohypogastric block: hernia repair, orchidopexy",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "PECS I & II: breast surgery, serratus anterior plane block",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Quadratus lumborum block: abdominal surgery (hip, nephrectomy, colectomy)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Erector spinae plane block: thoracic, abdominal, hip — mechanism debate",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "truncal-other",
            "name": "Other Truncal Blocks",
            "icon": "needle",
            "refs": [
              "MM Ch.17",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Paravertebral block: thoracic for breast, thoracotomy, rib fractures",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/sub-specialty-and-other-techniques/truncal-blockade/paravertebral-block/"
              },
              {
                "t": "Intercostal block: rib fractures, chest drain insertion",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cervical plexus block: carotid endarterectomy (superficial vs deep)",
                "r": [
                  "MM Ch.17",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "education-management",
    "name": "Education, Training & Management",
    "icon": "graduation-cap",
    "color": "#64748b",
    "sections": [
      {
        "id": "ed-education",
        "name": "Education & Training",
        "topics": [
          {
            "id": "ed-curriculum",
            "name": "Curriculum & Training Structure",
            "icon": "monitor",
            "refs": [
              "RCoA G1",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "RCoA 2021 Curriculum: domains, capabilities in practice (CiPs)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Dual ACCS anaesthesia pathway (3 yrs) + higher training (4 yrs)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Primary FRCA & Final FRCA exam structure",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "EDAIC Part I & Part II structure",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Workplace-Based Assessments (WBPA): DOPS, CEX, CBD, MSF",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Training portfolios (Lifetime Learning Log, ePortfolio)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Trainer roles: ES, CS, TPD, ARCP panel",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-assessment",
            "name": "Assessment & Feedback",
            "icon": "clipboard-check",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Formative vs summative assessment",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Constructive feedback: Pendleton rules, SET-GO, ALOBA",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Entrustable Professional Activities (EPAs)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Multi-source feedback (MSF / 360-degree)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Portfolio reflection & quality improvement",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-teaching",
            "name": "Teaching & Supervision",
            "icon": "graduation-cap",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Surgical airway teaching: models, simulation, cadaveric",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Simulation-based education: fidelity, debriefing (Diamond, PEARLS)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Direct supervision vs distant supervision",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Case-based discussion (CbD) as teaching tool",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Near-peer teaching, e-learning, flipped classroom",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-cpd",
            "name": "Continuing Professional Development",
            "icon": "graduation-cap",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "CPD requirements: RCoA, GMC revalidation",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Appraisal & revalidation: supporting information, CPD diary",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Study leave & budget management",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "ed-management",
        "name": "Management & Leadership",
        "topics": [
          {
            "id": "ed-quality",
            "name": "Quality Improvement & Patient Safety",
            "icon": "clipboard",
            "refs": [
              "RCoA G1",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Clinical governance: pillars, framework",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Audit cycle: standard setting, data collection, change implementation, re-audit",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "QI methodology: PDSA, LEAN, Six Sigma, Model for Improvement",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "National audit projects (NAP: NAP5 awareness, NAP6 allergy, NAP7 perioperative cardiac arrest)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Incident reporting: Datix/SIRMS, duty of candour",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Root cause analysis: fishbone, 5 whys, human factors",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Never events in anaesthesia: wrong-sided block, retained swabs",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-leadership",
            "name": "Leadership & Teamworking",
            "icon": "clipboard",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Leadership styles: situational, transformational, transactional",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Crisis resource management: CRM principles",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Human factors: cognitive aids, checklists (WHO Safer Surgery), briefings/debriefings",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Team dynamics: Tuckman model, hierarchy flattening, speaking up",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Fatigue & resilience: impact on performance, rest provisions",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-health-economics",
            "name": "Health Economics & Resource Management",
            "icon": "clipboard",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "NHS structure: ICS, commissioner/provider split, funding flows",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Health economics: QALY, ICER, CEA, CUA versus CBA",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "NICE technology appraisal process",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Budgeting: cost-effectiveness, cost-utility, service line reporting",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Theatre efficiency: utilisation, turnaround times, scheduling",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-research",
            "name": "Research & Evidence-Based Practice",
            "icon": "clipboard",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Study design: RCT, cohort, case-control, cross-sectional",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Bias types: selection, information, confounding, publication",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Statistical concepts: P-value, CI, NNT, NNH, sensitivity, specificity, ROC",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Critical appraisal: CASP checklist, GRADE, PICO",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Research ethics: IRAS, REC, consent, data protection (GDPR)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Good Clinical Practice (GCP) framework",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "ed-regulatory",
        "name": "Regulatory & Legal Framework",
        "topics": [
          {
            "id": "ed-gmc",
            "name": "GMC, RCoA & Regulatory Bodies",
            "icon": "scale",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "GMC: Good Medical Practice, fitness to practise, MPTS",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "RCoA: role in training, examinations, standards",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              },
              {
                "t": "Care Quality Commission (CQC): key lines of enquiry",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "NICE: clinical guidelines, technology appraisal, interventional procedures",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Safeguarding: vulnerable adults, children (Working Together to Safeguard Children)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Mental Capacity Act 2005 & Deprivation of Liberty Safeguards (DoLS)",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              }
            ]
          },
          {
            "id": "ed-consent",
            "name": "Consent & Capacity",
            "icon": "scale",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Valid consent: capacity, information, voluntariness",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Montgomery ruling (2015): reasonable patient standard vs reasonable doctor",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Children: Gillick competence, Fraser guidelines, parental responsibility",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Emergency treatment without consent (common law",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Advance decisions, lasting power of attorney",
                "r": [
                  "RCoA G1"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Court of Protection & best interests decisions",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "ed-medicolegal",
            "name": "Medicolegal & Complaints",
            "icon": "scale",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Complaints handling: local resolution, PHSO, NHS resolution",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Duty of candour: statutory (healthcare) vs professional",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Liability: NHS indemnity, clinical negligence vs tort",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Disclosure & barring service (DBS)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Freedom of Information Act, Data Protection Act/GDPR",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Equality Act 2010: protected characteristics, reasonable adjustments",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "emergency-resuscitation",
    "name": "Emergency & Resuscitation",
    "icon": "ambulance",
    "color": "#dc2626",
    "sections": [
      {
        "id": "basic-life-support",
        "name": "Basic & Advanced Life Support",
        "topics": [
          {
            "id": "bls",
            "name": "Basic Life Support",
            "icon": "ambulance",
            "refs": [
              "RCUK",
              "ERC guidelines",
              "AHA guidelines"
            ],
            "sub": [
              {
                "t": "BLS algorithm: CAB, compression rate (100-120/min), depth (5-6 cm)",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "AHA guidelines"
                ],
                "a": "https://www.resus.org.uk/library/algorithm-archive/adult-bls-algorithm"
              },
              {
                "t": "Chain of survival",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "AHA guidelines"
                ],
                "a": null
              },
              {
                "t": "AED use & safety",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "AHA guidelines"
                ],
                "a": null
              },
              {
                "t": "Paediatric BLS (PBLS) modifications",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "AHA guidelines"
                ],
                "a": null
              },
              {
                "t": "Recovery position & airway opening manoeuvres",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "AHA guidelines"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "als",
            "name": "Advanced Life Support (ALS)",
            "icon": "ambulance",
            "refs": [
              "RCUK",
              "ERC guidelines",
              "MM Ch.19"
            ],
            "sub": [
              {
                "t": "ALS algorithm: shockable (VF/pVT) vs non-shockable (PEA/asystole)",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": "https://www.resus.org.uk/library/algorithm-archive/adult-als-algorithm"
              },
              {
                "t": "Defibrillation: energy, positioning, biphasic vs monophasic",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": "https://litfl.com/defibrillation/"
              },
              {
                "t": "Airway management in cardiac arrest: SGA vs ET tube",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Vascular access: IV vs IO, drug delivery timing",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": null
              },
              {
                "t": "Drugs: adrenaline (1mg q3-5min), amiodarone (300mg for shockable)",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": "https://litfl.com/amiodarone/"
              },
              {
                "t": "Reversible causes: 4Hs & 4Ts (checklist approach)",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "ROSC: post-resuscitation care, targeted temperature management",
                "r": [
                  "RCUK",
                  "ERC guidelines",
                  "MM Ch.19"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "peri-arrest",
            "name": "Peri-Arrest Arrhythmias",
            "icon": "heart",
            "refs": [
              "RCUK",
              "ERC guidelines"
            ],
            "sub": [
              {
                "t": "Bradycardia: algorithm, atropine, transcutaneous pacing, isoprenaline",
                "r": [
                  "RCUK",
                  "ERC guidelines"
                ],
                "a": null
              },
              {
                "t": "Tachycardia: stable vs unstable, synchronised cardioversion",
                "r": [
                  "RCUK",
                  "ERC guidelines"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/anaesthesia/rapid-sequence-induction"
              },
              {
                "t": "AF, atrial flutter, SVT, VT — recognition and management",
                "r": [
                  "RCUK",
                  "ERC guidelines"
                ],
                "a": null
              },
              {
                "t": "Electrolyte management in arrest: K+, Ca2+, Mg2+",
                "r": [
                  "RCUK",
                  "ERC guidelines"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "pacd-resus",
            "name": "Paediatric & Neonatal Resuscitation",
            "icon": "child",
            "refs": [
              "RCUK",
              "APLS",
              "NLS"
            ],
            "sub": [
              {
                "t": "Paediatric cardiac arrest: causes (asphyxial), IO access, drug doses (weight-based)",
                "r": [
                  "RCUK",
                  "APLS",
                  "NLS"
                ],
                "a": null
              },
              {
                "t": "Neonatal resuscitation: NLS algorithm, APGAR, cord clamping, thermoregulation",
                "r": [
                  "RCUK",
                  "APLS",
                  "NLS"
                ],
                "a": null
              },
              {
                "t": "Transitional circulation implications",
                "r": [
                  "RCUK",
                  "APLS",
                  "NLS"
                ],
                "a": null
              },
              {
                "t": "Meconium aspiration management update",
                "r": [
                  "RCUK",
                  "APLS",
                  "NLS"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "trauma-resus",
        "name": "Trauma & Emergency Care",
        "topics": [
          {
            "id": "major-trauma",
            "name": "Major Trauma & ATLS",
            "icon": "ambulance",
            "refs": [
              "ATLS",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "ATLS primary & secondary survey",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/atls-primary-survey/"
              },
              {
                "t": "C-spine immobilisation & clearance (NEXUS, Canadian C-spine rules)",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/clearance"
              },
              {
                "t": "Haemorrhagic shock: classes, massive transfusion protocol, REBOA",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/massive-transfusion-protocol/"
              },
              {
                "t": "Chest trauma: tension pneumothorax, haemothorax, flail chest, cardiac tamponade",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Abdominal trauma: FAST scan, DPL, CT",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Pelvic trauma: binder, retroperitoneal haemorrhage, preperitoneal packing",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Traumatic brain injury: ICP monitoring, management, neuroprotection",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Spinal cord injury: steroids controversy, MAP goals, timing of surgery",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": "https://teachmeanatomy.info/back/nerves/spinal-cord/"
              },
              {
                "t": "Burns: assessment (Wallace rule of 9s, Lund & Browder), Parkland formula, inhalational injury",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Trauma in pregnancy: perimortem C-section",
                "r": [
                  "ATLS",
                  "RCoA G4"
                ],
                "a": "https://litfl.com/perimortem-caesarean-section/"
              }
            ]
          },
          {
            "id": "prehospital",
            "name": "Prehospital Care & Transfer",
            "icon": "ambulance",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Prehospital trauma triage & MIST handover",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Scoop and run vs stay and play",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Critical care transfer: primary vs secondary, equipment, monitoring, documentation",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Intrahospital transport: ventilated patient, monitoring standards, risk assessment",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              },
              {
                "t": "Crew resource management in prehospital setting",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "toxicology",
            "name": "Toxicology & Poisons",
            "icon": "ambulance",
            "refs": [
              "MM Ch.32",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Approach to poisoned patient: toxidromes (anticholinergic, cholinergic, opioid, sympathomimetic)",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Paracetamol overdose: NAC protocol, nomogram",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/pharmacology/paracetamol"
              },
              {
                "t": "Opioid overdose: naloxone, methadone, buprenorphine partial reversal",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Metabolic poisonings: methanol, ethylene glycol (fomepizole, ethanol)",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Serotonin syndrome & neuroleptic malignant syndrome",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Cyanide poisoning: hydroxocobalamin, sodium thiosulfate",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Organophosphate poisoning: atropine, pralidoxime (2-PAM)",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Carbon monoxide poisoning: hyperbaric oxygen indications",
                "r": [
                  "MM Ch.32",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "environmental",
            "name": "Environmental Emergencies",
            "icon": "zap",
            "refs": [
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Malignant hyperthermia: trigger agents, dantrolene, management protocol",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://www.mhaus.org/protocols/"
              },
              {
                "t": "Anaphylaxis: diagnosis, management (AIR algorithm), tryptase, allergy testing referral",
                "r": [
                  "RCoA G4"
                ],
                "a": "https://litfl.com/anaphylaxis/"
              },
              {
                "t": "Drowning: pathophysiology, management, ECMO role",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Hypothermia & hyperthermia: passive vs active rewarming",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Electrical injuries & lightning strike",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Radiation injury & decontamination",
                "r": [
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "ethics-law-safeguarding",
    "name": "Ethics, Law & Safeguarding",
    "icon": "scale",
    "color": "#78716c",
    "sections": [
      {
        "id": "ethics",
        "name": "Ethical Principles",
        "topics": [
          {
            "id": "ethics-principles",
            "name": "Core Ethical Principles",
            "icon": "scale",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Autonomy, beneficence, non-maleficence, justice",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Four quadrant approach to ethical dilemmas",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Informed consent: Montgomery vs Bolam",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Confidentiality: GMC guidance, exceptions, GDPR",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Truth-telling & disclosure of errors",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Resource allocation & distributive justice",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Research ethics: Helsinki Declaration, REC, vulnerable populations",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "end-of-life",
            "name": "End-of-Life Ethics",
            "icon": "scale",
            "refs": [
              "RCoA G1",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Withdrawal of life-sustaining treatment",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "DNACPR: discussion, documentation (ReSPECT), legal framework",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Advance decisions to refuse treatment (ADRT)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Lasting power of attorney (health & welfare)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": "https://www.nysora.com/topics/safety/patient-safety/local-anesthetic-systemic-toxicity/"
              },
              {
                "t": "Euthanasia & assisted dying: legal position, professional guidance",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Futility: definition, assessment, communication",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Palliative care: symptom management, end-of-life care pathways",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "safeguarding",
        "name": "Safeguarding",
        "topics": [
          {
            "id": "adult-safeguarding",
            "name": "Safeguarding Vulnerable Adults",
            "icon": "scale",
            "refs": [
              "RCoA G1",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Categories of abuse: physical, emotional, financial, sexual, neglect, self-neglect",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/haematology/viscoelastic-testing"
              },
              {
                "t": "Mental Capacity Act 2005: 5 principles, capacity assessment",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Best interests decision-making & checklist",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Deprivation of Liberty Safeguards (DoLS) & Liberty Protection Safeguards (LPS)",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": "https://derangedphysiology.com/main/required-reading/respiratory/ards"
              },
              {
                "t": "Safeguarding Adults Board, local procedures, reporting",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Domestic violence & mandatory reporting",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Modern slavery: identification, NRM referral",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "child-safeguarding",
            "name": "Safeguarding Children",
            "icon": "child",
            "refs": [
              "RCoA G1",
              "RCoA G4",
              "Working Together"
            ],
            "sub": [
              {
                "t": "Types of abuse: physical, emotional, sexual, neglect",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              },
              {
                "t": "Non-accidental injury: patterns, investigations, documentation",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              },
              {
                "t": "Gillick competence & Fraser guidelines",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              },
              {
                "t": "Child protection: LADO, MASH, child protection conferences",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              },
              {
                "t": "Female genital mutilation (FGM): duty to report",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              },
              {
                "t": "Prevent duty: radicalisation, Channel programme",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              },
              {
                "t": "Safeguarding in foster care, residential care, youth offenders",
                "r": [
                  "RCoA G1",
                  "RCoA G4",
                  "Working Together"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "vulnerable-groups",
            "name": "Vulnerable Groups & Informed Consent",
            "icon": "scale",
            "refs": [
              "RCoA G1",
              "RCoA G4"
            ],
            "sub": [
              {
                "t": "Prisoners & detention: ethical considerations",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Looked-after children: consent, Independent Reviewing Officer",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Adults with learning disability: reasonable adjustments",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Consent for minors: age 16-17, parental responsibility hierarchy",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              },
              {
                "t": "Emergency treatment for incapacitated adults",
                "r": [
                  "RCoA G1",
                  "RCoA G4"
                ],
                "a": null
              }
            ]
          }
        ]
      },
      {
        "id": "legal-framework",
        "name": "Legal Framework",
        "topics": [
          {
            "id": "legal-medical",
            "name": "Medical Law",
            "icon": "scale",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Clinical negligence vs criminal law",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Causation: Bolam test, Bolitho gloss, Montgomery test for consent",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Duty of care, breach, causation, damage",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Whistleblowing: Freedom to Speak Up, Public Interest Disclosure Act",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Criminal law: gross negligence manslaughter, corporate manslaughter",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "GMC fitness to practise: MPTS, undertakings, sanctions",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Mental Health Act 1983: sections 2, 3, 4, 5(2), 136 — anaesthetic implications",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "coroner",
            "name": "Coroner's Court & Death Certification",
            "icon": "scale",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Medical Certificate of Cause of Death (MCCD): completion, cremation forms",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Referral to coroner: legal duty, reportable deaths",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Coroner's inquest: purpose, process, Article 2 inquests",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Death in custody & state obligation",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Organ donation: Human Tissue Act 2004, opt-out system (England 2020)",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          },
          {
            "id": "data-equality",
            "name": "Data Protection & Equality",
            "icon": "clipboard",
            "refs": [
              "RCoA G1"
            ],
            "sub": [
              {
                "t": "Data Protection Act 2018 & UK GDPR: principles, lawful basis, rights",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Information sharing: Caldicott principles, information governance",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Equality Act 2010: protected characteristics, reasonable adjustments, discrimination",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Access to Health Records Act",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              },
              {
                "t": "Freedom of Information Act 2000",
                "r": [
                  "RCoA G1"
                ],
                "a": null
              }
            ]
          }
        ]
      }
    ]
  }
];

if (typeof window !== "undefined") {
  window.CURRICULUM = CURRICULUM;
  window.REF_SOURCES = REF_SOURCES;
  window.CHAPTER_TITLES = CHAPTER_TITLES;
  window.ARTICLE_MAP = ARTICLE_MAP;
  window.TRUSTED_EXACT = TRUSTED_EXACT;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CURRICULUM;
}
