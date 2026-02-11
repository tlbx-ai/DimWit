param(
    [string]$Version = "1.0.0"
)

$root = Split-Path $PSScriptRoot
$srcDir = Join-Path $root "src"
$outFile = Join-Path $root "dimwit-v$Version.zip"

if (Test-Path $outFile) { Remove-Item $outFile }

Compress-Archive -Path "$srcDir\*" -DestinationPath $outFile
Write-Host "Packed $outFile"
