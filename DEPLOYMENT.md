# Deployment Guide

Follow these steps to update your website and deploy the latest changes to GitHub Pages.

## Step 1: Save your changes locally (Git)
Before deploying, you should save your code changes to your repository's history.

1.  **Stage all changes:**
    ```powershell
    git add .
    ```
2.  **Commit with a message:**
    ```powershell
    git commit -m "Your description of what you changed"
    ```

---

## Step 2: Synchronize with GitHub
Ensure your local code matches the latest version on the server.

1.  **Pull latest updates (Safety step):**
    ```powershell
    git pull origin main --rebase
    ```
2.  **Push your commit to GitHub:**
    ```powershell
    git push origin main
    ```

---

## Step 3: Deploy to GitHub Pages
This step builds the production version of your site and uploads it to the live link.

1.  **Run the deployment script:**
    ```powershell
    npm run deploy
    ```

---

## Quick Summary Checklist
Whenever you want your changes to go live, run these commands in order:
1. `git add .`
2. `git commit -m "update message"`
3. `git push origin main`
4. `npm run deploy`

Your live site: [https://hariharan-s5.github.io/MyPortfolio/](https://hariharan-s5.github.io/MyPortfolio/)
