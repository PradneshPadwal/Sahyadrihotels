$filePath = "d:\Downloadsss\Bhimashankar-hotels\index.html"
$content = Get-Content $filePath -Raw -Encoding UTF8

# 1. Remove stars block and corrupted characters
$content = $content -replace '<div class="card-stars">.*?</div>', ''
$content = $content -replace 'â˜…', ''
$content = $content -replace '˜…', ''
$content = $content -replace '\?/', '₹'
$content = $content -replace '\?(\d)', '₹$1'

# 2. Fix the mess in stay-card footers
$regexGrid = '<button class="card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $regexGrid, '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

$regexGridAnchor = '<a class="card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $regexGridAnchor, '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

# For list cards
$regexList = '<a class="list-card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a></div>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $regexList, '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

$regexList2 = '<button class="list-card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a></div>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $regexList2, '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

$regexList3 = '<a class="list-card-btn" href="[^"]+">Book Now</a>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $regexList3, '')

# 3. Add onclick to grid cards
$imgUrls = @{
    'hotel1.png' = 'hotel-rudrya-forest.html'
    'hotel2.png' = 'hotel-rudrya-family.html'
    'hotel3.png' = 'hotel-sahyadri-cottage.html'
    'hotel4.png' = 'hotel-cloud-villa.html'
    'hotel5.png' = 'hotel-heritage-inn.html'
    'hotel6.png' = 'hotel-misty-sanctuary.html'
}

$evaluatorGrid = [System.Text.RegularExpressions.MatchEvaluator] {
    param([System.Text.RegularExpressions.Match] $m)
    $divClass = $m.Groups[1].Value
    $img = $m.Groups[2].Value
    $url = if ($imgUrls.ContainsKey($img)) { $imgUrls[$img] } else { '#' }
    return "<div class=""$divClass"" onclick=""window.location.href='$url'"" style=""cursor:pointer;"">`n          <div class=""card-img-wrap"">`n            <img src=""$img"""
}
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '<div class="(stay-card.*?)">\s*<div class="card-img-wrap">\s*<img src="(hotel\d\.png)"', $evaluatorGrid)

# 4. Add onclick to list cards
$evaluatorList = [System.Text.RegularExpressions.MatchEvaluator] {
    param([System.Text.RegularExpressions.Match] $m)
    $img = $m.Groups[1].Value
    $url = if ($imgUrls.ContainsKey($img)) { $imgUrls[$img] } else { '#' }
    return "<div class=""list-card"" onclick=""window.location.href='$url'"" style=""cursor:pointer;"">`n            <div class=""list-card-img"">`n              <img src=""$img"""
}
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '<div class="list-card">\s*<div class="list-card-img">\s*<img src="(hotel\d\.png)"', $evaluatorList)

# Save back to file
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText($filePath, $content, $Utf8NoBomEncoding)
