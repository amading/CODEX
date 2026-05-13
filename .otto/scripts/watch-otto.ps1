param(
  [Parameter(Mandatory = $false)]
  [int]$RefreshSeconds = 2,

  [Parameter(Mandatory = $false)]
  [int]$Tail = 25
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

if (-not (Test-Path (Join-Path $RepoRoot ".git"))) {
  throw "Not a git repository. Run this script from inside the CODEX repo."
}

$Files = @(
  @{
    Title = "Active Project"
    Path  = Join-Path $RepoRoot ".otto\active-project.md"
  },
  @{
    Title = "Task Board"
    Path  = Join-Path $RepoRoot ".otto\task-board.md"
  },
  @{
    Title = "Agent Messages"
    Path  = Join-Path $RepoRoot ".otto\agent-messages.md"
  },
  @{
    Title = "Decision Log"
    Path  = Join-Path $RepoRoot ".otto\decision-log.md"
  },
  @{
    Title = "Audit Log"
    Path  = Join-Path $RepoRoot ".otto\audit-log.md"
  },
  @{
    Title = "Mistakes"
    Path  = Join-Path $RepoRoot ".otto\mistakes.md"
  }
)

function Show-Section {
  param(
    [string]$Title,
    [string]$Path
  )

  Write-Host ""
  Write-Host ("=" * 78) -ForegroundColor DarkGray
  Write-Host $Title -ForegroundColor Cyan
  Write-Host $Path -ForegroundColor DarkGray
  Write-Host ("=" * 78) -ForegroundColor DarkGray

  if (-not (Test-Path $Path)) {
    Write-Host "Missing file." -ForegroundColor Yellow
    return
  }

  $content = Get-Content -Path $Path -Tail $Tail -ErrorAction SilentlyContinue
  if (-not $content) {
    Write-Host "(no content yet)" -ForegroundColor DarkYellow
    return
  }

  $content
}

Push-Location $RepoRoot
try {
  while ($true) {
    Clear-Host
    Write-Host "OTTO Live Dashboard" -ForegroundColor Green
    Write-Host ("Repo: {0}" -f $RepoRoot) -ForegroundColor DarkGray
    Write-Host ("Refresh: {0}s | Tail: {1} lines" -f $RefreshSeconds, $Tail) -ForegroundColor DarkGray
    Write-Host ("Last refresh: {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor DarkGray

    foreach ($file in $Files) {
      Show-Section -Title $file.Title -Path $file.Path
    }

    Start-Sleep -Seconds $RefreshSeconds
  }
}
finally {
  Pop-Location
}
