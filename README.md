# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


React + Vite project and want to host it on GitHub Pages. I’ll give you a step-by-step guide so your portfolio can go live. We'll make it simple and clear.

Step 1: Install gh-pages

This package helps deploy your dist folder to GitHub Pages.

npm install --save-dev gh-pages
Step 2: Add homepage in package.json

Add the URL where your site will be hosted.

If your GitHub username is your-username and the repo is my-portfolio:

"homepage": "https://your-username.github.io/my-portfolio"
Step 3: Update package.json scripts

Add deploy scripts:

"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

Explanation:

predeploy → builds the project before deploying

deploy → pushes the dist folder to GitHub Pages

Step 4: Configure vite.config.ts for GitHub Pages

Update your vite.config.ts (or vite.config.js) to handle the base path:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-portfolio/'  // <-- use your repo name here
});

This ensures your paths work correctly on GitHub Pages.

Step 5: Build and Deploy

Now, deploy your app:

npm run deploy

This will:

Build your project into dist/

Push dist/ to gh-pages branch

Your project will be live at https://your-username.github.io/my-portfolio

Step 6: Enable GitHub Pages

Go to your repo on GitHub.

Settings → Pages → Branch: gh-pages → Save

Wait a minute → your site should be live.

✅ Bonus Tip: Testing locally
You can run:

npm run preview

It simulates the production build so you can test paths before deploying.

If you want, I can give you a ready-to-use updated package.json and vite.config.ts that’s perfectly set up for GitHub Pages, so you just copy-paste and deploy.