# Hariharan S Portfolio

A modern, responsive portfolio built with React, TypeScript, and Vite.  
Live: [https://hariharan-s5.github.io/MyPortfolio/](https://hariharan-s5.github.io/MyPortfolio/)

## Description

Showcase your achievements, certificates, projects, skills, education, and contact info in a single-page web app.  
Fully customizable, fast, and deployable to GitHub Pages.

---

## Table of Contents
1.  [How to Download & Install](#How-to-Download--Install)
2.  [Project Structure](#Project-Structure)
3.  [Workflow & Architecture](#Workflow--Architecture)
4.  [Core Features](#Core-Features)
5.  [Component Breakdown](#Component-Breakdown)
6.  [Data Management](#data-management)
7.  [Styling & Animations](#styling--animations)
8.  [Customization Guide](#customization-guide)
9.  [Deployment](#deployment)
10. [Credits](#credits)

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



# Core Features

- **Hero Section:** Name, title, animated greeting, social/contact links, and resume download.
- **About Section:** Profile image, about text, and location.
- **Skills Section:** Paginated, icon-enhanced skill grid.
- **Certificates & Achievements:** Carousel display with navigation.
- **Projects:** Categorized, paginated, with live/code links and images.
- **Education:** Academic history.
- **Contact:** Gmail-style email, social links, animated "Get in Touch" heading.
- **Responsive Design:** Mobile-friendly layout.
- **Custom Animations:** Section headings, chips, and interactive elements.

---

# Component Breakdown

- **App.tsx:** Main layout, imports metadata, passes data to all sections.
- **Header.tsx:** Navigation bar with anchor links.
- **Hero.tsx:** Home section, animated greeting, social/contact icons, resume download (PDF in `src/assets`).
- **About.tsx:** About text, profile image, location.
- **Skills.tsx:** Paginated skill grid, icons for major technologies.
- **Certificates.tsx:** Carousel for certificates, with navigation.
- **Achievements.tsx:** Carousel for achievements, with navigation.
- **Projects.tsx:** Categorized, paginated project cards.
- **Education.tsx:** Academic history.
- **Contact.tsx:** Animated heading, Gmail-style email, social links.

---

# Data Management

- **metadata.json:**
  - Central source for all content (name, about, skills, certificates, achievements, projects, education, contact links, resume path).
  - Update this file to change portfolio content.
- **Assets:**
  - Place your profile image and resume PDF in `src/assets/`.
  - Update paths in `metadata.json` accordingly.

---

# Styling & Animations

- **App.css:**
  - Global styles, section layouts, chips, carousels, and custom animations (e.g., animated "Get in Touch" heading).
- **Responsive:**
  - Uses CSS grid/flex for mobile and desktop layouts.
- **Custom Animations:**
  - Section headings (e.g., wiggle, bounce, zoom for "Get in Touch").
  - Chips for section counts.

---

# Customization Guide

- **Change Content:** Edit `src/data/metadata.json`.
- **Add/Replace Resume:** Place your PDF in `src/assets/` and update the `resume` path in `metadata.json`.
- **Update Images:** Place new images in `src/assets/` and update paths in `metadata.json`.
- **Add/Remove Sections:** Edit `App.tsx` and corresponding component files.
- **Change Animations/Styles:** Edit `App.css`.

---

# Credits

- Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/).
- Icons from [react-icons](https://react-icons.github.io/react-icons/).
- Animations and design by Hariharan Sandhrasekar.

---



