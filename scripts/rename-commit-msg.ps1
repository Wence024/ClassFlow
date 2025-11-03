# Fetch the latest changes from the remote repository
git fetch origin

# Get the current branch name
$currentBranch = git rev-parse --abbrev-ref HEAD

# Pull the latest changes for the current branch from the remote
git pull origin $currentBranch

# Execute 'git log --oneline -5' to get the last 5 commits
$gitLog = git log --oneline -5 | Out-String

# Execute 'git diff --staged' to get the staged changes
$gitDiff = git diff HEAD~1 | Out-String

# Set up the prompt for generating a commit message with Gitmoji
$prompt = "Do a conventional commit + gitmoji for this. Syntax is ``type(scope): :gitmoji: shortMessage\n\nlongMessage``. Use consistent present verb tense. Avoid redundancy in subject line. Warn me if the current diff necessitates large and vague commit messages in the subject line. Use more descriptive scope for small changes."

# Combine the outputs from the git log and diff
$combinedOutput = "$prompt`n`nGit Log (Last 5 Commits):`n$gitLog`n`nGit Diff (Staged Changes):`n$gitDiff"

# Copy the combined output to the clipboard
$combinedOutput | Set-Clipboard

# Inform the user that the output has been copied to the clipboard
Write-Host "Git log and diff have been copied to the clipboard."

# Check if the length of combined output exceeds 21,000 characters
if ($combinedOutput.Length -gt 21000) {
    # Redirect to non-InPrivate link if output is too long
    Start-Process "msedge.exe" -ArgumentList "https://aistudio.google.com/prompts/new_chat"
} else {
    Start-Process "msedge.exe" -ArgumentList "--inprivate https://chatgpt.com"
}

# Amend the commit with the new message
git commit --amend

# Push changes to the remote repository with force-with-lease
git push origin HEAD --force-with-lease
