import subprocess
import os
import sys

def run_command(command):
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if e.stderr:
            print(e.stderr)
        return False

def update_portfolio():
    print("Starting Portfolio Update to GitHub...")
    
    # 1. Add all changes
    if not run_command("git add ."):
        print("Failed to stage changes.")
        return

    # 2. Commit changes
    message = input("Enter commit message (default: 'chore: update portfolio content'): ")
    if not message.strip():
        message = "chore: update portfolio content"
    
    if not run_command(f'git commit -m "{message}"'):
        print("No changes to commit or commit failed.")
        # Continue anyway because there might be nothing to commit but still want to deploy

    # 3. Push to GitHub
    print("Pushing to GitHub Main branch...")
    if not run_command("git push origin main"):
        print("Failed to push to GitHub.")
        return

    # 4. Success and Deploy Option
    print("\nSource code updated successfully on GitHub!")
    
    deploy = input("\nWould you like to deploy the changes to GitHub Pages as well? (y/n): ")
    if deploy.lower() == 'y':
        print("Deploying to GitHub Pages...")
        if run_command("npm run deploy"):
            print("Successfully deployed to: https://Hariharan-S5.github.io/MyPortfolio/")
        else:
            print("Deployment failed.")

if __name__ == "__main__":
    try:
        update_portfolio()
    except KeyboardInterrupt:
        print("\nUpdate cancelled.")
        sys.exit(0)
