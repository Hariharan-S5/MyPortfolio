# 🚀 Hariharan-s Developer Portfolio

A modern, high-performance, and fully dynamic developer portfolio built with **React**, **Vite**, and **Tailwind CSS**. This project features a built-in **Admin Dashboard** (CMS) for real-time content updates without touching the code.

---

## ✨ Features

- **⚡ Blazing Fast**: Built with Vite and React for instant loading.
- **🎨 Premium UI**: Beautiful SaaS-style design with **Framer Motion** animations.
- **🛠️ Admin Dashboard**: Dedicated CMS to update profile info, projects, skills, and certificates.
- **📱 Fully Responsive**: Optimized for all devices (Mobile, Tablet, Desktop).
- **📦 Static Hosting**: Seamlessly deployed on **GitHub Pages**.
- **🤖 Automation**: Python script included for one-command GitHub updates.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Vanilla CSS
- **Icons**: Lucide-React, React-Icons
- **Animations**: Framer Motion
- **Deployment**: GitHub Pages (`gh-pages`)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** and **npm** installed on your system.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Hariharan-S5/MyPortfolio.git
cd MyPortfolio
npm install
```

### 3. Local Development
Run the development server locally:
```bash
npm run dev
```
The site will be available at `http://localhost:5173`.

---

## 🔐 Admin Dashboard (CMS)

The project includes a secure Admin Panel to manage your data dynamically:
1.  Scroll to the **Footer** of your site.
2.  Click the **Lock Icon** (Secret Tool).
3.  Enter your access key.
4.  Edit your content directly in the UI.

> [!NOTE]
> To save changes automatically to your local `metadata.json`, you must be running the site locally using `npm run dev`.

---

## 📡 Deployment

This project is configured for **GitHub Pages**. To deploy your latest changes:

```bash
npm run deploy
```
This will build the project and push the `dist/` folder to the `gh-pages` branch.

---

## 🐍 Automation Script (`update_portfolio.py`)

I have included a Python script to automate your workflow. Running this script will:
- Stage all changes.
- Commit with a message of your choice.
- Push to the main GitHub repository.
- Optionally run the deployment script for you.

**How to use:**
```bash
python update_portfolio.py
```

---

## 📁 Project Structure

```text
├── public/                # Static assets (Favicons, images)
├── src/
│   ├── components/        # UI components & Sections
│   ├── data/
│   │   └── metadata.json  # Centralized portfolio content
│   ├── utils/             # Helper functions (Asset paths, etc.)
│   └── main.jsx           # App entry point
├── update_portfolio.py    # Automation script
└── vite.config.js         # Build configuration
```

---

## 📄 License
This project is for personal use. Feel free to use it as a template for your own developer portfolio.

Built with ❤️ by **Hariharan-s**
