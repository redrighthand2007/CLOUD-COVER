# Rebuilds the LOCAL cloudcover database from schema.sql + seed.sql.
# WARNING: deletes everything in the local cloudcover database. For development only.
# Usage (from the project folder):  powershell -ExecutionPolicy Bypass -File scripts\reset-db.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

# Read DB settings from .env
$envVars = @{}
Get-Content (Join-Path $root '.env') | Where-Object { $_ -match '^\s*([A-Z_]+)=(.*)$' } | ForEach-Object {
    $envVars[$Matches[1]] = $Matches[2].Trim()
}
$dbName = $envVars['DB_NAME']
if ($envVars['DB_HOST'] -notin @('localhost', '127.0.0.1')) {
    throw "Refusing to reset a non-local database ($($envVars['DB_HOST']))."
}

$psql = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\psql.exe' | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
$env:PGPASSWORD = $envVars['DB_PASSWORD']
$common = @('-U', $envVars['DB_USER'], '-h', $envVars['DB_HOST'], '-p', $envVars['DB_PORT'], '-v', 'ON_ERROR_STOP=1', '-q')

& $psql @common -d postgres -c "DROP DATABASE IF EXISTS $dbName WITH (FORCE);"
& $psql @common -d postgres -c "CREATE DATABASE $dbName;"
& $psql @common -d $dbName -1 -f (Join-Path $root 'database\schema.sql')
& $psql @common -d $dbName -1 -f (Join-Path $root 'database\seed.sql')
Write-Host "Local database '$dbName' rebuilt with sample data."
