// Anestheticks — Comprehensive Anesthesia Curriculum Database
// Target: EDAIC / FRCA
// References legend:
//   MM = Morgan & Mikhail's Clinical Anesthesiology (6th ed)
//   MIL = Miller's Anesthesia (10th ed)
//   DD = Dorsch & Dorsch Understanding Anesthesia Equipment (5th ed)
//   OX = OpenAnesthesia (openanesthesia.org)
//   ATOTW = Anaesthesia Tutorial of the Week (WFSA/AnaesthesiaUK)
//   PS = PhysiologyWeb / Free open physiology texts
//   GS = GeeksforGeeks/NYSORA free regional resources
//   LITFL = Life in the Fast Lane (education)

const CURRICULUM = [
{
  id: "equipment",
  name: "Anesthetic Equipment & Monitoring",
  icon: "gauge",
  color: "#3b82f6",
  sections: [
    {
      id: "workstation",
      name: "The Anesthesia Workstation",
      topics: [
        {
          id: "machine-overview",
          name: "Workstation overview & standards",
          refs: ["MM Ch.4", "MIL Ch.25", "DD Ch.1-4"],
          sub: [
            "ASTM / ISO 80601-2-13 standard",
            "Components: high/intermediate/low pressure systems",
            "Pre-use checklist (ASA 2008)",
            "Newer workstation self-tests & limitations",
            "Data streams & integration"
          ]
        },
        {
          id: "gas-supply",
          name: "Medical gas supply",
          refs: ["MM Ch.4", "DD Ch.1-2", "MIL Ch.25"],
          sub: [
            "Central pipeline supply (color coding, DISS, NIST)",
            "Cylinder construction & marking",
            "Pin index safety system (PISS)",
            "Hanger yoke & check valves",
            "Pressure regulation & regulators",
            "Oxygen supply failure devices (fail-safe, proportioning)",
            "O2 failure alarm"
          ]
        },
        {
          id: "flowmeters",
          name: "Flowmeters & flow control",
          refs: ["DD Ch.5", "MM Ch.4"],
          sub: [
            "Variable-orifice (rotameter) physics",
            "Turbulent vs laminar flow (Hagen-Poiseuille)",
            "Sequence of flowmeter arrangement",
            "Problems: sticking bobbin, static, leaks"
          ]
        },
        {
          id: "vaporizers",
          name: "Vaporizers",
          refs: ["DD Ch.7-8", "MM Ch.4", "MIL Ch.26"],
          sub: [
            "Physics of vaporization (latent heat, vapor pressure)",
            "Variable bypass / plenum vaporizers",
            "Temperature compensation (bimetallic strip)",
            "Vaporizer interlock mechanism",
            "Measured flow vaporizer (Desflurane Tec 6)",
            "Vaporizer-in-circuit (VIC) draw-over",
            "Effects of altitude & flow on output",
            "Tipping / overfilling hazards"
          ]
        },
        {
          id: " scavenging",
          name: "Scavenging systems",
          refs: ["DD Ch.18", "MM Ch.4"],
          sub: [
            "Purpose & occupational exposure limits",
            "Components: collecting, transferring, receiving, disposal",
            "Open vs closed scavenging interface",
            "Pressure relief (positive & negative)",
            "Room ventilation requirements"
          ]
        },
        {
          id: "machine-checks",
          name: "Machine checkout & safety",
          refs: ["MM Ch.4", "ASA 2008 checkout"],
          sub: [
            "High-pressure system leak test",
            "Low-pressure system leak test",
            "Circle system leak test",
            "Ventilator & alarm checks",
            "Common gas outlet verification"
          ]
        }
      ]
    },
    {
      id: "breathing-systems",
      name: "Breathing Systems",
      topics: [
        {
          id: "circle",
          name: "Circle system",
          refs: ["DD Ch.13", "MM Ch.4"],
          sub: [
            "Components: unidirectional valves, CO2 absorber, reservoir bag",
            "Fresh gas decoupling",
            "Advantages & disadvantages",
            "Soda lime & absorbents (Amsorb, lithium hydroxide)",
            "CO absorption compounds & degradation products (compound A, carbon monoxide)",
            "Malfunction of unidirectional valves"
          ]
        },
        {
          id: "mapleson",
          name: "Mapleson circuits (A-F)",
          refs: ["DD Ch.12", "MM Ch.4", "ATOTW"],
          sub: [
            "Mapleson A (Magill) — spontaneous",
            "Mapleson D, E, F — controlled ventilation",
            "Fresh gas flow requirements",
            "Bain circuit (coaxial Mapleson D)",
            "Lack & Humphrey circuits"
          ]
        },
        {
          id: "drawover",
          name: "Draw-over & emergency systems",
          refs: ["MIL Ch.27", "MM Ch.4"],
          sub: [
            "Draw-over vaporizer principles",
            "Epstein Mackintosh Oxford (EMO)",
            "Pneupac / transport ventilators",
            "Gloved bag / WHO emergency setups"
          ]
        }
      ]
    },
    {
      id: "ventilators",
      name: "Ventilators",
      topics: [
        {
          id: "vent-classification",
          name: "Classification & physics",
          refs: ["DD Ch.14", "MM Ch.4"],
          sub: [
            "Power source, drive mechanism, cycling",
            "Bellows: ascending vs descending",
            "Pressure vs volume control",
            "Tidal volume compensation (compressible volume)",
            "Leaks in descending bellows (hidden)"
          ]
        },
        {
          id: "advanced-vents",
          name: "Advanced modes & ICU ventilators",
          refs: ["MIL Ch.103", "MM Ch.4"],
          sub: [
            "Pressure support, SIMV, PCV, VCV",
            "PRVC, APV, auto-flow",
            "Non-invasive ventilation interfaces",
            "High-flow nasal cannula principles"
          ]
        }
      ]
    },
    {
      id: "airway-equip",
      name: "Airway Equipment",
      topics: [
        {
          id: "masks-supraglottic",
          name: "Masks & supraglottic airways",
          refs: ["DD Ch.21", "MM Ch.19", "MIL Ch.54"],
          sub: [
            "Face mask design & sizing",
            "LMA Classic / ProSeal / Supreme / Flexible",
            "i-gel, Air-Q, Ambu AuraGain",
            "Insertion technique & cuff pressure",
            "Indications, contraindications, complications"
          ]
        },
        {
          id: "eett",
          name: "Endotracheal tubes & tracheostomy",
          refs: ["DD Ch.22", "MM Ch.19"],
          sub: [
            "ETT construction (PVC, spiral wire, silicone)",
            "Murphy eye, Cole tube, RAE tubes",
            "Double-lumen & bronchial blockers",
            "Cuff design (high vs low pressure), cuff pressure monitoring",
            "Tube exchange catheters",
            "Tracheostomy tube types (Shiley, Portex)"
          ]
        },
        {
          id: "laryngoscopes",
          name: "Laryngoscopes & videolaryngoscopy",
          refs: ["DD Ch.23", "MM Ch.19", "MIL Ch.55"],
          sub: [
            "Macintosh & Miller blades",
            "Direct laryngoscopy technique",
            "Video laryngoscopes: GlideScope, C-MAC, McGrath, AirTraq",
            "Hyperangulated vs standard blades",
            "Rigid fiberoptic (Bullard, Upsherscope)",
            "Channelled vs non-channelled devices"
          ]
        },
        {
          id: "fiberoptic",
          name: "Flexible fiberoptic & awake intubation",
          refs: ["MM Ch.19", "MIL Ch.55"],
          sub: [
            "Fiberscope construction",
            "Indications for awake FOB intubation",
            "Topicalization techniques & nerve blocks",
            "Antisialogogue use",
            "Troubleshooting & failure rescue"
          ]
        },
        {
          id: "emergency-airway",
          name: "Emergency airway devices",
          refs: ["MM Ch.19", "DD Ch.24"],
          sub: [
            "LMA as rescue / FOB conduit",
            "Intubating LMA (Fastrach)",
            "Esophageal-tracheal Combitube",
            "Laryngeal tube (LT)",
            "Cricothyrotomy kits (Melker, QuickTrach)",
            "Cannot intubate cannot oxygenate (CICO) algorithm"
          ]
        },
        {
          id: "humidification",
          name: "Humidification & filters",
          refs: ["DD Ch.15", "MM Ch.4"],
          sub: [
            "Heat and moisture exchangers (HME)",
            "Heated humidifiers",
            "Bacterial/viral filters",
            "Ideal properties"
          ]
        }
      ]
    },
    {
      id: "monitoring",
      name: "Monitoring",
      topics: [
        {
          id: "monitor-standards",
          name: "Standards & basic monitoring",
          refs: ["MM Ch.5", "ASA standards", "MIL Ch.47"],
          sub: [
            "ASA standards for basic monitoring",
            "Continuous presence vs electronic",
            "Alarms & prioritization",
            "Capnography as mandatory",
            "Vigilance & situational awareness"
          ]
        },
        {
          id: "bp-monitoring",
          name: "Blood pressure monitoring",
          refs: ["MM Ch.5", "MIL Ch.47"],
          sub: [
            "Non-invasive: oscillometry (DINAMAP)",
            "Cuff sizing errors",
            "Arterial line: insertion, waveform, damping & resonance",
            "Allen test & complications",
            "Square wave test interpretation",
            "Mean arterial pressure calculation"
          ]
        },
        {
          id: "ecg",
          name: "Electrocardiography",
          refs: ["MM Ch.5", "MIL Ch.48"],
          sub: [
            "Lead systems (3, 5, 12 lead)",
            "Waveform analysis & intervals",
            "Arrhythmia recognition",
            "Ischemia detection (lead V5, II)",
            "Pacemaker spikes"
          ]
        },
        {
          id: "pulse-ox",
          name: "Pulse oximetry",
          refs: ["MM Ch.5", "MIL Ch.49"],
          sub: [
            "Beer-Lambert law & red/IR absorption",
            "Oxy- & deoxyhemoglobin spectra",
            "Functional vs fractional saturation",
            "Causes of error: dyshemoglobins (COHb, MetHb), nail polish, motion, low perfusion",
            "Masimo SET & signal extraction",
            "Plethysmographic variability index (PVI)"
          ]
        },
        {
          id: "capnography",
          name: "Capnography & gas analysis",
          refs: ["MM Ch.5", "MIL Ch.50", "DD Ch.16"],
          sub: [
            "Infrared absorption spectroscopy",
            "Mainstream vs sidestream",
            "Normal capnogram phases",
            "Causes of altered EtCO2 (high, low, absent, rising)",
            "Agents analysis (Raman, mass spec, photoacoustic)",
            "V/Q relationships & PaCO2-EtCO2 gradient"
          ]
        },
        {
          id: "cvp-pa",
          name: "Central venous & pulmonary artery catheters",
          refs: ["MM Ch.5", "MIL Ch.51"],
          sub: [
            "CVC insertion sites & Seldinger technique",
            "CVP waveform (a, c, v, x, y)",
            "Complications (pneumothorax, arterial puncture, infection)",
            "PA catheter: insertion, pressures, wedge",
            "Derived parameters (CO, SVR, PVR, oxygen delivery)",
            "Indications & controversy (ESCAPE trial)",
            "Ultrasound guidance"
          ]
        },
        {
          id: "cardiac-output",
          name: "Cardiac output monitoring",
          refs: ["MM Ch.5", "MIL Ch.52"],
          sub: [
            "Thermodilution (bolus & continuous)",
            "Fick principle",
            "Arterial pulse contour (PiCCO, LiDCO, FloTrac/Vigileo)",
            "Esophageal Doppler",
            "Transesophageal echo (basic)",
            "Bioimpedance & bioreactance"
          ]
        },
        {
          id: "eeg-bis",
          name: "Neurologic monitoring",
          refs: ["MM Ch.5", "MIL Ch.53"],
          sub: [
            "BIS & entropy monitors",
            "Processed vs raw EEG",
            "Evoked potentials (SSEP, MEP, BAEP)",
            "Cerebral oximetry (NIRS, rSO2)",
            "Limitations of depth monitors"
          ]
        },
        {
          id: "neuromuscular",
          name: "Neuromuscular monitoring",
          refs: ["MM Ch.5", "MIL Ch.53"],
          sub: [
            "Modes: TOF, double-burst, tetanus, post-tetanic count",
            "Sites: ulnar, facial, posterior tibial",
            "Acceleromyography vs mechanomyography",
            "Reversal criteria (TOF ratio ≥0.9)"
          ]
        },
        {
          id: "temp-glucose",
          name: "Temperature, glucose & point of care",
          refs: ["MM Ch.5", "MIL Ch.47"],
          sub: [
            "Thermistor/thermocouple sites",
            "Core vs peripheral temperature",
            "Glucose measurement & perioperative",
            "ABG, lactate, hemoglobin point-of-care",
            "Thromboelastography (TEG/ROTEM)"
          ]
        },
        {
          id: "ultrasound",
          name: "Ultrasound basics",
          refs: ["MM Ch.5", "MIL Ch.56"],
          sub: [
            "Piezoelectric effect & frequency/depth tradeoff",
            "Modes: B, M, Doppler",
            "Probes: linear, curvilinear, phased array",
          ]
        }
      ]
    },
    {
      id: "electrical-safety",
      name: "Electrical & Environmental Safety",
      topics: [
        {
          id: "electrical",
          name: "Electrical safety",
          refs: ["DD Ch.19", "MM Ch.4"],
          sub: [
            "Macroshock & microshock",
            "Line isolation monitors & isolated power",
            "Ground fault circuit interrupters",
            "Leakage current",
            "Equipotential grounding in OR"
          ]
        },
        {
          id: "fires",
          name: "OR fires & environmental",
          refs: ["MM Ch.4", "ASA fire algorithm"],
          sub: [
            "Fire triad: oxidizer, fuel, ignition",
            "Laser & electrosurgery plume",
            "Bowel prep & methane explosion risk",
            "Fire risk assessment score",
            "Waste anesthetic gas exposure limits"
          ]
        }
      ]
    }
  ]
},
{
  id: "pharmacology",
  name: "Pharmacology",
  icon: "flask",
  color: "#10b981",
  sections: [
    {
      id: "pkpd",
      name: "Pharmacokinetics & Pharmacodynamics",
      topics: [
        {
          id: "pk",
          name: "Pharmacokinetics",
          refs: ["MM Ch.7", "MIL Ch.30"],
          sub: [
            "Compartments & distribution",
            "Volume of distribution",
            "Clearance & elimination",
            "First-order vs zero-order kinetics",
            "Half-life, context-sensitive half-time",
            "Bioavailability & first-pass metabolism",
            "Protein binding & factors affecting",
            "Multi-compartment models",
            "Effect-site concentration (ke0)"
          ]
        },
        {
          id: "pd",
          name: "Pharmacodynamics",
          refs: ["MM Ch.7", "MIL Ch.30"],
          sub: [
            "Dose-response curves (Emax, EC50, slope)",
            "Agonists, antagonists, partial agonists",
            "Receptor types & signal transduction",
            "Therapeutic index & margin of safety",
            "Tachyphylaxis & tolerance",
            "Synergism, additivity, antagonism (isobologram)"
          ]
        },
        {
          id: "uptake-distribution",
          name: "Uptake & distribution of inhaled agents",
          refs: ["MM Ch.8", "MIL Ch.31"],
          sub: [
            "Solubility (blood/gas partition coefficient)",
            "Cardiac output effects",
            "Alveolar-venous partial pressure difference",
            "Concentration effect & second gas effect",
            "Overpressurization",
            "Effect of minute ventilation"
          ]
        },
        {
          id: "genetics",
          name: "Pharmacogenetics & variability",
          refs: ["MIL Ch.30", "MM Ch.7"],
          sub: [
            "Pseudocholinesterase variants",
            "CYP variants & metabolism",
            "Malignant hyperthermia susceptibility",
            "Pain receptor polymorphisms"
          ]
        }
      ]
    },
    {
      id: "inhalational",
      name: "Inhalational Anesthetics",
      topics: [
        {
          id: "inh-properties",
          name: "Properties of inhaled agents",
          refs: ["MM Ch.8", "MIL Ch.31"],
          sub: [
            "MAC concept & factors affecting MAC",
            "Meyer-Overton hypothesis",
            "Vapor pressure & boiling points",
            "Halogenation & stability",
            "Greenhouse & ozone effects"
          ]
        },
        {
          id: "sevo",
          name: "Sevoflurane",
          refs: ["MM Ch.8", "MIL Ch.31"],
          sub: [
            "Properties & metabolism (CYP2E1)",
            "Compound A formation",
            "Renal effects debate",
            "Slow washout vs desflurane",
            "Use in inhalational induction"
          ]
        },
        {
          id: "iso-des-nt",
          name: "Isoflurane, Desflurane, Nitrous oxide",
          refs: ["MM Ch.8", "MIL Ch.31"],
          sub: [
            "Isoflurane: vasodilation, pungency",
            "Desflurane: airway irritation, Tec 6 vaporizer, sympathetic surge",
            "N2O: diffusion hypoxia, expansion of gas spaces, B12/methionine synthase, PONV, teratogenicity"
          ]
        },
        {
          id: "inha-physics",
          name: "Pharmacology of inhaled agents",
          refs: ["MM Ch.7", "MIL Ch.27", "OX"],
          sub: [
            "Minimum alveolar concentration (MAC) & factors affecting",
            "Solubility (blood/gas, oil/gas) — onset/offset",
            "Second gas effect & concentration effect",
            "Distribution: vessel-rich group vs vessel-poor",
            "Metabolism & toxicity (halothane hepatitis, compound A)",
            "Effects on CMR, CBF, ICP, cerebral autoregulation",
            "Effects on bronchial tone, hypoxic pulmonary vasoconstriction"
          ]
        }
      ]
    },
    {
      id: "iv-anesthetics",
      name: "Intravenous Anesthetics",
      topics: [
        {
          id: "propofol",
          name: "Propofol",
          refs: ["MM Ch.9", "MIL Ch.30"],
          sub: [
            "Pharmacokinetics (high clearance, redistribution)",
            "Pharmacodynamics (GABA-A)",
            "Effect on BP, CO, SVR, ventilation",
            "Pain on injection, lipid formulation",
            "Propofol infusion syndrome (PRIS)",
            "Target controlled infusion (TCI) models (Marsh, Schnider, Eleveld)"
          ]
        },
        {
          id: "thiopental-etomidate",
          name: "Thiopental & Etomidate",
          refs: ["MM Ch.9", "MIL Ch.30"],
          sub: [
            "Thiopental: pharmacokinetics, status epilepticus, porphyria contraindication",
            "Etomidate: adrenal suppression, hemodynamic stability, myoclonus, pain",
            "Induction doses & contexts"
          ]
        },
        {
          id: "ketamine-benzodiazepines",
          name: "Ketamine & Benzodiazepines",
          refs: ["MM Ch.9", "MIL Ch.30"],
          sub: [
            "Ketamine: NMDA antagonism, dissociative anesthesia, bronchodilation, sympathetic stimulation, emergence phenomena, catecholamine depletion risk",
            "Midazolam vs diazepam vs lorazepam pharmacokinetics",
            "Flumazenil reversal & risks"
          ]
        },
        {
          id: "dexmedetomidine",
          name: "Dexmedetomidine & alpha-2 agonists",
          refs: ["MM Ch.9", "MIL Ch.30"],
          sub: [
            "Alpha-2 selectivity",
            "Cooperative sedation, analgesia, no respiratory depression",
            "Hemodynamic effects (biphasic BP)",
            "Uses in extubation, awake intubation, delirium"
          ]
        },
        {
          id: "droperidol-haloperidol",
          name: "Butyrophenones & adjuncts",
          refs: ["MM Ch.9"],
          sub: [
            "Droperidol: dopamine antagonist, QT prolongation, PONV dosing & black box warning debate",
            "Haloperidol for delirium"
          ]
        }
      ]
    },
    {
      id: "opioids",
      name: "Opioids & Analgesics",
      topics: [
        {
          id: "opioid-pharm",
          name: "Opioid pharmacology",
          refs: ["MM Ch.10", "MIL Ch.31"],
          sub: [
            "Receptors (mu, kappa, delta, ORL-1) & signaling",
            "Equianalgesic dosing & conversion",
            "Pharmacokinetics of morphine, fentanyl, sufentanil, alfentanil, remifentanil",
            "Remifentanil: ester hydrolysis, context-insensitive half-time",
            "Methadone: NMDA action, long half-life",
            "Tramadol & tapentadol mechanisms"
          ]
        },
        {
          id: "opioid-effects",
          name: "Opioid effects & toxicity",
          refs: ["MM Ch.10", "MIL Ch.31"],
          sub: [
            "Respiratory depression kinetics",
            "Tolerance, hyperalgesia, dependence",
            "Naloxone & naltrexone",
            "Opioid-induced constipation & mu antagonists (methylnaltrexone)",
            "Rapid opioid tolerance",
            "Serotonin syndrome risk (tramadol, meperidine, fentanyl)"
          ]
        },
        {
          id: "nonopioid",
          name: "Non-opioid analgesics",
          refs: ["MM Ch.10"],
          sub: [
            "Acetaminophen mechanism & dosing",
            "NSAIDs (COX-1/2 selectivity, ketorolac, parecoxib)",
            "Gabapentinoids (gabapentin, pregabalin)",
            "Ketamine (low dose), lidocaine infusion, dexmedetomidine",
            "Magnesium, alpha-2 agonists as adjuncts"
          ]
        }
      ]
    },
    {
      id: "nmbs",
      name: "Neuromuscular Blocking Agents",
      topics: [
        {
          id: "depolarizing",
          name: "Succinylcholine",
          refs: ["MM Ch.11", "MIL Ch.32"],
          sub: [
            "Mechanism: depolarizing phase I block",
            "Pharmacokinetics (plasma cholinesterase)",
            "Hyperkalemia (burns, denervation, immobilization)",
            "Malignant hyperthermia trigger",
            "Phase II block",
            "Pseudocholinesterase deficiency (genetics, dibucaine number)",
            "Bradycardia, myalgia, increased ICP/IOP/Intragastric pressure"
          ]
        },
        {
          id: "nondep",
          name: "Nondepolarizing NMBAs",
          refs: ["MM Ch.11", "MIL Ch.32"],
          sub: [
            "Benzylisoquinoliniums (atracurium, cisatracurium, mivacurium, doxacurium)",
            "Aminosteroids (rocuronium, vecuronium, pancuronium)",
            "Hofmann elimination & Laudanosine",
            "Histamine release (atracurium, mivacurium)",
            "Vagolytic & sympathomimetic (pancuronium)",
            "Onset/duration comparison & dosing"
          ]
        },
        {
          id: "reversal",
          name: "Reversal agents",
          refs: ["MM Ch.11", "MIL Ch.33"],
          sub: [
            "Acetylcholinesterase inhibitors (neostigmine, edrophonium)",
            "Muscarinic co-administration (glycopyrrolate, atropine)",
            "Sugammadex: encapsulation, dosing, contraindications, allergic reactions",
            "Comparison of reversal strategies",
            "Residual blockade detection"
          ]
        }
      ]
    },
    {
      id: "local-anesthetics",
      name: "Local Anesthetics",
      topics: [
        {
          id: "la-pharm",
          name: "LA pharmacology",
          refs: ["MM Ch.16", "MIL Ch.34"],
          sub: [
            "Structure: lipophilic aromatic + intermediate chain + hydrophilic amine",
            "Amide vs ester metabolism",
            "pKa, ionization, onset, lipid solubility & potency, protein binding",
            "Differential block (small fibers first)",
            "pH and effect of additives",
            "Pregnancy effects on LA"
          ]
        },
        {
          id: "la-toxicity",
          name: "Local anesthetic systemic toxicity (LAST)",
          refs: ["MM Ch.16", "ASRA guidelines", "MIL Ch.34"],
          sub: [
            "CNS toxicity: circumoral, tinnitus, seizures",
            "Cardiac toxicity (more with bupivacaine)",
            "Bupivacaine cardiotoxicity mechanism",
            "Lipid emulsion therapy protocol (20%)",
            "Prevention: test dose, incremental dosing, aspiration",
            "Treatment algorithm (ASRA)"
          ]
        },
        {
          id: "la-additives",
          name: "Additives & formulations",
          refs: ["MM Ch.16"],
          sub: [
            "Epinephrine (vasoconstriction, test dose, duration)",
            "Bicarbonate (speeds onset)",
            "Clonidine, dexmedetomidine, opioids",
            "Dextran for prolonged effect",
            "EMLA cream"
          ]
        },
        {
          id: "la-agents",
          name: "Specific agents & max doses",
          refs: ["MM Ch.16"],
          sub: [
            "Lidocaine, mepivacaine, bupivacaine, ropivacaine, levobupivacaine, prilocaine, chloroprocaine",
            "Maximum doses with/without epinephrine",
            "Methemoglobinemia (prilocaine, benzocaine)",
            "Plain vs hyperbaric formulations for spinal"
          ]
        }
      ]
    },
    {
      id: "cardiac-drugs",
      name: "Cardiovascular Drugs",
      topics: [
        {
          id: "vasopressors",
          name: "Vasopressors & inotropes",
          refs: ["MM Ch.14", "MIL Ch.35"],
          sub: [
            "Norepinephrine, epinephrine, phenylephrine, vasopressin",
            "Dopamine, dobutamine, milrinone",
            "Receptor profiles & clinical choice",
            "Dobutamine vs milrinone (PDE inhibitor)",
            "Vasopressin in vasodilatory shock"
          ]
        },
        {
          id: "antiarrhythmics",
          name: "Antiarrhythmics & antihypertensives",
          refs: ["MM Ch.14", "MM Ch.18"],
          sub: [
            "Vaughan-Williams classes",
            "Amiodarone, lidocaine, adenosine, beta-blockers, calcium channel blockers",
            "Esmolol, labetalol, metoprolol",
            "Nitroglycerin, nitroprusside, hydralazine",
            "ACE-I, ARBs, alpha-blockers"
          ]
        },
        {
          id: "anticoag-antiplatelet",
          name: "Anticoagulants & antiplatelets",
          refs: ["MM Ch.22"],
          sub: [
            "Heparin (UFH, LMWH) & protamine reversal",
            "Warfarin & vitamin K, FFP/PCC",
            "DOACs (dabigatran, rivaroxaban, apixaban) & reversal (idarucizumab, andexanet)",
            "Aspirin, clopidogrel, prasugrel, ticagrelor, GPIIb/IIIa",
            "Coagulation monitoring (aPTT, anti-Xa, viscoelastic)",
            "Neuraxial timing guidelines (ASRA)"
          ]
        }
      ]
    }
  ]
},
{
  id: "physiology",
  name: "Physiology for Anesthesia",
  icon: "activity",
  color: "#10b981",
  sections: [
    {
      id: "ans",
      name: "Autonomic Nervous System",
      topics: [
        {
          id: "ans-overview",
          name: "ANS pharmacology & physiology",
          refs: ["MM Ch.13", "PS"],
          sub: [
            "Sympathetic vs parasympathetic anatomy",
            "Neurotransmitters & receptors",
            "Adrenergic receptor distribution & effects",
            "Baroreceptor reflex",
            "Direct vs reflex effects of drugs"
          ]
        }
      ]
    },
    {
      id: "cardio",
      name: "Cardiovascular Physiology",
      topics: [
        {
          id: "hemodynamics",
          name: "Hemodynamics",
          refs: ["MM Ch.20", "PS"],
          sub: [
            "Cardiac cycle & pressure-volume loops",
            "Preload, afterload, contractility (Frank-Starling)",
            "Laplace's law & wall stress",
            "Determinants of myocardial oxygen supply/demand",
            "Coronary perfusion & autoregulation",
            "Compliance & elastance"
          ]
        },
        {
          id: "conduction",
          name: "Electrophysiology & conduction",
          refs: ["MM Ch.20", "PS"],
          sub: [
            "Action potentials (nodal vs ventricular)",
            "Pacemaker & conduction system",
            "Refractory periods",
            "Effect of anesthetics on conduction",
            "Mechanisms of arrhythmia"
          ]
        },
        {
          id: "cv-regulation",
          name: "Regulation of circulation",
          refs: ["MM Ch.20", "PS"],
          sub: [
            "Autonomic control of BP",
            "Renin-angiotensin-aldosterone",
            "Vasopressin",
            "Local metabolic control",
            "Effects of ventilation & intrathoracic pressure"
          ]
        },
        {
          id: "shock-physio",
          name: "Shock states & oxygen delivery",
          refs: ["MM Ch.20", "MM Ch.57"],
          sub: [
            "DO2 = CO x CaO2; VO2 & extraction",
            "Hypovolemic, cardiogenic, distributive, obstructive",
            "Compensated vs decompensated",
            "Lactate & base excess"
          ]
        }
      ]
    },
    {
      id: "resp",
      name: "Respiratory Physiology",
      topics: [
        {
          id: "mechanics",
          name: "Lung mechanics & ventilation",
          refs: ["MM Ch.21", "PS"],
          sub: [
            "Compliance & elastance, hysteresis",
            "Surfactant & Laplace's law",
            "Airway resistance, laminar vs turbulent",
            "Work of breathing components",
            "Lung volumes & capacities (definitions)",
            "Closing capacity & aging",
            "Flow-volume loops"
          ]
        },
        {
          id: "gas-exchange",
          name: "Gas exchange & diffusion",
          refs: ["MM Ch.21", "PS"],
          sub: [
            "V/Q relationships & shunt equation",
            "Oxygen cascade & alveolar gas equation",
            "PAO2 = FiO2(Patm-PH2O) - PaCO2/R",
            "Diffusion capacity & Fick law",
            "A-a gradient causes",
            "Hypoxic pulmonary vasoconstriction"
          ]
        },
        {
          id: "oxygen-co2",
          name: "Oxygen & CO2 transport",
          refs: ["MM Ch.21", "PS"],
          sub: [
            "Hemoglobin dissociation curve & P50",
            "Bohr & Haldane effects",
            "2,3-DPG, pH, temperature shifts",
            "CO2 transport (bicarbonate, carbamino, dissolved)",
            "Henderson-Hasselbalch",
            "CO2 stores & apneic diffusion"
          ]
        },
        {
          id: "control-vent",
          name: "Control of ventilation",
          refs: ["MM Ch.21", "PS"],
          sub: [
            "Central & peripheral chemoreceptors",
            "Effect of anesthetics on ventilatory drive",
            "Hypoxic ventilatory response",
            "Apneic threshold & CO2 response curve",
            "Sleep-disordered breathing"
          ]
        },
        {
          id: "anesthesia-resp",
          name: "Effects of anesthesia on respiration",
          refs: ["MM Ch.21"],
          sub: [
            "Reduced FRC, atelectasis, V/Q mismatch",
            "Reduced hypoxic pulmonary vasoconstriction",
            "Apnea, altered CO2 response",
            "Changes in dead space & compliance",
            "Positioning & cephalad diaphragm shift"
          ]
        }
      ]
    },
    {
      id: "renal",
      name: "Renal Physiology",
      topics: [
        {
          id: "renal-hemodynamics",
          name: "Renal hemodynamics & GFR",
          refs: ["MM Ch.31", "PS"],
          sub: [
            "Autoregulation of RBF",
            "GFR determinants & clearance concepts",
            "Tubuloglomerular feedback",
            "Effects of anesthesia on RBF"
          ]
        },
        {
          id: "tubular",
          name: "Tubular function & handling",
          refs: ["MM Ch.31", "PS"],
          sub: [
            "Sodium, water, potassium handling",
            "Loop of Henle & countercurrent multiplier",
            "ADH/vasopressin & aquaporins",
            "RAAS & aldosterone",
            "Acid-base regulation by kidney"
          ]
        },
        {
          id: "renal-evaluation",
          name: "Perioperative renal evaluation",
          refs: ["MM Ch.31"],
          sub: [
            "BUN/Cr, eGFR, cystatin C",
            "Fractional excretion of sodium",
            "AKI biomarkers (NGAL, KIM-1)",
            "Contrast nephropathy & prevention",
            "Effects of drugs (NSAIDs, ACE-I)"
          ]
        }
      ]
    },
    {
      id: "hepatic",
      name: "Hepatic Physiology",
      topics: [
        {
          id: "liver-function",
          name: "Liver function & metabolism",
          refs: ["MM Ch.7", "PS"],
          sub: [
            "Hepatic blood flow (dual supply)",
            "Drug metabolism phases I/II",
            "Bilirubin metabolism",
            "Coagulation factor synthesis",
            "Protein synthesis & drug binding"
          ]
        },
        {
          id: "anesthesia-liver",
          name: "Anesthesia & liver disease",
          refs: ["MM Ch.7", "MM Ch.39"],
          sub: [
            "Effects on hepatic blood flow",
            "Child-Pugh & MELD scoring",
            "Altered pharmacokinetics in cirrhosis",
            "Hepatorenal syndrome",
            "Hepatic encephalopathy"
          ]
        }
      ]
    },
    {
      id: "endocrine",
      name: "Endocrine Physiology",
      topics: [
        {
          id: "dm",
          name: "Diabetes mellitus",
          refs: ["MM Ch.35"],
          sub: [
            "Type 1 vs type 2 pathophysiology",
            "Insulins (rapid, short, intermediate, long)",
            "DKA & HHS",
            "Perioperative insulin management & glucose targets",
            "Hypoglycemia recognition"
          ]
        },
        {
          id: "thyroid",
          name: "Thyroid & adrenal",
          refs: ["MM Ch.35"],
          sub: [
            "Thyroid storm & myxedema coma",
            "Hyperthyroid perioperative risks",
            "Adrenal insufficiency & steroid replacement",
            "Pheochromocytoma physiology & blockade",
            "Cushing & Addison"
          ]
        }
      ]
    },
    {
      id: "cns",
      name: "Neurophysiology",
      topics: [
        {
          id: "cbf-icp",
          name: "Cerebral blood flow & ICP",
          refs: ["MM Ch.26", "PS"],
          sub: [
            "CBF autoregulation (50-150 mmHg)",
            "PaCO2 & PaO2 effects on CBF",
            "Intracranial compliance & Monro-Kellie",
            "Cerebral metabolic rate & anesthetics",
            "Lund vs CPP-targeted therapy"
          ]
        },
        {
          id: "neuro-protection",
          name: "Neuroprotection & EEG",
          refs: ["MM Ch.26", "MIL Ch.81"],
          sub: [
            "EEG patterns & anesthetic depth",
            "Burst suppression",
            "Ischemic preconditioning",
            "Hypothermia",
            "Glucose control in neuro injury"
          ]
        }
      ]
    },
    {
      id: "acid-base",
      name: "Acid-Base & Electrolytes",
      topics: [
        {
          id: "acid-base",
          name: "Acid-base interpretation",
          refs: ["MM Ch.51", "MM Ch.52"],
          sub: [
            "Henderson-Hasselbalch",
            "Boston vs Stewart approach",
            "Anion gap & osmolar gap",
            "Strong ion difference",
            "Compensatory mechanisms & expected values",
            "Common perioperative derangements"
          ]
        },
        {
          id: "electrolytes",
          name: "Electrolyte disorders",
          refs: ["MM Ch.52"],
          sub: [
            "Sodium: hyponatremia/hypernatremia (DKA, SIADH, diabetes insipidus)",
            "Potassium: causes & ECG changes",
            "Calcium: ionized vs total, citrate chelation",
            "Magnesium: treatment of pre-eclampsia, arrhythmias",
            "Phosphate"
          ]
        }
      ]
    },
    {
      id: "blood-immune",
      name: "Blood & Immune Physiology",
      topics: [
        {
          id: "coag",
          name: "Coagulation & fibrinolysis",
          refs: ["MM Ch.22"],
          sub: [
            "Coagulation cascade (intrinsic/extrinsic/common)",
            "Cell-based model of coagulation",
            "Platelet function",
            "Fibrinolysis & D-dimer",
            "Inherited disorders (vWD, hemophilia A/B)",
            "Viscoelastic testing interpretation"
          ]
        },
        {
          id: "transfusion-physio",
          name: "Transfusion physiology",
          refs: ["MM Ch.51"],
          sub: [
            "ABO/Rh & crossmatch",
            "Component therapy",
            "Massive transfusion ratios",
            "TACO vs TRALI",
            "Transfusion reactions"
          ]
        }
      ]
    }
  ]
},
{
  id: "management",
  name: "Anesthetic Management",
  icon: "clipboard",
  color: "#f59e0b",
  sections: [
    {
      id: "preop",
      name: "Preoperative Evaluation",
      topics: [
        {
          id: "assessment",
          name: "History, exam & risk assessment",
          refs: ["MM Ch.8", "MIL Ch.38"],
          sub: [
            "ASA physical status classification",
            "Airway assessment (Mallampati, ULBT, TMD, neck mobility)",
            "Cardiac risk stratification (RCRI/Revised Cardiac Risk Index)",
            "Functional capacity (METs)",
            "Preoperative testing indications"
          ]
        },
        {
          id: "npo",
          name: "NPO & aspiration risk",
          refs: ["MM Ch.8", "ASA fasting guidelines"],
          sub: [
            "ASA fasting guidelines (2/4/6/8 h)",
            "Aspiration risk factors",
            "Pulmonary aspiration prophylaxis",
            "Obstetric & bowel obstruction special considerations"
          ]
        },
        {
          id: "premed",
          name: "Premedication",
          refs: ["MM Ch.8"],
          sub: [
            "Anxiolysis (midazolam, dexmedetomidine)",
            "Antisialogogue (glycopyrrolate)",
            "PONV prophylaxis",
            "PPI/H2 blockers",
            "Beta-blockade (POISE trial)"
          ]
        },
        {
          id: "preop-cardiac",
          name: "Preoperative cardiac optimization",
          refs: ["MM Ch.8", "ACC/AHA 2014 guidelines"],
          sub: [
            "Indications for stress testing",
            "Stents: DES vs BMS timing",
            "Beta-blocker & statin continuation",
            "Heart failure optimization",
            "Valvular disease assessment"
          ]
        },
        {
          id: "preop-pulm",
          name: "Preoperative pulmonary assessment",
          refs: ["MM Ch.8"],
          sub: [
            "COPD optimization & bronchodilators",
            "Asthma & peak flow",
            "Smoking cessation timing",
            "OSA screening (STOP-BANG)",
            "Pulmonary hypertension risk"
          ]
        }
      ]
    },
    {
      id: "airway",
      name: "Airway Management",
      topics: [
        {
          id: "airway-anatomy",
          name: "Airway anatomy & assessment",
          refs: ["MM Ch.19", "MIL Ch.54"],
          sub: [
            "Upper airway innervation",
            "Larynx anatomy & nerves (SLN, RLN)",
            "Difficult airway predictors",
            "LEMON, 3-3-2 rule",
            "Multivariate predictors (El-Ganzouri)"
          ]
        },
        {
          id: "airway-algo",
          name: "Difficult airway algorithms",
          refs: ["ASA Difficult Airway Algorithm", "DAS 2015", "MM Ch.19"],
          sub: [
            "ASA difficult airway algorithm",
            "DAS 2015 guidelines",
            "Awake vs asleep approach decision",
            "CICO & eFONA",
            "Vortex approach",
            "Difficult airway society extubation guidelines"
          ]
        },
        {
          id: "extubation",
          name: "Extubation & airway rescue",
          refs: ["MM Ch.19", "DAS extubation guidelines"],
          sub: [
            "Extubation criteria",
            "Cuff leak test",
            "Airway exchange catheters",
            "Deep vs awake extubation",
            "Staged extubation"
          ]
        },
        {
          id: "rapid-sequence",
          name: "Rapid sequence induction",
          refs: ["MM Ch.19", "DAS RSI"],
          sub: [
            "Indications for RSI",
            "Modified RSI vs classic",
            "Cricoid pressure debate (Sellick)",
            "Preoxygenation & apneic oxygenation (THRIVE)",
            "Backup airway plans"
          ]
        },
        {
          id: "obstructed-airway",
          name: "Obstructed airway management",
          refs: ["MM Ch.19", "MIL Ch.54"],
          sub: [
            "Stridor: inspiratory vs expiratory vs biphasic",
            "Epiglottitis, Ludwig angina",
            "Foreign body airway obstruction",
            "Airway tumor & stent considerations",
            "Heliox utility"
          ]
        }
      ]
    },
    {
      id: "ga",
      name: "General Anesthesia Technique",
      topics: [
        {
          id: "induction",
          name: "Induction & intubation",
          refs: ["MM Ch.18"],
          sub: [
            "Induction agent choice",
            "Loss of consciousness endpoints",
            "Preoxygenation & denitrogenation",
            "Apneic oxygenation (THRIVE)",
            "End-tidal anesthetic targets"
          ]
        },
        {
          id: "maintenance",
          name: "Maintenance of anesthesia",
          refs: ["MM Ch.18"],
          sub: [
            "Balanced anesthesia concept",
            "MAC & MAC-BAR",
            "TIVA vs inhalational",
            "Adjuvant use (opioid, NMB, lidocaine)",
            "Awareness prevention & BIS"
          ]
        },
        {
          id: "emergence",
          name: "Emergence & recovery",
          refs: ["MM Ch.18", "MM Ch.45"],
          sub: [
            "Emergence criteria",
            "Bucking & coughing prevention",
            "PACU recovery scoring (Aldrete)",
            "Delayed emergence causes",
            "Shivering treatment"
          ]
        },
        {
          id: "tci-tiva",
          name: "TIVA & target-controlled infusion",
          refs: ["MM Ch.18", "MIL Ch.30"],
          sub: [
            "Pharmacokinetic models (Marsh, Schnider, Eleveld)",
            "Effect-site targeting",
            "Context-sensitive half-time concepts",
            "Closed-loop systems",
            "Advantages/pitfalls of TIVA"
          ]
        }
      ]
    },
    {
      id: "regional",
      name: "Regional Anesthesia",
      topics: [
        {
          id: "ra-physics",
          name: "Principles of regional anesthesia",
          refs: ["MM Ch.16", "NYSORA"],
          sub: [
            "Ultrasound physics & needle guidance",
            "Nerve stimulation principles",
            "Factors affecting onset, block quality & duration",
            "Complications (LAST, nerve injury, infection)"
          ]
        },
        {
          id: "neuraxial",
          name: "Spinal & epidural anesthesia",
          refs: ["MM Ch.16", "MM Ch.45"],
          sub: [
            "Spinal: baricity, hyperbaric bupivacaine, level determinants",
            "Epidural technique & test dose",
            "Caudal block",
            "Combined spinal-epidural",
            "Hemodynamic & respiratory effects",
            "Post-dural puncture headache & treatment (EBP)",
            "Total spinal management",
            "Anticoagulation & neuraxial timing (ASRA)"
          ]
        },
        {
          id: "upper-limb",
          name: "Upper limb blocks",
          refs: ["MM Ch.16", "NYSORA"],
          sub: [
            "Interscalene (shoulder)",
            "Supraclavicular, infraclavicular",
            "Axillary block",
            "Phrenic nerve paralysis risk",
            "Complications (pneumothorax, intrathecal)"
          ]
        },
        {
          id: "lower-limb",
          name: "Lower limb & truncal blocks",
          refs: ["MM Ch.16", "NYSORA"],
          sub: [
            "Femoral, fascia iliaca, saphenous",
            "Sciatic (anterior/posterior, popliteal)",
            "TAP block, PECS, erector spinae plane",
            "Quadratus lumborum block"
          ]
        },
        {
          id: "ivra-pnb",
          name: "IV regional & specialized blocks",
          refs: ["MM Ch.16"],
          sub: [
            "Bier block (IVRA) technique & limits",
            "Ophthalmic blocks (retrobulbar, peribulbar, topical)",
            "ENT blocks",
            "Sphenopalatine ganglion block"
          ]
        }
      ]
    },
    {
      id: "mac-sedation",
      name: "Monitored Anesthesia Care & Sedation",
      topics: [
        {
          id: "mac",
          name: "MAC & procedural sedation",
          refs: ["MM Ch.18", "ASA MAC standards"],
          sub: [
            "Definition of MAC vs sedation",
            "ASA continuum of sedation",
            "Rescue airway responsibility",
            "Capnography mandatory",
            "Common drugs (propofol, ketamine, dexmedetomidine, remifentanil)"
          ]
        }
      ]
    },
    {
      id: "fluids",
      name: "Fluid & Electrolyte Management",
      topics: [
        {
          id: "fluids",
          name: "Fluid therapy",
          refs: ["MM Ch.51"],
          sub: [
            "Crystalloids vs colloids",
            "Balanced vs normal saline (hyperchloremic acidosis)",
            "4-2-1 rule (maintenance)",
            "Goal-directed fluid therapy",
            "Fluid responsiveness indices (SVV, PPV, PLR)",
            "Starches & albumin evidence (SMART, trial)"
          ]
        },
        {
          id: "transfusion",
          name: "Transfusion & coagulation management",
          refs: ["MM Ch.51", "MM Ch.22"],
          sub: [
            "Transfusion triggers (Hb 7-8)",
            "Massive transfusion protocols",
            "Cell salvage & contraindications",
            "Factor concentrates (fibrinogen, PCC)",
            "Tranexamic acid evidence"
          ]
        }
      ]
    },
    {
      id: "positioning",
      name: "Positioning & Safety",
      topics: [
        {
          id: "positioning",
          name: "Patient positioning",
          refs: ["MM Ch.18"],
          sub: [
            "Pressure points & padding",
            "Brachial plexus & ulnar nerve",
            "Lateral, prone, lithotomy, sitting risks",
            "Venous air embolism in sitting",
            "Compartment syndrome & rhabdomyolysis",
            "Eye injury prevention (prone)"
          ]
        }
      ]
    }
  ]
},
{
  id: "subspecialty",
  name: "Subspecialty Anesthesia",
  icon: "layers",
  color: "#8b5cf6",
  sections: [
    {
      id: "cardiac-anes",
      name: "Cardiac Anesthesia",
      topics: [
        {
          id: "cpb",
          name: "Cardiopulmonary bypass",
          refs: ["MM Ch.22", "MIL Ch.66"],
          sub: [
            "CPB circuit components",
            "Prime solutions & hemodilution",
            "Anticoagulation & protamine",
            "Pulsatile vs non-pulsatile flow",
            "Inflammatory response to CPB",
            "Cerebral & organ protection"
          ]
        },
        {
          id: "cabg-valve",
          name: "CABG & valve surgery",
          refs: ["MM Ch.22", "MIL Ch.66"],
          sub: [
            "On-pump vs off-pump CABG",
            "Mitral vs aortic valve surgery",
            "Monitoring (PA catheter, TEE)",
            "Weaning from CPB",
            "Vasoactive support"
          ]
        },
        {
          id: "aortic-cardiac",
          name: "Aortic & special cardiac",
          refs: ["MM Ch.22", "MIL Ch.67"],
          sub: [
            "Aortic aneurysm & dissection",
            "Deep hypothermic circulatory arrest",
            "Left heart bypass",
            "Cardiac tamponade anesthesia",
            "Transplant (orthotopic, VAD)"
          ]
        },
        {
          id: "cpb-anesthesia",
          name: "Anesthesia for cardiac surgery",
          refs: ["MM Ch.22"],
          sub: [
            "Premedication & induction",
            "Fast-track cardiac anesthesia",
            "TEE basic views",
            "Extubation timing",
            "Postoperative bleeding management"
          ]
        }
      ]
    },
    {
      id: "thoracic",
      name: "Thoracic Anesthesia",
      topics: [
        {
          id: "olvs",
          name: "One-lung ventilation",
          refs: ["MM Ch.23", "MIL Ch.70"],
          sub: [
            "DLT vs bronchial blocker indications",
            "DLT sizing & placement (fiberoptic confirm)",
            "Hypoxemia during OLV management",
            "CPAP to non-dependent lung, PEEP dependent",
            "V/Q & hypoxic pulmonary vasoconstriction"
          ]
        },
        {
          id: "thoracic-procedures",
          name: "Thoracic procedures",
          refs: ["MM Ch.23"],
          sub: [
            "Lung resection, lobectomy, pneumonectomy",
            "Bronchoscopy, mediastinoscopy",
            "Esophageal surgery",
            "Post-lung resection pulmonary edema",
            "Lung transplant",
            "Anesthesia for empyema, decortication"
          ]
        },
        {
          id: "jet-vent",
          name: "Jet ventilation & airway surgery",
          refs: ["MM Ch.23"],
          sub: [
            "High frequency jet ventilation",
            "Bronchial blocker for airway surgery",
            "Laser airway surgery: fire triangle, tube selection",
            "Rigid bronchoscopy ventilation"
          ]
        }
      ]
    },
    {
      id: "vascular",
      name: "Vascular Anesthesia",
      topics: [
        {
          id: "carotid",
          name: "Carotid & cerebrovascular",
          refs: ["MM Ch.24"],
          sub: [
            "Carotid endarterectomy: GA vs regional vs awake",
            "Cerebral monitoring (EEG, stump pressure, TCD)",
            "Shunt indications",
            "Postoperative hyperperfusion syndrome"
          ]
        },
        {
          id: "aortic-vascular",
          name: "Aortic & peripheral vascular",
          refs: ["MM Ch.24"],
          sub: [
            "Open vs endovascular aortic repair (EVAR)",
            "Clamping hemodynamics",
            "Spinal cord ischemia risk",
            "Peripheral revascularization",
            "Thrombolysis & anticoagulation considerations"
          ]
        }
      ]
    },
    {
      id: "neuro",
      name: "Neuroanesthesia",
      topics: [
        {
          id: "neuro-tumor",
          name: "Intracranial & tumor surgery",
          refs: ["MM Ch.26", "MIL Ch.81"],
          sub: [
            "ICP & CPP management",
            "Drugs: propofol, thiopental, opioids, ketamine debate",
            "Brain relaxation & mannitol/hypertonic saline",
            "Positioning & venous air embolism"
          ]
        },
        {
          id: "neuro-spine",
          name: "Spine & spinal cord",
          refs: ["MM Ch.26"],
          sub: [
            "Anterior vs posterior cervical approaches",
            "Spinal cord monitoring (SSEP, MEP)",
            "Venous air embolism in prone/sitting",
            "Spinal cord perfusion pressure",
            "Major blood loss & cell salvage"
          ]
        },
        {
          id: "neuro-special",
          name: "Special neuro procedures",
          refs: ["MM Ch.26"],
          sub: [
            "Awake craniotomy & mapping",
            "Epilepsy surgery & Wada test",
            "Interventional neuroradiology (coiling, stenting)",
            "Pituitary surgery (transsphenoidal)",
            "Sitting position & VAE management",
            "Carotid & intracranial vascular surgery"
          ]
        }
      ]
    },
    {
      id: "obstetric",
      name: "Obstetric Anesthesia",
      topics: [
        {
          id: "ob-physio",
          name: "Maternal physiology changes",
          refs: ["MM Ch.40", "MM Ch.41"],
          sub: [
            "Cardiovascular, respiratory, GI changes",
            "Aortocaval compression & left uterine displacement",
            "Decreased MAC, increased block height",
            "Placental transfer & drug effects on fetus"
          ]
        },
        {
          id: "cs",
          name: "Cesarean section anesthesia",
          refs: ["MM Ch.41", "MIL Ch.77"],
          sub: [
            "Spinal: hyperbaric bupivacaine + opioid",
            "Epidural top-up for cesarean",
            "CSE technique",
            "Hypotension management (phenylephrine vs ephedrine)",
            "Failed conversion to GA & general technique"
          ]
        },
        {
          id: "labor",
          name: "Labor analgesia",
          refs: ["MM Ch.41", "MM Ch.40"],
          sub: [
            "Epidural analgesia regimen",
            "Combined spinal-epidural for labor",
            "Dural puncture & PDPH",
            "Complications: high block, LAST",
            "Inadequate block troubleshooting"
          ]
        },
        {
          id: "ob-emergencies",
          name: "Obstetric emergencies",
          refs: ["MM Ch.41", "MIL Ch.77"],
          sub: [
            "Massive obstetric hemorrhage & DIC",
            "Amniotic fluid embolism",
            "Placenta accreta spectrum",
            "Pre-eclampsia/eclampsia & HELLP",
            "Shoulder dystocia & uterine inversion",
            "Maternal cardiac arrest (MCFPR)"
          ]
        },
        {
          id: "ob-fetus",
          name: "Fetal assessment & neonatal",
          refs: ["MM Ch.41"],
          sub: [
            "APGAR score",
            "Neonatal resuscitation (NRP)",
            "Umbilical cord blood gases",
            "Meconium aspiration"
          ]
        }
      ]
    },
    {
      id: "pediatric",
      name: "Pediatric Anesthesia",
      topics: [
        {
          id: "ped-physio",
          name: "Pediatric physiology & airway",
          refs: ["MM Ch.42", "MIL Ch.78"],
          sub: [
            "Neonatal cardiovascular & respiratory physiology",
            "Pediatric airway differences (large tongue, occiput, narrow cricoid)",
            "Pulmonary vascular transition & PPHN",
            "Thermoregulation & insensible losses",
            "Pediatric dosing & MAC changes"
          ]
        },
        {
          id: "ped-induction",
          name: "Pediatric induction & airway",
          refs: ["MM Ch.42"],
          sub: [
            "Inhalational vs IV induction",
            "Parental presence & premedication",
            "Pediatric ETT sizing (uncuffed vs cuffed)",
            "LMA in pediatrics",
            "Difficult pediatric airway algorithm"
          ]
        },
        {
          id: "ped-surgery",
          name: "Common pediatric procedures",
          refs: ["MM Ch.42", "MIL Ch.78"],
          sub: [
            "Tonsillectomy & adenoidectomy",
            "Strabismus surgery",
            "Cleft lip/palate",
            "Tympanostomy",
            "Hernia & orchiopexy",
            "Inguinal blocks (caudal, ilioinguinal)"
          ]
        },
        {
          id: "ped-neonatal",
          name: "Neonatal emergencies",
          refs: ["MM Ch.42"],
          sub: [
            "Congenital diaphragmatic hernia",
            "Tracheoesophageal fistula",
            "Omphalocele & gastroschisis",
            "Pyloric stenosis (metabolic alkalosis)",
            "Necrotizing enterocolitis",
            "Congenital heart disease considerations"
          ]
        }
      ]
    },
    {
      id: "geriatric",
      name: "Geriatric Anesthesia",
      topics: [
        {
          id: "geri-physio",
          name: "Aging & anesthetic implications",
          refs: ["MM Ch.43"],
          sub: [
            "Organ system changes & MAC reduction",
            "Pharmacokinetic changes (decreased clearance)",
            "Frailty & delirium risk",
            "Postoperative cognitive dysfunction vs delirium",
            "Polypharmacy & drug interactions"
          ]
        }
      ]
    },
    {
      id: "ambulatory",
      name: "Ambulatory & Day-case",
      topics: [
        {
          id: "ambulatory",
          name: "Outpatient anesthesia",
          refs: ["MM Ch.44"],
          sub: [
            "Patient selection criteria",
            "Fast-tracking & PACU bypass",
            "PONV prophylaxis multimodal",
            "Post-discharge nausea & vomiting",
            "Discharge criteria"
          ]
        }
      ]
    },
    {
      id: "trauma",
      name: "Trauma Anesthesia",
      topics: [
        {
          id: "trauma",
          name: "Trauma resuscitation",
          refs: ["MM Ch.39", "ATLS"],
          sub: [
            "Primary survey (ABCDE)",
            "Hypotensive resuscitation debate",
            "Damage control resuscitation",
            "Massive transfusion ratios",
            "Traumatic brain injury (CPP target)",
            "Burns: Parkland formula, escharotomy"
          ]
        }
      ]
    },
    {
      id: "bariatric",
      name: "Bariatric Anesthesia",
      topics: [
        {
          id: "obesity",
          name: "Obesity & bariatric surgery",
          refs: ["MM Ch.29"],
          sub: [
            "Obesity-related physiology (FRC, OSA, OHS)",
            "Difficult airway prediction & positioning",
            "Drug dosing (LBW vs TBW)",
            "CPAP/BiPAP perioperative",
            "Bariatric procedures (sleeve, bypass) complications"
          ]
        }
      ]
    },
    {
      id: "transplant",
      name: "Transplant Anesthesia",
      topics: [
        {
          id: "transplant",
          name: "Organ transplant",
          refs: ["MM Ch.39"],
          sub: [
            "Liver transplant: anhepatic & reperfusion phases",
            "Kidney transplant anesthesia",
            "Pancreas & islet transplant",
            "Heart & lung transplant"
          ]
        }
      ]
    },
    {
      id: "ophthalmic",
      name: "Ophthalmic & ENT",
      topics: [
        {
          id: "eye",
          name: "Ophthalmic anesthesia",
          refs: ["MM Ch.38"],
          sub: [
            "Oculocardiac reflex",
            "Retrobulbar & peribulbar block",
            "Intraocular pressure & drugs",
            "Open eye + full stomach dilemma",
            "Pediatric strabismus & malignant hyperthermia"
          ]
        },
        {
          id: "ent",
          name: "ENT & maxillofacial",
          refs: ["MM Ch.38"],
          sub: [
            "Tonsillectomy: bleeding, suxamethonium debate",
            "Laser airway surgery fire prevention",
            "TMJ & facial trauma",
            "Shared airway cases"
          ]
        }
      ]
    },
    {
      id: "ortho",
      name: "Orthopedic Anesthesia",
      topics: [
        {
          id: "ortho",
          name: "Orthopedic procedures",
          refs: ["MM Ch.37"],
          sub: [
            "Tourniquet physiology & tolerance",
            "Bone cement implantation syndrome",
            "Fat embolism syndrome",
            "Major joint replacement & ERAS",
            "Scoliosis surgery (SSEP, cell salvage)"
          ]
        }
      ]
    },
    {
      id: "endo-surgery",
      name: "Endocrine & Abdominal Surgery",
      topics: [
        {
          id: "pheo",
          name: "Pheochromocytoma",
          refs: ["MM Ch.35"],
          sub: [
            "Preoperative alpha then beta blockade",
            "Intraoperative hemodynamic swings",
            "Hypoglycemia after resection",
            "Adrenal crisis risk"
          ]
        },
        {
          id: "abdominal",
          name: "Abdominal & laparoscopic surgery",
          refs: ["MM Ch.18"],
          sub: [
            "Laparoscopy: CO2 absorption, IAP effects, gas embolism",
            "Bowel surgery & fluid shifts",
            "ERAS pathways",
            "Hepatic resection anesthesia"
          ]
        }
      ]
    },
    {
      id: "genitourinary",
      name: "Genitourinary & Robotic",
      topics: [
        {
          id: "turgi",
          name: "TURP, urology & robotic",
          refs: ["MM Ch.37"],
          sub: [
            "TURP syndrome (glycine absorption)",
            "Robotic surgery: steep Trendelenburg, pneumoperitoneum",
            "Cystectomy, nephrectomy",
            "Radical prostatectomy anesthesia"
          ]
        }
      ]
    }
  ]
},
{
  id: "pain",
  name: "Pain Medicine",
  icon: "heart-pulse",
  color: "#ef4444",
  sections: [
    {
      id: "pain-physiology",
      name: "Pain Physiology",
      topics: [
        {
          id: "pain-pathway",
          name: "Pain pathways & modulation",
          refs: ["MM Ch.47", "MIL Ch.87"],
          sub: [
            "Nociceptors & transduction",
            "A-delta vs C fibers",
            "Spinal cord processing & gate control",
            "Descending inhibition",
            "Central & peripheral sensitization",
            "Wind-up & NMDA",
            "Chronic pain mechanisms"
          ]
        }
      ]
    },
    {
      id: "acute-pain",
      name: "Acute Pain Management",
      topics: [
        {
          id: "acute-pain",
          name: "Postoperative pain",
          refs: ["MM Ch.47"],
          sub: [
            "Multimodal analgesia concept",
            "PCA: dosing, lockout, background infusion",
            "Epidural analgesia (types, agents, monitoring)",
            "Regional analgesia continuous catheters",
            "ERAS pain protocols",
            "Opioid-tolerant patient management",
            "Acute pain service & monitoring"
          ]
        }
      ]
    },
    {
      id: "chronic-pain",
      name: "Chronic & Cancer Pain",
      topics: [
        {
          id: "chronic",
          name: "Chronic pain conditions",
          refs: ["MM Ch.47"],
          sub: [
            "Neuropathic pain: postherpetic neuralgia, diabetic neuropathy",
            "Complex regional pain syndrome (CRPS I/II)",
            "Trigeminal neuralgia & facial pain",
            "Fibromyalgia & central sensitization",
            "Pharmacotherapy (gabapentinoids, antidepressants, opioids)"
          ]
        },
        {
          id: "cancer-pain",
          name: "Cancer pain & interventions",
          refs: ["MM Ch.47"],
          sub: [
            "WHO analgesic ladder",
            "Opioid rotation & equianalgesia",
            "Intrathecal drug delivery systems",
            "Neurolytic blocks (celiac plexus)",
            "Palliative sedation"
          ]
        },
        {
          id: "pain-interventions",
          name: "Interventional pain procedures",
          refs: ["MM Ch.47"],
          sub: [
            "Epidural steroid injections",
            "Facet joint & medial branch blocks",
            "Radiofrequency ablation",
            "Sympathetic blocks (splanchnic, stellate, lumbar)",
            "Spinal cord stimulation",
            "Dorsal root ganglion stimulation"
          ]
        }
      ]
    }
  ]
},
{
  id: "critical-care",
  name: "Critical Care Medicine",
  icon: "activity",
  color: "#06b6d4",
  sections: [
    {
      id: "resus",
      name: "Resuscitation",
      topics: [
        {
          id: "cpr",
          name: "Cardiac arrest & CPR",
          refs: ["MM Ch.48", "AHA ACLS"],
          sub: [
            "BLS & high-quality CPR metrics",
            "ACLS algorithms (VF/VT, PEA, asystole)",
            "Reversible causes (Hs & Ts)",
            "Post-cardiac arrest care & targeted temperature",
            "ECMO & eCPR",
            "Ethics: DNAR in OR"
          ]
        },
        {
          id: "shock",
          name: "Shock states",
          refs: ["MM Ch.57"],
          sub: [
            "Classification & recognition",
            "Septic shock: Surviving Sepsis bundles",
            "Cardiogenic shock & mechanical support",
            "Anaphylactic shock",
            "Hemodynamic monitoring in shock"
          ]
        }
      ]
    },
    {
      id: "icu-vent",
      name: "Mechanical Ventilation in ICU",
      topics: [
        {
          id: "vent-modes",
          name: "Ventilator modes & settings",
          refs: ["MIL Ch.103"],
          sub: [
            "Volume vs pressure control",
            "SIMV, PSV, APRV",
            "Lung-protective ventilation (ARDSnet)",
            "PEEP titration",
            "Weaning & SBT",
            "Airway pressure release ventilation"
          ]
        },
        {
          id: "ards",
          name: "ARDS & hypoxemia",
          refs: ["MIL Ch.103", "ARDSnet"],
          sub: [
            "Berlin definition & severity",
            "PEEP/FiO2 tables",
            "Prone positioning",
            "Neuromuscular blockade in ARDS",
            "ECMO indications (V-V vs V-A)",
            "Driving pressure & transpulmonary pressure"
          ]
        }
      ]
    },
    {
      id: "icu-hemodynamic",
      name: "Hemodynamic Support & Sepsis",
      topics: [
        {
          id: "sepsis",
          name: "Sepsis & septic shock",
          refs: ["Surviving Sepsis Campaign 2021"],
          sub: [
            "Sepsis-3 definitions",
            "Hour-1 bundle",
            "Fluid resuscitation & dynamic indices",
            "Vasopressor choice & targets",
            "Lactate clearance",
            "Source control"
          ]
        }
      ]
    },
    {
      id: "icu-organ",
      name: "Organ Support",
      topics: [
        {
          id: "aki",
          name: "Acute kidney injury & RRT",
          refs: ["MM Ch.57"],
          sub: [
            "KDIGO staging",
            "Indications for dialysis (AEIOU)",
            "CRRT vs intermittent HD",
            "Dosing of CRRT",
            "Drug dosing adjustments"
          ]
        },
        {
          id: "nutrition",
          name: "Nutrition & metabolic",
          refs: ["MM Ch.57"],
          sub: [
            "Energy & protein targets",
            "Early enteral nutrition",
            "Refeeding syndrome",
            "TPN indications & complications"
          ]
        }
      ]
    },
    {
      id: "icu-neuro",
      name: "Neurocritical Care",
      topics: [
        {
          id: "tbi-icu",
          name: "TBI & raised ICP",
          refs: ["MM Ch.39", "Brain Trauma Foundation"],
          sub: [
            "Brain Trauma Foundation guidelines",
            "ICP monitoring & thresholds",
            "CPP target (60-70)",
            "Osmotherapy (mannitol vs hypertonic saline)",
            "Decompressive craniectomy",
            "Multimodality monitoring (PbtO2, microdialysis)"
          ]
        },
        {
          id: "stroke-status",
          name: "Stroke & status epilepticus",
          refs: ["MM Ch.57"],
          sub: [
            "Ischemic stroke: thrombolysis, thrombectomy",
            "Hemorrhagic stroke & BP control",
            "Status epilepticus algorithm",
            "Continuous EEG monitoring"
          ]
        }
      ]
    }
  ]
},
{
  id: "complications",
  name: "Perioperative Complications & Emergencies",
  icon: "alert-triangle",
  color: "#f97316",
  sections: [
    {
      id: "airway-emergencies",
      name: "Airway & Respiratory Emergencies",
      topics: [
        {
          id: "cico",
          name: "Cannot intubate cannot oxygenate",
          refs: ["DAS 2015", "MM Ch.19"],
          sub: [
            "CICO definition & timeline",
            "Scalpel-bougie-tube technique",
            "Cricothyroidotomy: Melker vs surgical",
            "Team factors & human factors"
          ]
        },
        {
          id: "bronchospasm",
          name: "Intraoperative bronchospasm",
          refs: ["MM Ch.18"],
          sub: [
            "Differential diagnosis",
            "Treatment: deepening, bronchodilators, ketamine",
            "Anaphylaxis distinction",
            "Ventilator strategy"
          ]
        },
        {
          id: "aspiration",
          name: "Pulmonary aspiration",
          refs: ["MM Ch.18"],
          sub: [
            "Risk factors & prevention",
            "Management: head down, suction, PEEP",
            "Steroid & antibiotic debate",
            "Bronchoscopy & lavage"
          ]
        }
      ]
    },
    {
      id: "cardio-emergencies",
      name: "Cardiovascular Emergencies",
      topics: [
        {
          id: "hypotension",
          name: "Intraoperative hypotension & arrhythmia",
          refs: ["MM Ch.18"],
          sub: [
            "Differential: preload/afterload/contractility",
            "Common arrhythmias management",
            "Tachyarrhythmia vs bradyarrhythmia",
            "Pulseless arrest algorithm"
          ]
        },
        {
          id: "hypertensive",
          name: "Hypertensive crisis",
          refs: ["MM Ch.14"],
          sub: [
            "Definition & targets",
            "Drug choice (labetalol, nicardipine, nitroprusside)",
            "Aortic dissection management",
            "Pheochromocytoma crisis"
          ]
        },
        {
          id: "vae",
          name: "Venous air embolism",
          refs: ["MM Ch.26"],
          sub: [
            "Risk & mechanism",
            "Diagnosis (EtCO2, precordial Doppler, TEE)",
            "Management: stop source, Durant position, aspirate CVP"
          ]
        }
      ]
    },
    {
      id: "neuro-emergencies",
      name: "Neurologic Complications",
      topics: [
        {
          id: "awareness",
          name: "Awareness under anesthesia",
          refs: ["MM Ch.18", "MIL Ch.53"],
          sub: [
            "Risk factors (TIVA, NMB, trauma)",
            "BIS & monitoring utility",
            "Prevention strategies",
            "Postoperative management & PTSD"
          ]
        },
        {
          id: "delirium",
          name: "Postoperative delirium & cognitive dysfunction",
          refs: ["MM Ch.43"],
          sub: [
            "Risk factors & screening (CAM-ICU)",
            "Prevention: multimodal",
            "Pharmacologic vs non-pharmacologic",
            "POCD vs delirium distinction"
          ]
        },
        {
          id: "stroke",
          name: "Perioperative stroke",
          refs: ["MM Ch.39"],
          sub: [
            "Risk factors",
            "Atrial fibrillation & surgery",
            "Timing after prior stroke",
            "Management algorithm"
          ]
        }
      ]
    },
    {
      id: "mh-anaphylaxis",
      name: "Malignant Hyperthermia & Anaphylaxis",
      topics: [
        {
          id: "mh",
          name: "Malignant hyperthermia",
          refs: ["MM Ch.12", "MHAUS"],
          sub: [
            "Pathophysiology (RYR1, CACNA1S)",
            "Trigger & non-trigger agents",
            "Clinical presentation & lab changes",
            "Treatment: dantrolene protocol, cooling, treat hyperkalemia",
            "MHAUS hotline & post-crisis",
            "Testing & family screening"
          ]
        },
        {
          id: "anaphylaxis",
          name: "Anaphylaxis",
          refs: ["MM Ch.18", "MM Ch.12"],
          sub: [
            "Common triggers (NMBAs, antibiotics, latex, chlorhexidine)",
            "Mechanism (IgE vs non-IgE)",
            "Diagnosis & tryptase timing",
            "Treatment: epinephrine, fluids, positioning",
            "Post-event investigation"
          ]
        }
      ]
    },
    {
      id: "other-complications",
      name: "Other Complications",
      topics: [
        {
          id: "ponv",
          name: "Postoperative nausea & vomiting",
          refs: ["MM Ch.45", "Apfel score"],
          sub: [
            "Risk factors (Apfel)",
            "Receptor targets & drugs",
            "Multimodal PONV prophylaxis",
            "Rescue therapy",
            "PDNV"
          ]
        },
        {
          id: "hypothermia",
          name: "Hypothermia & shivering",
          refs: ["MM Ch.18"],
          sub: [
            "Phases of heat loss",
            "Consequences (coagulopathy, infection, prolonged recovery)",
            "Warming devices",
            "Shivering treatment (meperidine, clonidine, dexmedetomidine)"
          ]
        },
        {
          id: "eye-injury",
          name: "Peripheral nerve & eye injury",
          refs: ["MM Ch.18", "ASA Closed Claims"],
          sub: [
            "Ulnar nerve injury common causes",
            "Brachial plexus & positioning",
            "Corneal abrasion prevention",
            "Ischemic optic neuropathy (prone, spine)",
            "ASA practice advisory on positioning"
          ]
        },
        {
          id: "cholinesterase",
          name: "Pseudocholinesterase deficiency",
          refs: ["MM Ch.11"],
          sub: [
            "Genetic variants & dibucaine number",
            "Acquired causes",
            "Management of prolonged blockade",
            "Genetic counseling"
          ]
        },
        {
          id: "latex",
          name: "Latex allergy",
          refs: ["MM Ch.12"],
          sub: [
            "Risk groups (spina bifida, healthcare workers)",
            "Clinical presentation",
            "Latex-free environment",
            "Cross-reactivity (fruits)"
          ]
        }
      ]
    }
  ]
},
{
  id: "basic-science",
  name: "Basic Sciences & Statistics",
  icon: "calculator",
  color: "#14b8a6",
  sections: [
    {
      id: "physics",
      name: "Anesthesia Physics",
      topics: [
        {
          id: "gas-laws",
          name: "Gas laws & physics",
          refs: ["MM Ch.4", "DD"],
          sub: [
            "Boyle, Charles, Gay-Lussac, ideal gas",
            "Avogadro's hypothesis & Dalton's law",
            "Fick's law of diffusion",
            "Graham's law (effusion)",
            "Henry's law",
            "Critical temperature & pressure",
            "Adiabatic compression/explosion",
            "Latent heat of vaporization",
            "Viscosity, density, Reynolds number"
          ]
        },
        {
          id: "pressure-flow",
          name: "Pressure, flow & measurement",
          refs: ["DD"],
          sub: [
            "Bourdon gauge, manometers",
            "Bernoulli & Venturi principles",
            "Laminar vs turbulent (Hagen-Poiseuille)",
            "Pneumatic vs electronic measurement",
            "Oscillometric BP"
          ]
        },
        {
          id: "electric-laser",
          name: "Electricity & lasers",
          refs: ["DD Ch.19"],
          sub: [
            "Ohm's law & power",
            "Macroshock vs microshock",
            "Diathermy & grounding pad",
            "Laser types & physics (CO2, Nd:YAG, KTP)",
            "Surgical fire triangle"
          ]
        }
      ]
    },
    {
      id: "stats",
      name: "Statistics & Research",
      topics: [
        {
          id: "stats-basics",
          name: "Statistical concepts",
          refs: ["MM Ch.6"],
          sub: [
            "Descriptive statistics",
            "Normal & non-normal distributions",
            "Confidence intervals",
            "Hypothesis testing & p-value",
            "Type I & II errors, power",
            "Parametric vs non-parametric tests",
            "Multiple comparisons"
          ]
        },
        {
          id: "study-design",
          name: "Study design & evidence",
          refs: ["MM Ch.6"],
          sub: [
            "RCT, cohort, case-control, cross-sectional",
            "Bias & confounding",
            "Levels of evidence",
            "Forest plots & meta-analysis",
            "Number needed to treat/harm",
            "Intention-to-treat analysis"
          ]
        }
      ]
    },
    {
      id: "anatomy",
      name: "Relevant Anatomy",
      topics: [
        {
          id: "clin-anatomy",
          name: "Clinical anatomy for anesthesia",
          refs: ["MM"],
          sub: [
            "Airway & laryngeal innervation",
            "Brachial plexus",
            "Epidural & spinal anatomy (layers, ligaments)",
            "Heart & great vessels",
            "Celiac plexus & autonomic ganglia",
            "Trigeminal & facial nerve"
          ]
        }
      ]
    }
  ]
},
{
  id: "professional",
  name: "Anesthesia Practice & Safety",
  icon: "shield-check",
  color: "#6366f1",
  sections: [
    {
      id: "safety-quality",
      name: "Safety & Quality",
      topics: [
        {
          id: "human-factors",
          name: "Human factors & crisis resource management",
          refs: ["MIL Ch.10", "Anesthesia Patient Safety Foundation"],
          sub: [
            "Crisis resource management principles",
            "Checklists & cognitive aids",
            "Human error & Swiss cheese model",
            "Fatigue & performance",
            "Team communication (SBAR, closed-loop)"
          ]
        },
        {
          id: "quality",
          name: "Quality improvement",
          refs: ["MIL Ch.11"],
          sub: [
            "Structure-process-outcome",
            "Sentinel events & root cause analysis",
            "M&M review",
            "Anesthesia Closed Claims",
            "Reporting systems"
          ]
        }
      ]
    },
    {
      id: "ethics-law",
      name: "Ethics & Law",
      topics: [
        {
          id: "consent",
          name: "Consent & capacity",
          refs: ["MM Ch.6"],
          sub: [
            "Informed consent elements",
            "Capacity assessment",
            "Best interests & surrogate",
            "Advance directives & DNAR in OR",
            "Refusal of blood (Jehovah's Witness)"
          ]
        },
        {
          id: "medico-legal",
          name: "Medico-legal aspects",
          refs: ["MM Ch.6"],
          sub: [
            "Negligence & duty of care",
            "Documentation standards",
            "Confidentiality & GDPR/HIPAA",
            "Brain death & organ donation ethics"
          ]
        }
      ]
    },
    {
      id: "exam-prep",
      name: "EDAIC / FRCA Exam Preparation",
      topics: [
        {
          id: "edaic",
          name: "EDAIC structure",
          refs: ["EBA/ESAIC", "esaic.org"],
          sub: [
            "Part 1 MCQ (ITC) format",
            "Part 2 SOE & OSCE",
            "Syllabus topics & blueprint",
            "Recommended reading (Stoelting, Miller, MM)",
            "Mock exam strategy"
          ]
        },
        {
          id: "frca",
          name: "FRCA structure",
          refs: ["RCoA", "rcoa.ac.uk"],
          sub: [
            "Primary FRCA: MCQ, OSCE/SOE",
            "Final FRCA: written, SOE",
            "Curriculum &competency framework",
            "Recommended texts & question banks"
          ]
        }
      ]
    }
  ]
}
];

if (typeof window !== "undefined") {
  window.CURRICULUM = CURRICULUM;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CURRICULUM;
}
