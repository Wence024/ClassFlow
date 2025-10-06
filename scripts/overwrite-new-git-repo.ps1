param(
    [string]$oldRepoPath,    # Path to the old local repository
    [string]$newRepoURL      # SSH URL to the new Git repository
)

# Ensure both parameters are provided
if (-not $oldRepoPath) {
    Write-Host "Please specify the old repository path."
    exit
}

if (-not $newRepoURL) {
    Write-Host "Please specify the new repository SSH URL."
    exit
}

# Navigate to the old repository
Write-Host "Navigating to the old repository..."
Set-Location -Path $oldRepoPath

# Check if .git folder exists
if (-not (Test-Path ".git")) {
    Write-Host "This is not a valid Git repository."
    exit
}

# Fetch the content from the new repository
Write-Host "Fetching all branches and tags from the new repository..."
git remote add new-origin $newRepoURL
git fetch new-origin

# Checkout the new repository’s main branch (e.g., 'main')
Write-Host "Checking out the new repository’s main branch..."
git checkout -b new-main new-origin/main

# Reset the old repository to the new code (force overwrite)
Write-Host "Overwriting the old code with the new repository's content..."
git checkout main
git reset --hard new-main

# Push the new content back to the old repository (force-push)
Write-Host "Pushing the new content to the old repository..."
git push --force origin main

# Remove the temporary remote
git remote remove new-origin

Write-Host "Old repository successfully overwritten with new repository content!"
