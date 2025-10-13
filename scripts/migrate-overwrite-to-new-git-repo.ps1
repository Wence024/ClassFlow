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

# Fetch all branches and tags from the old repository
Write-Host "Fetching all branches and tags from the old repository..."
git fetch origin

# Add new remote repository
Write-Host "Adding new remote repository..."
git remote add new-origin $newRepoURL

# Check if the new repository is related to the old one
Write-Host "Checking if the repositories are related..."
try {
    # Try fetching the remote branches from the new repository to see if they are related
    git fetch new-origin
    Write-Host "The new repository is related to the old repository."
    
    # List all branches and create local copies if necessary
    $branches = git branch -r | Where-Object { $_ -like "origin/*" } | ForEach-Object { $_.Trim() }

    foreach ($branch in $branches) {
        $localBranch = $branch -replace "origin/", ""
        Write-Host "Checking out branch: $localBranch"
        git checkout -b $localBranch $branch
    }

    # Merge changes from the old repository (in case there are any conflicts)
    Write-Host "Merging changes from the old repository into the new repository..."
    git merge new-origin/master -m "Merging changes from the old repository"

    # Push all branches and tags to the new repository
    Write-Host "Pushing all branches and tags to the new repository..."
    git push --all new-origin
    git push --tags new-origin
}
catch {
    # If there is an error (likely no relation), overwrite the new repository
    Write-Host "Repositories are not related. Overwriting the new repository with the old repository."

    # Reset the new repository (forcefully overwriting it)
    git remote rm new-origin
    git remote add new-origin $newRepoURL

    # Fetch the latest from the old repository
    Write-Host "Fetching the latest from the old repository..."
    git fetch origin

    # Push all old repository's code (force overwrite)
    Write-Host "Overwriting the new repository with the old repository's code..."
    git push --all new-origin --force
    git push --tags new-origin --force
}

# Remove old remote and rename new-origin to origin
Write-Host "Renaming the new remote to 'origin'..."
git remote rm origin
git remote rename new-origin origin

Write-Host "Migration completed successfully! The repository is now connected to the new remote."
