// Anesthetick — Comprehensive Anesthesia Curriculum Database
// Merged & curated from data.js + datass.js
// Target: EDAIC Part I & II, Primary FRCA, Final FRCA
// References legend:
//   MM = Morgan & Mikhail's Clinical Anesthesiology (6th ed)
//   MIL = Miller's Anesthesia (10th ed)
//   DD = Dorsch & Dorsch Understanding Anesthesia Equipment (5th ed)
//   OX = OpenAnesthesia (openanesthesia.org)
//   ATOTW = Anaesthesia Tutorial of the Week (WFSA/AnaesthesiaUK)
//   PS = PhysiologyWeb / Free open physiology texts
//   RCoA G1-G4 = RCoA 2021 Curriculum (G1: Generic, G2: Physics/Equipment, G3: Pharmacology, G4: Clinical)
//   MIL Ch = Miller's Anesthesia chapter
//   MM Ch = Morgan & Mikhail chapter
//   OX Pain = OpenAnesthesia pain module
//   OX Ob = OpenAnesthesia obstetric module
//   RCUK = Resuscitation Council UK
//   ERC = European Resuscitation Council
//   SSC = Surviving Sepsis Campaign

const CURRICULUM = [
  // ──────────────────────────────────────────────
  // CATEGORY 1 — Physics & Clinical Measurement
  // ──────────────────────────────────────────────
  {
    id: "physics-measurement",
    name: "Physics & Clinical Measurement",
    icon: "atom",
    color: "#3b82f6",
    sections: [
      {
        id: "gas-laws",
        name: "Gas Laws & Physics Principles",
        topics: [
          {
            id: "gas-laws",
            name: "Gas Laws",
            refs: ["MM Ch.1", "DD Ch.1", "RCoA G2"],
            icon: "thermometer",
            sub: [
              "Ideal gas law & universal gas constant",
              "Boyle's law: pressure-volume relationship",
              "Charles's law: temperature-volume",
              "Gay-Lussac's law: pressure-temperature",
              "Avogadro's hypothesis & molar volume",
              "Dalton's law of partial pressures",
              "Henry's law: gas solubility in liquids",
              "Fick's law of diffusion",
              "Graham's law: rate of diffusion",
              "Critical temperature, pressure & the Joule-Thomson effect",
              "Vapour pressure & saturated vapour pressure",
              "Bernoulli's principle, Venturi effect, Coanda effect",
              "Laplace's law: sphere tension & collapsing pressure",
              "Poiseuille's law: laminar flow, Hagen-Poiseuille equation",
              "Reynolds number: laminar vs turbulent flow",
              "Pascal's principle: hydraulic systems"
            ],
            subLinks: ["","","","","","","","","","","","","","","",""]
          },
          {
            id: "physics-basics",
            name: "Basic Physics Concepts",
            refs: ["MM Ch.1", "DD Ch.1", "RCoA G2"],
            icon: "zap",
            sub: [
              "SI base units & derived units",
              "Force, work, energy, power",
              "Ohm's law, impedance, capacitance, inductance",
              "Electromagnetic spectrum & medical applications",
              "Ultrasound physics: frequency, wavelength, attenuation, piezoelectric effect",
              "Doppler effect: red-shift vs blue-shift, continuous vs pulsed wave Doppler",
              "Laser physics: population inversion, stimulated emission",
              "Nuclear physics: isotopes, half-life, radioactive decay",
              "Optics principles in clinical measurement: refraction, reflection, fiberoptics"
            ],
            subLinks: ["","","","","","","","",""]
          },
          {
            id: "measurement-stats",
            name: "Measurement Theory & Statistics",
            refs: ["MM Ch.1", "RCoA G2"],
            icon: "bar-chart",
            sub: [
              "Accuracy, precision, bias, & calibration",
              "Sensitivity & specificity of monitors",
              "Frequency response, damping, resonance",
              "Signal-to-noise ratio & filtering",
              "Bridge circuits, Wheatstone bridge, strain gauge",
              "Amplifiers: differential, operational amplifier",
              "Transducers: types, zeroing, calibration",
              "Data interpretation: ROC curves, Bland-Altman analysis",
              "Survival analysis: Kaplan-Meier curves",
              "Systematic reviews & meta-analysis: forest plot, funnel plot"
            ],
            subLinks: ["","","","","","","","","",""]
          }
        ]
      },
      {
        id: "clinical-monitoring",
        name: "Clinical Monitoring",
        topics: [
          {
            id: "cardiovascular-monitoring",
            name: "Cardiovascular Monitoring",
            refs: ["MM Ch.21", "DD Ch.4", "RCoA G2"],
            icon: "heart",
            sub: [
              "ECG: leads, waveforms, ST analysis, 5-lead system",
              "Invasive BP: arterial line, damping, resonance, zeroing, leveling",
              "CVP: waveform, interpretation, complications",
              "Pulmonary artery catheter: waveforms, CO by thermodilution, complications",
              "Cardiac output: Fick, thermodilution, lithium dilution (LiDCO), pulse contour analysis (PiCCO, FloTrac)",
              "Oesophageal Doppler: flow time, stroke volume",
              "Transthoracic & transoesophageal echocardiography (TTE/TOE)",
              "Bispectral index (BIS) & depth of anaesthesia",
              "Near-infrared spectroscopy (NIRS) cerebral oximetry",
              "Peripheral perfusion index & pleth variability index (PVI)"
            ],
            subLinks: ["","","","","","","","","",""]
          },
          {
            id: "respiratory-monitoring",
            name: "Respiratory Monitoring",
            refs: ["MM Ch.21", "DD Ch.3", "RCoA G2"],
            icon: "lung",
            sub: [
              "Pulse oximetry: Beer-Lambert law, absorption spectra, limitations",
              "Capnography: waveform phases, numerical values, interpretation",
              "Oxygen analysers: paramagnetic, fuel cell, galvanic, zirconia",
              "Spirometry: FVC, FEV1, PEFR, flow-volume loops",
              "Gas exchange: A-a gradient, dead space (Bohr), shunt (Qs/Qt)",
              "Respiratory mechanics: compliance, resistance, work of breathing",
              "Inspired & expired gas analysis: mass spectrometry, Raman scattering",
              "Blood gas analysis: pH, PaO2, PaCO2, HCO3, BE, lactate, electrolyte measurement methods"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "neuromuscular-monitoring",
            name: "Neuromuscular & Neurological Monitoring",
            refs: ["MM Ch.21", "DD Ch.2", "RCoA G2"],
            icon: "brain",
            sub: [
              "TOF, DBS, PTC, tetanic stimulation",
              "Acceleromyography, electromyography, mechanomyography",
              "EEG, evoked potentials (SSEP, MEP, AEP)",
              "ICP monitoring: intraventricular, intraparenchymal, subdural",
              "Jugular venous oximetry (SjvO2)",
              "Cerebral blood flow measurement: xenon CT, TCD"
            ],
            subLinks: ["","","","","",""]
          }
        ]
      },
      {
        id: "equipment",
        name: "Anaesthetic Equipment & Safety",
        topics: [
          {
            id: "anaesthesia-machine",
            name: "Anaesthesia Machine & Breathing Systems",
            refs: ["MM Ch.2", "DD Ch.5", "RCoA G2"],
            icon: "monitor",
            sub: [
              "Anaesthesia machine: gas supply, flowmeters, vaporizers, common gas outlet",
              "Pipeline & cylinder supply: colour coding, pin-index, Schrader probes, pressure regulators",
              "Flowmeters: variable orifice (Rotameter), electronic, limitations",
              "Vaporizers: plenum (Tec 5/6/7), drawover (Goldman), desflurane (Tec 6), measured flow",
              "Breathing systems: Mapleson A–F classification, circle system, scavenging",
              "CO2 absorbents: soda lime, Baralyme, Amsorb — reactions, compound A, CO production",
              "Checklist & pre-use testing: FDA checklist, leaks, low-pressure system test",
              "Suction equipment & medical gas outlets",
              "Oxygen failure: prevention devices, fail-safe, oxygen flush",
              "Universal anaesthetic machine standards (ISO 80601-2-13)"
            ],
            subLinks: ["","","","","","","","","",""]
          },
          {
            id: "safety-electrical",
            name: "Electrical Safety & Diathermy",
            refs: ["MM Ch.1", "DD Ch.8", "RCoA G2"],
            icon: "zap",
            sub: [
              "Electrosurgery: monopolar vs bipolar, circuit, dispersive pad",
              "Burns: diathermy pad burns, direct coupling, capacitive coupling",
              "Explosion risk: alcohol prep, bowel gas, laser surgery",
              "Fire triangle & airway fires",
              "Microshock & macroshock, leakage current",
              "Electrical safety: earthing, isolation transformers, RCD",
              "Equipotential grounding in critical care areas",
              "Electrical interference & shielding"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "infusion-devices",
            name: "Infusion Devices & Ventilators",
            refs: ["DD Ch.6", "DD Ch.7", "RCoA G2"],
            icon: "droplets",
            sub: [
              "Infusion pumps: syringe, peristaltic, volumetric, TCI (Diprifusor)",
              "Target Controlled Infusion (TCI) principles: Marsh, Schnider models",
              "PCA devices: programming, safety features, monitoring",
              "Ventilators: classification (pressure/volume, flow, cycling)",
              "Ventilator modes: VC, PC, PSV, SIMV, APRV, HFO",
              "Humidification: active (heated) vs passive (HME)",
              "Implantable devices: pacemaker, ICD, VAD — anaesthesia implications"
            ],
            subLinks: ["","","","","","",""]
          }
        ]
      },
      {
        id: "imaging-radiation",
        name: "Imaging & Radiation",
        topics: [
          {
            id: "radiology",
            name: "Radiology & Imaging",
            refs: ["RCoA G2"],
            icon: "scan",
            sub: [
              "X-ray production: tube, anode, filtration, collimation",
              "Image intensification & digital radiography",
              "CT: Hounsfield units, windowing, contrast, radiation dose",
              "MRI: magnetic field, gradients, RF pulses, T1/T2 weighting, safety (ferromagnetic)",
              "Ultrasound: B-mode, M-mode, colour Doppler, spectral Doppler",
              "C-arm fluoroscopy: safety, scatter radiation",
              "Contrast media: iodinated, gadolinium — reactions, nephrotoxicity"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "radiation-safety",
            name: "Radiation Safety & Protection",
            refs: ["RCoA G2"],
            icon: "shield",
            sub: [
              "ALARA principle, time/distance/shielding",
              "Dosimetry: film badge, TLD, OSL",
              "Ionising Radiation Regulations 2017",
              "Pregnancy & radiation: risk, dose limits, work restrictions",
              "Personal protective equipment: lead apron, thyroid shield, lead glasses"
            ],
            subLinks: ["","","","",""]
          }
        ]
      },
      {
        id: "clinical-physics",
        name: "Clinical Physics Topics",
        topics: [
          {
            id: "ultrasound-physics",
            name: "Ultrasound & Doppler Physics (Applied to Regional & Vascular Access)",
            refs: ["MM Ch.17", "DD Ch.4", "RCoA G2"],
            icon: "radio",
            sub: [
              "Piezoelectric effect & transducer design",
              "Frequency, wavelength, attenuation: depth/resolution trade-off",
              "Brightness mode (B-mode), Motion mode (M-mode)",
              "Colour Doppler & power Doppler: velocity estimation, aliasing",
              "Spectral Doppler: PW vs CW, angle correction, sample volume",
              "Tissue harmonic imaging & compound imaging",
              "Artefacts: acoustic shadowing, enhancement, reverberation, mirror, anisotropy",
              "Bioeffects: thermal index, mechanical index, safety (ALARA)",
              "Needle visualisation: echogenic needles, beam steering"
            ],
            subLinks: ["","","","","","","","",""]
          },
          {
            id: "humidifiers-filters",
            name: "Humidifiers, Filters & Breathing Circuits",
            refs: ["DD Ch.3", "DD Ch.7", "RCoA G2"],
            icon: "filter",
            sub: [
              "HME (Heat & Moisture Exchanging) filters: efficiency, dead space, resistance",
              "Active humidifiers: heated wire circuits, water baths",
              "Breathing circuit classification: Mapleson A–F, circle, Bain, coaxial",
              "Circuit resistance & work of breathing",
              "Scavenging: active vs passive, flow rates, safety"
            ],
            subLinks: ["","","","",""]
          }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────
  // CATEGORY 2 — Biochemistry, Cell Biology & Mathematics
  // ──────────────────────────────────────────────
  {
    id: "biochemistry-cell",
    name: "Biochemistry, Cell Biology & Mathematics",
    icon: "flask-conical",
    color: "#22c55e",
    sections: [
      {
        id: "cell-biology",
        name: "Cell & Molecular Biology",
        topics: [
          {
            id: "cell-structure",
            name: "Cell Structure & Function",
            refs: ["RCoA G2", "MM Ch.1"],
            icon: "dna",
            sub: [
              "Cell membrane: lipid bilayer, fluid mosaic model, ion channels, receptors",
              "Mitochondria: oxidative phosphorylation, ATP production",
              "Endoplasmic reticulum, Golgi apparatus, lysosomes, peroxisomes",
              "Cytoskeleton: microtubules, actin, intermediate filaments",
              "Nucleus: DNA, RNA, transcription, translation",
              "Cell cycle: G1, S, G2, M phases, mitosis vs meiosis",
              "Apoptosis & necrosis: pathways, caspases, Bcl-2 family",
              "Cell signalling: G-protein coupled receptors, tyrosine kinase receptors, second messengers",
              "Ion channels: voltage-gated, ligand-gated, mechanically gated"
            ],
            subLinks: ["","","","","","","","",""]
          },
          {
            id: "molecular-biology",
            name: "Molecular Biology & Genetics",
            refs: ["RCoA G2"],
            icon: "dna",
            sub: [
              "DNA replication, repair, recombination",
              "Transcription, RNA processing, alternative splicing",
              "Translation, post-translational modification",
              "Gene expression regulation: promoters, enhancers, transcription factors",
              "Mendelian inheritance: autosomal dominant/recessive, X-linked",
              "Pharmacogenomics: CYP450 polymorphisms, butyrylcholinesterase variants",
              "CRISPR & gene therapy: principles, applications",
              "Molecular techniques: PCR, Western blot, ELISA, sequencing"
            ],
            subLinks: ["","","","","","","",""]
          }
        ]
      },
      {
        id: "biochemistry",
        name: "Biochemistry & Metabolism",
        topics: [
          {
            id: "metabolism",
            name: "Metabolic Pathways",
            refs: ["RCoA G2", "MM Ch.22"],
            icon: "flask-conical",
            sub: [
              "Carbohydrate metabolism: glycolysis, gluconeogenesis, TCA cycle, ETC",
              "Lipid metabolism: beta-oxidation, ketogenesis, lipogenesis",
              "Protein metabolism: transamination, deamination, urea cycle",
              "Oxygen cascade: inspired to cellular, PaO2, SaO2, DO2, VO2",
              "Oxygen delivery & consumption: DO2, VO2, O2ER, critical DO2",
              "Lactate: aerobic vs anaerobic production, lactate shuttle, hyperlactataemia",
              "Acid-base chemistry: Henderson-Hasselbalch equation, strong ion difference (Stewart)",
              "buffer systems in blood: bicarbonate, phosphate, protein, haemoglobin"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "enzymes-proteins",
            name: "Enzymes & Proteins",
            refs: ["RCoA G2"],
            icon: "protein",
            sub: [
              "Enzyme kinetics: Michaelis-Menten, Vmax, Km, competitive/non-competitive inhibition",
              "Allosteric regulation & cooperativity (haemoglobin)",
              "Protein structure: primary, secondary, tertiary, quaternary",
              "Plasma proteins: albumin, globulins, acute phase reactants",
              "Haemoglobin: structure, O2 dissociation curve, 2,3-DPG, fetal Hb",
              "Myoglobin vs haemoglobin: O2 affinity, kinetics"
            ],
            subLinks: ["","","","","",""]
          }
        ]
      },
      {
        id: "mathematics-stats",
        name: "Mathematics & Statistics for Anaesthesia",
        topics: [
          {
            id: "maths",
            name: "Mathematical Principles",
            refs: ["RCoA G2", "MM Ch.1"],
            icon: "sigma",
            sub: [
              "Exponential function & decay: washout curves, time constants",
              "Logarithms: natural log, log10, log-linear plots",
              "Half-life calculation and time constants",
              "Dilution equations: C1V1 = C2V2",
              "Pharmacokinetic modelling: compartment models, volume of distribution",
              "Dose calculations: mg/kg, % solutions, molarity",
              "Electrical concepts: Ohm's law V=IR, power P=IV, capacitance Q=CV",
              "Units: SI prefixes, conversions, temperature (Celsius to Kelvin)"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "statistics",
            name: "Statistical Methods",
            refs: ["RCoA G2"],
            icon: "bar-chart",
            sub: [
              "Descriptive statistics: mean, median, mode, SD, SEM, range, IQR",
              "Normal distribution: z-scores, confidence intervals",
              "Hypothesis testing: null/alternative, type I & II errors, power",
              "Parametric tests: t-test (paired/unpaired), ANOVA, repeated measures",
              "Non-parametric tests: Mann-Whitney U, Wilcoxon, Kruskal-Wallis, Chi-squared, Fisher's exact",
              "Correlation & regression: Pearson, Spearman, linear regression, logistic regression",
              "Diagnostic test: sensitivity, specificity, PPV, NPV, likelihood ratios",
              "Survival analysis: Kaplan-Meier, Cox proportional hazards",
              "Meta-analysis: forest plot, funnel plot, heterogeneity (I²)",
              "Number Needed to Treat (NNT) & Number Needed to Harm (NNH)",
              "Relative risk, absolute risk, odds ratio",
              "Bland-Altman analysis: limits of agreement"
            ],
            subLinks: ["","","","","","","","","","","",""]
          }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────
  // CATEGORY 3 — Applied Anatomy
  // ──────────────────────────────────────────────
  {
    id: "applied-anatomy",
    name: "Applied Anatomy",
    icon: "bone",
    color: "#f59e0b",
    sections: [
      {
        id: "airway-anatomy",
        name: "Airway & Respiratory Anatomy",
        topics: [
          {
            id: "upper-airway",
            name: "Upper Airway Anatomy",
            refs: ["MM Ch.15", "MIL Ch.27", "RCoA G2"],
            icon: "larynx",
            sub: [
              "Nasal cavity, oral cavity, pharynx (nasopharynx, oropharynx, laryngopharynx)",
              "Larynx: cartilages (thyroid, cricoid, arytenoid, epiglottis), intrinsic muscles, recurrent laryngeal nerve",
              "Vocal cords: true vs false, rima glottidis, innervation",
              "Supraglottic region: vallecula, piriform fossae",
              "Blood supply: superior/inferior laryngeal arteries",
              "Lymphatic drainage of larynx & pharynx"
            ],
            subLinks: ["","","","","",""]
          },
          {
            id: "lower-airway",
            name: "Lower Airway & Thorax",
            refs: ["MM Ch.19", "MIL Ch.27", "RCoA G2"],
            icon: "lung",
            sub: [
              "Trachea: length, diameter, carina, bifurcation landmarks",
              "Bronchial tree: right vs left main bronchus, segmental bronchi",
              "Bronchopulmonary segments",
              "Pleura: parietal vs visceral, recesses, pleural spaces",
              "Mediastinum: boundaries, contents, divisions",
              "Thoracic inlet & outlet: structures, relationships",
              "Intercostal space: muscles, nerves, vessels"
            ],
            subLinks: ["","","","","","",""]
          }
        ]
      },
      {
        id: "cardiac-anatomy",
        name: "Cardiovascular Anatomy",
        topics: [
          {
            id: "heart-anatomy",
            name: "Heart & Great Vessels",
            refs: ["MM Ch.18", "MIL Ch.35", "RCoA G2"],
            icon: "heart",
            sub: [
              "Cardiac chambers: internal anatomy, valves, papillary muscles",
              "Coronary arteries: right, left (LAD, circumflex), dominance",
              "Coronary sinus & cardiac veins",
              "Conduction system: SA node, AV node, Bundle of His, Purkinje fibres",
              "Pericardium: fibrous & serous, pericardial sinuses",
              "Great vessels: aorta (arch branches), SVC, IVC, pulmonary trunk",
              "Fetal circulation: ductus venosus, foramen ovale, ductus arteriosus"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "vascular-anatomy",
            name: "Peripheral Vascular Anatomy for Access",
            refs: ["MM Ch.21", "MIL Ch.33", "RCoA G2"],
            icon: "activity",
            sub: [
              "Internal jugular vein: anatomy, triangles of neck, relationships",
              "Subclavian vein: infraclavicular approach, relationships",
              "Femoral vessels: femoral triangle, nerve relationship",
              "Radial & ulnar arteries: Allen's test, palmar arch",
              "Brachial artery & basilic/cephalic veins: PICC lines",
              "Axillary artery & brachial plexus relationships"
            ],
            subLinks: ["","","","","",""]
          }
        ]
      },
      {
        id: "neuroanatomy",
        name: "Neuroanatomy & Spine",
        topics: [
          {
            id: "brain-cranial",
            name: "Brain & Cranial Nerves",
            refs: ["MM Ch.24", "MIL Ch.37", "RCoA G2"],
            icon: "brain",
            sub: [
              "Cerebral hemispheres: lobes, functional areas, Broca's & Wernicke's",
              "Basal ganglia, thalamus, hypothalamus, limbic system",
              "Brainstem: midbrain, pons, medulla — cranial nerve nuclei",
              "Cerebellum: structure, function, connections",
              "Cranial nerves: I–XII, foramina, functions",
              "Cerebrospinal fluid: production, circulation, absorption",
              "Circle of Willis: arteries, variations, collateral flow",
              "Meninges: dura, arachnoid, pia — epidural/subdural/subarachnoid spaces"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "spine-nerve",
            name: "Spine & Spinal Cord",
            refs: ["MM Ch.17", "MIL Ch.33", "RCoA G2"],
            icon: "spine",
            sub: [
              "Vertebral column: 33 vertebrae, curvatures",
              "Spinal cord: segments, grey vs white matter, tracts (corticospinal, spinothalamic, dorsal columns)",
              "Spinal nerves: 31 pairs, dorsal/ventral roots, dermatomes, myotomes",
              "Meninges: dura, arachnoid, pia, epidural/intrathecal spaces",
              "Cauda equina & conus medullaris (L1-2 landmark)",
              "Ligamentum flavum, interspinous ligament, supraspinous ligament",
              "Blood supply of spinal cord: artery of Adamkiewicz (great anterior radicular artery)",
              "Vertebral venous plexus (Batson's plexus)"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "peripheral-nerves",
            name: "Peripheral Nervous System & Plexuses",
            refs: ["MM Ch.17", "MIL Ch.34", "RCoA G2"],
            icon: "nerve",
            sub: [
              "Brachial plexus: roots (C5-T1), trunks, divisions, cords, terminal nerves",
              "Lumbar plexus: T12-L4, femoral, obturator, lateral femoral cutaneous",
              "Sacral plexus: L4-S4, sciatic, pudendal, superior/inferior gluteal",
              "Cervical plexus: C1-C4, phrenic nerve (C3-5)",
              "Intercostal nerves: T1-T11, dermatomal distribution",
              "Dermatomes & myotomes: clinical significance for regional anaesthesia"
            ],
            subLinks: ["","","","","",""]
          }
        ]
      },
      {
        id: "regional-surface-anatomy",
        name: "Regional & Surface Anatomy",
        topics: [
          {
            id: "surface-anatomy",
            name: "Surface Anatomy & Landmarks",
            refs: ["MIL Ch.34", "RCoA G2"],
            icon: "map",
            sub: [
              "Neck: cricoid, thyroid cartilage, suprasternal notch, cricothyroid membrane",
              "Chest: intercostal spaces, angle of Louis, mid-clavicular line",
              "Abdomen: quadrants, McBurney's point, inguinal ligament",
              "Back: spinous processes, Tuffier's line (iliac crests L4)",
              "Anatomical snuff box, radial artery at wrist",
              "Femoral triangle, popliteal fossa"
            ],
            subLinks: ["","","","","",""]
          },
          {
            id: "anatomy-special",
            name: "Anatomy for Special Procedures",
            refs: ["RCoA G2"],
            icon: "target",
            sub: [
              "Tracheostomy: cricothyroidotomy, surgical airway anatomy",
              "Chest drain: safe triangle, intercostal approach",
              "Central line: IJ, SC, femoral — ultrasound anatomy",
              "Lumbar puncture & epidural: interspinous approach, paramedian",
              "Arterial line: radial, femoral, brachial, dorsalis pedis"
            ],
            subLinks: ["","","","",""]
          }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────
  // CATEGORY 4 — Physiology
  // ──────────────────────────────────────────────
  {
    id: "physiology",
    name: "Physiology for Anesthesia",
    icon: "activity",
    color: "#14b8a6",
    sections: [
      {
        id: "cardiovascular-physiology",
        name: "Cardiovascular Physiology",
        topics: [
          {
            id: "cardiac-physiology",
            name: "Cardiac Physiology",
            refs: ["MM Ch.18", "MIL Ch.35", "RCoA G2"],
            icon: "heart",
            sub: [
              "Cardiac cycle: pressure-volume loop, Wiggers diagram",
              "Action potential: phases 0-4, ion channels, pacemaker vs non-pacemaker",
              "Excitation-contraction coupling",
              "Frank-Starling mechanism, preload, afterload, contractility",
              "Starling forces & fluid compartments",
              "Cardiac output: determinants, measurement, Fick principle, thermodilution",
              "Coronary circulation: autoregulation, O2 supply/demand",
              "Myocardial oxygen consumption: determinants, measurement",
              "ECG: waves, intervals, axis, common abnormalities",
              "Baroreceptor reflex, chemoreceptor reflex, Bezold-Jarisch reflex",
              "Valsalva manoeuvre: phases, haemodynamic changes",
              "Autoregulation of blood flow (metabolic, myogenic, shear stress)",
              "Microcirculation: precapillary sphincters, exchange, lymphatics"
            ],
            subLinks: ["","","","","","","","","","","","",""]
          },
          {
            id: "cv-pathophysiology",
            name: "Pathophysiology of Cardiovascular Disease",
            refs: ["MM Ch.18", "MIL Ch.35"],
            icon: "activity",
            sub: [
              "Heart failure: systolic vs diastolic, HFpEF, HFrEF, compensation",
              "Valvular disease: AS, AR, MS, MR — haemodynamic impact",
              "Hypertension: systemic & pulmonary, end-organ effects",
              "Ischaemic heart disease: stable, unstable, NSTEMI, STEMI",
              "Cardiomyopathies: HCM, DCM, RCM, Takotsubo",
              "Pericardial disease: tamponade, constriction",
              "Arrhythmias: mechanisms (re-entry, automaticity, triggered), classification"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "fetal-circulation",
            name: "Fetal & Transitional Circulation",
            refs: ["MM Ch.27", "MIL Ch.47", "RCoA G3"],
            icon: "baby",
            sub: [
              "Fetal circulation: ductus venosus, foramen ovale, ductus arteriosus",
              "Transition at birth: closure of shunts, pulmonary circulation establishment",
              "Persistence of fetal circulation (PPHN)",
              "Cardiovascular changes with age (neonate to elderly)"
            ],
            subLinks: ["","","",""]
          },
          {
            id: "obstetric-cv-physiology",
            name: "Obstetric Cardiovascular Physiology",
            refs: ["MM Ch.26", "OX Ob"],
            icon: "heart",
            sub: [
              "Increased CO, SVR decrease, aortocaval compression",
              "Physiological anaemia of pregnancy",
              "Haemodynamic changes during labour & delivery",
              "Postpartum haemodynamic changes"
            ],
            subLinks: ["","","",""]
          }
        ]
      },
      {
        id: "respiratory-physiology",
        name: "Respiratory Physiology",
        topics: [
          {
            id: "resp-physiology",
            name: "Respiratory Mechanics & Gas Exchange",
            refs: ["MM Ch.19", "MIL Ch.36", "RCoA G2"],
            icon: "lung",
            sub: [
              "Lung volumes & capacities: TLC, FRC, RV, VC, FEV1, FVC",
              "Spirometry & flow-volume loops: obstructive vs restrictive patterns",
              "Compliance: static (lung, chest wall, total), dynamic, specific",
              "Airway resistance: Poiseuille, laminar vs turbulent flow, site of resistance",
              "Work of breathing: elastic, resistive, inertial components",
              "Ventilation-perfusion matching: ideal V/Q, shunt, dead space, West zones",
              "Hypoxic pulmonary vasoconstriction: mechanism, clinical significance",
              "Diffusion: Fick's law, DLCO, diffusion limitation vs perfusion limitation",
              "Oxygen cascade: inspired O2 to mitochondria",
              "Oxygen content, delivery, consumption, extraction ratio",
              "Carbon dioxide transport: dissolved, bicarbonate, carbamino compounds",
              "Control of breathing: central/peripheral chemoreceptors, response to CO2/O2/pH",
              "Effects of anaesthesia on respiratory physiology: FRC, V/Q mismatch, HPV"
            ],
            subLinks: ["","","","","","","","","","","","",""]
          },
          {
            id: "resp-pathophysiology",
            name: "Pathophysiology of Respiratory Disease",
            refs: ["MM Ch.19", "MIL Ch.36"],
            icon: "activity",
            sub: [
              "COPD: emphysema vs chronic bronchitis, static/dynamic hyperinflation, auto-PEEP",
              "Asthma: airway hyperreactivity, bronchospasm, gas trapping",
              "Restrictive lung disease: interstitial fibrosis, obesity, neuromuscular, chest wall",
              "Acute respiratory distress syndrome (ARDS): pathogenesis, Berlin definition",
              "Obstructive sleep apnoea: pathophysiology, CV consequences",
              "Pulmonary hypertension: WHO groups, pathophysiology"
            ],
            subLinks: ["","","","","",""]
          }
        ]
      },
      {
        id: "renal-physiology",
        name: "Renal Physiology",
        topics: [
          {
            id: "renal-physiology",
            name: "Renal Physiology & Fluid Balance",
            refs: ["MM Ch.22", "RCoA G2"],
            icon: "kidney",
            sub: [
              "Renal blood flow & autoregulation, GFR, filtration fraction",
              "Tubular function: proximal, loop of Henle, distal, collecting duct",
              "Solute & water handling: Na, K, HCO3, glucose, urea, concentrating/diluting",
              "Acid-base regulation: HCO3 reabsorption, NH3 buffering, titratable acid",
              "Renal hormones: renin, erythropoietin, vitamin D, prostaglandins",
              "RAAS: renin-angiotensin-aldosterone axis",
              "Fluid compartments: ECF, ICF, Starling forces, third spacing",
              "Body fluid osmolality & tonicity: ADH, thirst, regulation",
              "Hepatic function measurement: bilirubin, albumin, INR, ammonia, LFTs"
            ],
            subLinks: ["","","","","","","","",""]
          },
          {
            id: "renal-pathophysiology",
            name: "Pathophysiology of Renal Disease",
            refs: ["MM Ch.22", "RCoA G4"],
            icon: "activity",
            sub: [
              "Acute Kidney Injury: pre-renal, intrinsic, post-renal; RIFLE/AKIN/KDIGO",
              "Chronic Kidney Disease: staging, complications (anaemia, uraemia, electrolytes)",
              "Hepatorenal syndrome: pathophysiology, diagnosis, management"
            ],
            subLinks: ["","",""]
          },
          {
            id: "obstetric-renal",
            name: "Obstetric Renal Physiology",
            refs: ["MM Ch.26"],
            icon: "kidney",
            sub: [
              "Increased GFR, decreased creatinine, glycosuria",
              "Renal effects of pre-eclampsia",
              "Fluid balance in labour & postpartum"
            ],
            subLinks: ["","",""]
          }
        ]
      },
      {
        id: "hepatic-physiology",
        name: "Hepatic Physiology",
        topics: [
          {
            id: "hepatic-physiology",
            name: "Liver Physiology",
            refs: ["MM Ch.22", "RCoA G2"],
            icon: "liver",
            sub: [
              "Liver blood flow: hepatic artery, portal vein, autoregulation",
              "Hepatic function: synthetic (albumin, coagulation factors), metabolic (carb, lipid, protein), storage",
              "Bile production & enterohepatic circulation",
              "Biotransformation: phase I (CYP450) & phase II (conjugation) reactions",
              "Protein binding & drug distribution",
              "Hepatic function measurement: bilirubin, albumin, INR, ammonia, indocyanine green clearance",
              "Hepatic clearance: extraction ratio, first-pass effect, flow-limited vs capacity-limited"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "hepatic-pathophysiology",
            name: "Hepatic Pathophysiology & Failure",
            refs: ["MM Ch.22", "RCoA G4"],
            icon: "activity",
            sub: [
              "Cirrhosis: portal hypertension, varices, ascites",
              "Hepatic encephalopathy: ammonia theory, precipitating factors",
              "Coagulopathy in liver disease",
              "Acute liver failure: ICP considerations, transplant listing",
              "Child-Pugh & MELD scoring"
            ],
            subLinks: ["","","","",""]
          }
        ]
      },
      {
        id: "neurophysiology",
        name: "Neurophysiology",
        topics: [
          {
            id: "neurophysiology",
            name: "Nervous System Physiology",
            refs: ["MM Ch.24", "RCoA G2"],
            icon: "brain",
            sub: [
              "Resting membrane potential: Nernst equation, Goldman-Hodgkin-Katz",
              "Action potential generation & propagation: Na+ & K+ channels",
              "Synaptic transmission: neurotransmitter release, postsynaptic potentials",
              "Sensory system: receptors, dermatomes, pathways (spinothalamic, dorsal columns)",
              "Motor system: corticospinal tract, basal ganglia, cerebellum",
              "Autonomic nervous system: sympathetic (thoracolumbar), parasympathetic (craniosacral)",
              "Cerebral blood flow: autoregulation, CO2 reactivity, O2 reactivity, CMR",
              "Cerebral perfusion pressure: CPP = MAP - ICP (or CVP)",
              "Intracranial pressure: Monro-Kellie doctrine, pressure-volume curve",
              "Cerebrospinal fluid: production, composition, circulation, absorption"
            ],
            subLinks: ["","","","","","","","","",""]
          },
          {
            id: "pain-physiology",
            name: "Pain Physiology (Nociception & Pain Pathways)",
            refs: ["MM Ch.30", "OX Pain", "RCoA G2"],
            icon: "triangle-alert",
            sub: [
              "Nociception: transduction, transmission, modulation, perception",
              "A-delta, C fibres, A-beta — function, myelination, conduction velocity",
              "Spinothalamic tract, spinoreticular tract, spinomesencephalic tract",
              "Descending modulatory pathways: PAG, RVM, noradrenergic, serotonergic",
              "Gate control theory of pain",
              "Neuroplasticity: peripheral sensitisation, central sensitisation, wind-up",
              "Referred pain: convergence-projection theory",
              "Visceral vs somatic pain: characteristics, pathways"
            ],
            subLinks: ["","","","","","","",""]
          }
        ]
      },
      {
        id: "endocrine-physiology",
        name: "Endocrine Physiology",
        topics: [
          {
            id: "endocrine-physiology",
            name: "Endocrine System",
            refs: ["MM Ch.23", "RCoA G2"],
            icon: "gauge",
            sub: [
              "Hypothalamic-pituitary axis: feedback loops, hormones",
              "Thyroid: T4, T3, calcitonin, regulation, actions",
              "Adrenal cortex: cortisol, aldosterone, DHEA — synthesis, regulation",
              "Adrenal medulla: catecholamines — synthesis, storage, release",
              "Pancreatic hormones: insulin, glucagon, somatostatin",
              "Calcium homeostasis: PTH, vitamin D, calcitonin",
              "Stress response: neuroendocrine, metabolic, inflammatory"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "obstetric-endocrine",
            name: "Obstetric Endocrine Physiology",
            refs: ["MM Ch.26"],
            icon: "baby",
            sub: [
              "Placental hormones: hCG, hPL, progesterone, oestrogen",
              "Endocrine changes in pregnancy: cortisol, thyroid, aldosterone",
              "Lactation physiology: prolactin, oxytocin, milk ejection reflex"
            ],
            subLinks: ["","",""]
          }
        ]
      },
      {
        id: "muscle-physiology",
        name: "Muscle & Neuromuscular Physiology",
        topics: [
          {
            id: "muscle-physiology",
            name: "Skeletal, Cardiac & Smooth Muscle",
            refs: ["MM Ch.11", "MIL Ch.32", "RCoA G2"],
            icon: "dumbbell",
            sub: [
              "Excitation-contraction coupling: T-tubules, sarcoplasmic reticulum, Ca2+",
              "Sliding filament theory: actin, myosin, cross-bridge cycling",
              "Neuromuscular junction: ACh synthesis, release, receptors (nicotinic), degradation",
              "Muscle fibre types: type I (slow), type IIa (fast oxidative), type IIb (fast glycolytic)",
              "Motor unit recruitment: Henneman's size principle",
              "Cardiac vs skeletal vs smooth muscle contraction",
              "Smooth muscle: multi-unit vs single-unit, Ca2+ sensitisation, myosin light chain kinase",
              "Muscle spindle & Golgi tendon organ: stretch reflex, autogenic inhibition"
            ],
            subLinks: ["","","","","","","",""]
          },
          {
            id: "nmj-disorders",
            name: "Pathophysiology of NMJ & Muscle Disorders",
            refs: ["MM Ch.11", "MIL Ch.32"],
            icon: "activity",
            sub: [
              "Myasthenia gravis: anti-AChR antibodies, Lambert-Eaton, botulism",
              "Muscular dystrophies: Duchenne, Becker, myotonic dystrophy",
              "Malignant hyperthermia: ryanodine receptor (RYR1) mutation, Ca2+ release",
              "Plasma cholinesterase deficiency: genetics, dibucaine number, fluoride number"
            ],
            subLinks: ["","","",""]
          }
        ]
      },
      {
        id: "immune-haem-physiology",
        name: "Immunology & Haematology Physiology",
        topics: [
          {
            id: "immunology",
            name: "Immunology & Inflammation",
            refs: ["MM Ch.22", "RCoA G2"],
            icon: "shield",
            sub: [
              "Innate vs adaptive immunity: components, coordination",
              "Cytokines: interleukins, TNF-alpha, interferons, chemokines",
              "Acute phase response: CRP, procalcitonin, complement",
              "Hypersensitivity reactions: Gell-Coombs I–IV",
              "Anaphylaxis: IgE-mediated, non-IgE mediated, tryptase release",
              "Transfusion reactions: acute haemolytic, delayed, allergic, febrile",
              "Transplant immunology: HLA matching, immunosuppression, rejection"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "haematology",
            name: "Haematology & Haemostasis",
            refs: ["MM Ch.22", "RCoA G2"],
            icon: "droplets",
            sub: [
              "Erythropoiesis: EPO, iron metabolism, B12, folate",
              "Leucocytes: types, differentiation, functions",
              "Platelet production & function: adhesion, aggregation, secretion",
              "Coagulation cascade: intrinsic, extrinsic, common pathway",
              "Natural anticoagulants: antithrombin, protein C/S, TFPI",
              "Fibrinolysis: plasminogen, tPA, PAI-1, D-dimer",
              "Blood groups: ABO, Rh, compatibility testing"
            ],
            subLinks: ["","","","","","",""]
          }
        ]
      },
      {
        id: "gi-physiology",
        name: "Gastrointestinal Physiology",
        topics: [
          {
            id: "gi-physiology",
            name: "GI Tract Physiology",
            refs: ["MM Ch.22", "RCoA G2"],
            icon: "utensils-crossed",
            sub: [
              "Gastric function: acid secretion, motility, emptying",
              "Hepatic function: synthetic, metabolic, storage",
              "Pancreatic exocrine function: enzyme and bicarbonate secretion",
              "Intestinal absorption: nutrients, fluids, electrolytes",
              "Splanchnic circulation: autoregulation, effects of anaesthesia",
              "Nausea & vomiting: emetic pathway, neurotransmitters, receptors",
              "Gut microbiome: relevance to perioperative medicine"
            ],
            subLinks: ["","","","","","",""]
          },
          {
            id: "obstetric-gi",
            name: "Obstetric GI Physiology",
            refs: ["MM Ch.26"],
            icon: "baby",
            sub: [
              "Gastric emptying in pregnancy: delayed, increased aspiration risk",
              "Placental nutrient transfer",
              "Liver function changes in pregnancy"
            ],
            subLinks: ["","",""]
          }
        ]
      },
      {
        id: "temperature-physiology",
        name: "Temperature Regulation",
        topics: [
          {
            id: "temp-regulation",
            name: "Thermoregulation",
            refs: ["MM Ch.21", "RCoA G2"],
            icon: "thermometer",
            sub: [
              "Heat production: basal metabolic rate, shivering, non-shivering thermogenesis",
              "Heat loss: radiation, conduction, convection, evaporation",
              "Hypothalamic regulation: set-point, peripheral & central thermoreceptors",
              "Response to cold: vasoconstriction, shivering, behavioural",
              "Response to heat: vasodilation, sweating, behavioural",
              "Effects of anaesthesia on thermoregulation: impaired, redistribution",
              "Perioperative hypothermia: causes, complications (coagulopathy, SSI, cardiac events)",
              "Malignant hyperthermia: pathophysiology, genetics (RYR1), treatment"
            ],
            subLinks: ["","","","","","","",""]
          }
        ]
      },
      {
        id: "ageing-physiology",
        name: "Physiology of Ageing",
        topics: [
          {
            id: "ageing",
            name: "Physiological Changes with Ageing",
            refs: ["MM Ch.28", "RCoA G4"],
            icon: "clock",
            sub: [
              "Cardiovascular: decreased compliance, LVH, diastolic dysfunction, reduced response to catecholamines",
              "Respiratory: decreased FRC, chest wall compliance, gas exchange, airway reflexes",
              "Renal: decreased GFR, drug clearance, concentrating ability",
              "Hepatic: decreased mass, blood flow, drug metabolism",
              "Neurological: decreased CBF, cognitive reserve, increased sensitivity to anaesthetics",
              "Musculoskeletal: sarcopenia, osteoporosis, reduced functional capacity",
              "Pharmacokinetic/pharmacodynamic changes: increased sensitivity, prolonged effects"
            ],
            subLinks: ["","","","","","",""]
          }
        ]
      },
      {
        id: "exercise-physiology",
        name: "Exercise Physiology & Integrated Responses",
        topics: [
          {
            id: "exercise",
            name: "Physiological Response to Exercise",
            refs: ["RCoA G2"],
            icon: "running",
            sub: [
              "Cardiovascular response: HR, SV, CO, BP, blood flow redistribution",
              "Respiratory response: ventilation, V/Q matching, gas exchange",
              "Metabolic response: aerobic vs anaerobic, lactate threshold, VO2 max",
              "Oxygen debt & EPOC (Excess Post-Exercise Oxygen Consumption)",
              "Fitness assessment: METs, Duke Activity Status Index, CPET",
              "Preoperative CPET: AT, VE/VCO2, O2 pulse — risk stratification"
            ],
            subLinks: ["","","","","",""]
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