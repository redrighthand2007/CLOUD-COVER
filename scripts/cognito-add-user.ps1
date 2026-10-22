# Creates an office user in AWS Cognito (for AUTH_PROVIDER=cognito) with a temporary password.
# The username MUST match the user's username on CloudCover's Team page.
# At first login, Cognito makes them choose a new password and set up their authenticator app.
#
# Usage (from the project folder, signed in with: aws login --profile cloudcover):
#   powershell -ExecutionPolicy Bypass -File scripts\cognito-add-user.ps1 -Username admin_father
#   ... -Username admin_father -OutFile cognito-temp-passwords.local.txt   (append instead of printing)

param(
    [Parameter(Mandatory = $true)][string] $Username,
    [string] $OutFile,
    [string] $Profile = 'cloudcover'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

$envVars = @{}
Get-Content (Join-Path $root '.env') | Where-Object { $_ -match '^\s*([A-Z_]+)=(.*)$' } | ForEach-Object {
    $envVars[$Matches[1]] = $Matches[2].Trim()
}
$poolId = $envVars['COGNITO_USER_POOL_ID']
$region = $envVars['COGNITO_REGION']
if (-not $poolId) { throw 'COGNITO_USER_POOL_ID is missing in .env' }

$Username = $Username.Trim().ToLower()
if ($Username -notmatch '^[a-z0-9_.]{3,50}$') { throw 'Username must be 3-50 characters: letters, numbers, _ or .' }

# Temporary password that meets the pool policy: 12+ chars with upper, lower, number, symbol
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
function Pick([string] $chars, [int] $count) {
    $bytes = New-Object byte[] $count
    $rng.GetBytes($bytes)
    -join ($bytes | ForEach-Object { $chars[$_ % $chars.Length] })
}
$chars = (Pick 'ABCDEFGHJKMNPQRSTUVWXYZ' 3) + (Pick 'abcdefghjkmnpqrstuvwxyz' 6) + (Pick '23456789' 3) + (Pick '!@#%*-+' 2)
$tempPassword = -join ($chars.ToCharArray() | Sort-Object { Get-Random })

$aws = Get-Command aws -ErrorAction SilentlyContinue
$awsPath = if ($aws) { $aws.Source } else { Join-Path $env:LOCALAPPDATA 'Programs\Amazon\AWSCLIV2\aws.exe' }

# SUPPRESS: Cognito sends no email; the Admin gives the temporary password in person
& $awsPath cognito-idp admin-create-user --user-pool-id $poolId --region $region --profile $Profile `
    --username $Username --temporary-password $tempPassword --message-action SUPPRESS `
    --query 'User.{Username:Username,Status:UserStatus}' --output text
if ($LASTEXITCODE -ne 0) { throw "Cognito could not create '$Username'." }

$line = "$Username`t$tempPassword`t(expires in 7 days; must be changed at first login)"
if ($OutFile) {
    Add-Content -Path (Join-Path $root $OutFile) -Value $line
    Write-Host "Created '$Username' in Cognito. Temporary password saved to $OutFile"
} else {
    Write-Host "Created '$Username' in Cognito."
    Write-Host "Temporary password: $tempPassword"
}
