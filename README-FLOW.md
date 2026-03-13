# My Portfolio – End-to-End Documentation

## Overview
This project is a modern, responsive developer portfolio built with React, TypeScript, and Vite. It showcases your skills, achievements, certificates, projects, and contact information in a visually engaging and interactive way.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Setup & Installation](#setup--installation)
3. [Core Features](#core-features)
4. [Component Breakdown](#component-breakdown)
5. [Data Management](#data-management)
6. [Styling & Animations](#styling--animations)
7. [Customization Guide](#customization-guide)
8. [Deployment](#deployment)
9. [Credits](#credits)

---

## Project Structure
```
my-portfolio/
  ├── public/                # Static assets (SVGs, HTML)
  ├── src/
  │   ├── assets/            # Images, resume PDF, SVGs
  │   ├── components/        # React components (Hero, About, Skills, etc.)
  │   ├── data/              # metadata.json (all portfolio content)
  │   ├── App.tsx            # Main app entry
  │   ├── App.css            # Global styles
  │   └── main.tsx           # React/Vite bootstrap
  ├── package.json           # Project metadata & scripts
  ├── vite.config.js         # Vite configuration
  └── README.md              # Vite/React template info
```

---

## Setup & Installation
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd my-portfolio
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Build for production:**
   ```sh
   npm run build
   ```
5. **Preview production build:**
   ```sh
   npm run preview
   ```

---

## Core Features
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

## Component Breakdown
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

## Data Management
- **metadata.json:**
  - Central source for all content (name, about, skills, certificates, achievements, projects, education, contact links, resume path).
  - Update this file to change portfolio content.
- **Assets:**
  - Place your profile image and resume PDF in `src/assets/`.
  - Update paths in `metadata.json` accordingly.

---

## Styling & Animations
- **App.css:**
  - Global styles, section layouts, chips, carousels, and custom animations (e.g., animated "Get in Touch" heading).
- **Responsive:**
  - Uses CSS grid/flex for mobile and desktop layouts.
- **Custom Animations:**
  - Section headings (e.g., wiggle, bounce, zoom for "Get in Touch").
  - Chips for section counts.

---

## Customization Guide
- **Change Content:** Edit `src/data/metadata.json`.
- **Add/Replace Resume:** Place your PDF in `src/assets/` and update the `resume` path in `metadata.json`.
- **Update Images:** Place new images in `src/assets/` and update paths in `metadata.json`.
- **Add/Remove Sections:** Edit `App.tsx` and corresponding component files.
- **Change Animations/Styles:** Edit `App.css`.

---

## Deployment
1. **Build the app:**
   ```sh
   npm run build
   ```
2. **Deploy the `dist/` folder** to your preferred static hosting (Vercel, Netlify, GitHub Pages, etc.).

---

## Credits
- Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/).
- Icons from [react-icons](https://react-icons.github.io/react-icons/).
- Animations and design by Hariharan Sandhrasekar.

---

For further customization or questions, see the code comments in each component or contact the project author.
