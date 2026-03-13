# Hariharan S Portfolio

A modern, responsive portfolio built with React, TypeScript, and Vite.  
Live: [https://hariharan-s5.github.io/MyPortfolio/](https://hariharan-s5.github.io/MyPortfolio/)

## Description

Showcase your achievements, certificates, projects, skills, education, and contact info in a single-page web app.  
Fully customizable, fast, and deployable to GitHub Pages.

---

## How to Download & Install

1. **Clone the repository:**
  ```
  git clone https://github.com/Hariharan-S5/MyPortfolio.git
  cd MyPortfolio
  ```

2. **Install dependencies:**
  ```
  npm install
  ```

3. **Run locally:**
  ```
  npm run dev
  ```

4. **Build for production:**
  ```
  npm run build
  ```

5. **Preview production build:**
  ```
  npm run preview
  ```

6. **Deploy to GitHub Pages:**
  ```
  npm run deploy
  ```

---

## Project Structure

```
my-portfolio/
│
├── public/
│   ├── assets/                # Static images, SVGs, PDFs
│   ├── certificate-viewer.html
│   ├── blue-rounded.svg
│   └── ...other static files
│
├── src/
│   ├── assets/                # App-specific images
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Certificates.tsx
│   │   ├── Achievements.tsx
│   │   ├── Projects.tsx
│   │   ├── Education.tsx
│   │   └── Contact.tsx
│   ├── data/
│   │   └── metadata.json      # Portfolio content (editable)
│   ├── App.tsx                # Main app layout
│   ├── main.tsx               # Entry point
│   ├── App.css                # App styles
│   └── index.css              # Global styles
│
├── index.html                 # Root HTML
├── package.json               # Project config & scripts
├── vite.config.ts             # Vite config (base path for GitHub Pages)
├── tsconfig*.json             # TypeScript configs
└── README.md                  # Project documentation
```

---

## Workflow & Architecture

- **App.tsx**: Main layout, imports all sections and passes metadata.
- **main.tsx**: React entry point, renders App.
- **components/**: Each file is a section (Header, Hero, About, etc.), receives props from metadata.json.
- **data/metadata.json**: All portfolio content (name, title, skills, certificates, achievements, projects, education, contact).
- **public/assets/**: Static files (images, PDFs, SVGs).
- **Styles**: App.css and index.css for styling.

**Flow:**
1. App loads metadata.json.
2. App.tsx passes data to each section component.
3. Components render content dynamically.
4. Static assets are loaded from public/assets.

---

## Technologies Used

- React 19
- TypeScript
- Vite
- React Icons
- ESLint
- GitHub Pages (gh-pages)

---


## Conclusion

This portfolio is easy to customize, fast to deploy, and visually appealing.  
Edit `src/data/metadata.json` to update your content.  
Contributions and feedback are welcome!

---
