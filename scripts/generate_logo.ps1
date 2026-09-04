Add-Type -AssemblyName System.Drawing
$bitmap = New-Object System.Drawing.Bitmap(400, 100)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::Transparent)
$font1 = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$font2 = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$brush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252)) # text-main
$brush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(77, 191, 168)) # primary-color

$graphics.DrawString("Cloud", $font1, $brush1, 10, 20)
# Measure string to place second word perfectly
$size = $graphics.MeasureString("Cloud", $font1)
$graphics.DrawString("Cover", $font2, $brush2, 10 + $size.Width - 15, 20)

$bitmap.Save("E:\PROJECTS\WebSite-Cloudcover\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
