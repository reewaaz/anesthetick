# Anesthetick

> A comprehensive, modern anesthesia study planner for **EDAIC** and **FRCA** exam preparation.
> The name combines **Anesthesia** + **Tick** (checkmark) — track your progress one tick at a time.

[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet?style=flat-square)](https://reewaaz.github.io/anesthetick/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Features

- **📚 Complete Curriculum** — Covers all major anesthesia topics: Equipment, Pharmacology, Physiology, Anesthetic Management, Subspecialty Anesthesia, Pain Medicine, Critical Care, Complications, Basic Sciences, Professional Practice, and Emerging Topics.
- **✅ Progress Tracking** — Check off learning objectives as you master them. Progress is saved locally in your browser (localStorage).
- **🔖 Bookmarks** — Save important topics for quick access later.
- **🔍 Full-Text Search** — Search across topic names, subtopics, and references with highlighted results.
- **🌓 Dark & Light Themes** — Choose your preferred theme. Dark mode by default with a clean light mode option.
- **📱 PWA Ready** — Install as a standalone app on your phone or desktop for offline study.
- **📐 Mobile-First Design** — Material Design 3-inspired interface optimized for mobile with responsive desktop layouts.
- **📄 Resource Links** — Direct links to OpenAnesthesia, YouTube tutorials, Deranged Physiology, and other high-quality resources.

---

## 🚀 Getting Started

### Online

Visit **[https://reewaaz.github.io/anesthetick/](https://reewaaz.github.io/anesthetick/)** and start studying immediately.

### Local Development

```bash
git clone https://github.com/reewaaz/anesthetick.git
cd anesthetick
# No build step needed — open index.html in a browser
# Or serve with any HTTP server:
npx serve .
```

### Install as PWA

1. Open the app in Chrome, Edge, or a compatible browser.
2. Tap the **Install** banner at the bottom (or go to **Settings > Install App**).
3. The app will now work offline with saved progress.

---

## 📖 Curriculum Structure

The curriculum is organized into **11 categories**, each with multiple **sections** and **topics**:

| Category | Topics | Focus |
|---|---|---|
| Anesthetic Equipment & Monitoring | ~35 | Workstation, circuits, ventilators, airway equipment, monitoring, safety |
| Pharmacology | ~35 | PK/PD, inhalational/IV agents, opioids, NMBAs, local anesthetics, CV drugs |
| Physiology for Anesthesia | ~30 | CVS, respiratory, renal, hepatic, endocrine, neurophysiology, acid-base, blood |
| Anesthetic Management | ~30 | Preop, airway, GA technique, regional, MAC, fluids, positioning |
| Subspecialty Anesthesia | ~40 | Cardiac, thoracic, neuro, obstetric, pediatric, pain, trauma, transplant, ophthalmic, ortho, endocrine, GU |
| Pain Medicine | ~10 | Pain pathways, acute/chronic pain, cancer pain, interventions |
| Critical Care Medicine | ~15 | Resuscitation, ventilation, sepsis, organ support, neuro ICU |
| Perioperative Complications | ~15 | Airway/CV/neuro emergencies, MH, anaphylaxis, PONV, nerve injury |
| Basic Sciences & Statistics | ~8 | Physics, stats, anatomy |
| Anesthesia Practice & Safety | ~8 | Human factors, ethics, exam preparation |
| Emerging Topics | ~20 | AI, digital health, novel drugs, advanced monitoring, ventilation advances, regional updates, pediatric updates |

---

## 🧠 Study Tips

- **Start with Equipment & Monitoring** — These concepts underpin everything else.
- **Use the checkbox system** — Track your progress by checking off individual learning objectives.
- **Reference the textbook abbreviations** — Each topic lists relevant chapters from Morgan & Mikhail (MM), Miller's (MIL), Dorsch & Dorsch (DD), and free online resources.
- **Follow resource links** — Click through to OpenAnesthesia, YouTube, and other curated resources for deeper understanding.
- **Review your progress** — The Progress view shows completion rates by category.

---

## 🛠 Technology

| Technology | Purpose |
|---|---|
| Vanilla JS (ES6) | No framework — lightweight, fast, zero dependencies |
| CSS Custom Properties | Dynamic theming (dark/light) |
| PWA (Service Worker) | Offline support and installability |
| localStorage | Progress persistence on-device |
| Google Fonts (Inter) | Modern, readable typography |
| SVG Icons | Crisp, scalable icons at any resolution |

---

## 📁 File Structure

```
├── index.html        # App shell
├── app.js            # Application logic (SPA, state, views)
├── data.js           # Complete anesthesia curriculum database
├── styles.css        # All styles with dark/light themes
├── manifest.json     # PWA manifest
├── assets/
│   ├── icon.svg      # App icon (SVG)
│   ├── icon-192.png  # PWA icon 192x192
│   └── icon-512.png  # PWA icon 512x512
└── README.md         # This file
```

---

## 📚 References

Key textbooks referenced in the curriculum:

| Abbreviation | Textbook |
|---|---|
| **MM** | Morgan & Mikhail's Clinical Anesthesiology (6th ed) |
| **MIL** | Miller's Anesthesia (10th ed) |
| **DD** | Dorsch & Dorsch — Understanding Anesthesia Equipment (5th ed) |
| **PS** | PhysiologyWeb / Free open physiology texts |
| **OX** | OpenAnesthesia (openanesthesia.org) |
| **ATOTW** | Anaesthesia Tutorial of the Week (WFSA/AnaesthesiaUK) |

Free online resources linked throughout:
- [OpenAnesthesia](https://openanesthesia.org)
- [Deranged Physiology](https://derangedphysiology.com)
- [NYSORA](https://www.nysora.com)
- [Life in the Fast Lane](https://litfl.com)
- [Anaesthesia UK](https://www.anaesthesiauk.com)

---

## 🤝 Contributing

Contributions are welcome! Whether fixing typos, adding topics, improving descriptions, or suggesting features:

1. Fork the repository
2. Make your changes
3. Submit a pull request

The curriculum database lives in `data.js` — the structure is straightforward arrays and objects. See existing topics for format reference.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made for anesthesia trainees, by anesthesia trainees.<br>
  <em>Not affiliated with EBA/ESAIC or the RCoA.</em>
</p>
