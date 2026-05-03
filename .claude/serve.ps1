param([int]$Port = 3000, [string]$Root = ".")

$rootPath = (Resolve-Path $Root).Path

$mime = @{
  '.html'  = 'text/html; charset=utf-8'
  '.css'   = 'text/css; charset=utf-8'
  '.js'    = 'application/javascript; charset=utf-8'
  '.json'  = 'application/json; charset=utf-8'
  '.png'   = 'image/png'
  '.jpg'   = 'image/jpeg'
  '.jpeg'  = 'image/jpeg'
  '.gif'   = 'image/gif'
  '.svg'   = 'image/svg+xml'
  '.ico'   = 'image/x-icon'
  '.woff'  = 'font/woff'
  '.woff2' = 'font/woff2'
  '.webp'  = 'image/webp'
  '.txt'   = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $rootPath at http://localhost:$Port"

try {
  while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $resp = $ctx.Response

    $rel = $req.Url.LocalPath.TrimStart('/')
    $rel = [Uri]::UnescapeDataString($rel) -replace '/', [IO.Path]::DirectorySeparatorChar
    if ($rel -eq '') { $rel = 'index.html' }

    $file = Join-Path $rootPath $rel
    if (Test-Path $file -PathType Container) {
      $file = Join-Path $file 'index.html'
    }

    try {
      if (Test-Path $file -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext   = [IO.Path]::GetExtension($file).ToLower()
        $resp.StatusCode  = 200
        $resp.ContentType = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
        $resp.SendChunked = $true
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $body = [Text.Encoding]::UTF8.GetBytes('<h1>404 Not Found</h1>')
        $resp.StatusCode  = 404
        $resp.ContentType = 'text/html; charset=utf-8'
        $resp.SendChunked = $true
        $resp.OutputStream.Write($body, 0, $body.Length)
      }
    } catch {
      Write-Warning "Error serving $file : $_"
    } finally {
      try { $resp.OutputStream.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
}
