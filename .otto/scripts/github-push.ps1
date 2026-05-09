param(
  [Parameter(Mandatory = $false)]
  [string]$Message = "chore: sync workspace updates",

  [Parameter(Mandatory = $false)]
  [string]$Branch = "main",

  [Parameter(Mandatory = $false)]
  [string]$Remote = "origin"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".git")) {
  throw "Not a git repository. Run this script from your repo root."
}

git add -A

$status = git status --porcelain
if (-not $status) {
  Write-Host "No changes to commit."
  exit 0
}

git commit -m $Message
git push $Remote $Branch

$hash = (git rev-parse --short HEAD).Trim()
Write-Host "Pushed commit $hash to $Remote/$Branch"

