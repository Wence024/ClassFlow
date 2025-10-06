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

# Fetch all branches and tags
Write-Host "Fetching all branches and tags from the old repository..."
git fetch origin

# List all branches and create local copies if necessary
$branches = git branch -r | Where-Object { $_ -like "origin/*" } | ForEach-Object { $_.Trim() }

foreach ($branch in $branches) {
    $localBranch = $branch -replace "origin/", ""
    Write-Host "Checking out branch: $localBranch"
    git checkout -b $localBranch $branch
}

# Add new remote repository
Write-Host "Adding new remote repository..."
git remote add new-origin $newRepoURL

# Push all branches and tags to the new remote
Write-Host "Pushing all branches and tags to the new repository..."
git push --all new-origin
git push --tags new-origin

# Remove old remote and rename new-origin to origin
Write-Host "Renaming the new remote to 'origin'..."
git remote rm origin
git remote rename new-origin origin

Write-Host "Migration completed successfully! The repository is now connected to the new remote."
