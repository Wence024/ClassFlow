# Execute 'git log --oneline -5' to get the last 5 commits
$gitLog = git log --oneline -5 | Out-String

# Execute 'git diff --staged' to get the staged changes
$gitDiff = git diff --staged | Out-String

$prompt = "Do a conventional commit + gitmoji for this. Syntax is ``type(scope): :gitmoji: shortMessage\n\nlongMessage``. Use consistent present verb tense. Avoid redundancy in subject line. Warn me if the current diff necessitates large and vague commit messages in the subject line. Use more descriptive scope for small changes."

# Combine both outputs
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

# Commit the new message
git commit

# Push changes to the remote repository with force-with-lease
git push origin HEAD
