$filePath = "d:\Downloadsss\Bhimashankar-hotels\index.html"
$c = [System.IO.File]::ReadAllText($filePath)

# 1. Remove stars completely
$c = [regex]::Replace($c, '<div class="card-stars">.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

# 2. Fix corrupted symbols
$c = $c.Replace('â˜…', '')
$c = $c.Replace('˜…', '')
$c = $c.Replace('Ã¢Ëœâ€¦', '')
$c = $c.Replace('?', '₹')
$c = $c.Replace('₹₹', '₹')

# 3. Clean up grid card footers to remove all buttons
$c = [regex]::Replace($c, '<button class="card-btn" href="[^"]+">View Hotel</a></div><div style="padding:.4rem 1.4rem .9rem;display:flex;gap:.5rem"><a class="card-btn" href="[^"]+">Book Now</a><a class="card-btn-map" href="[^"]+" onclick="[^"]+"><svg[^>]+><polygon[^>]+></svg>Map</a>', '')

# 4. Clean up list card footers to remove all buttons
$c = [regex]::Replace($c, '<a class="list-card-btn" href="hotel-cloud-villa\.html">View Hotel</a></div><div style="[^"]+"><a class="card-btn" href="hotel-cloud-villa\.html">Book Now</a><a class="card-btn-map" href="#section-map" onclick="highlightHotel\(\d+\)"><svg[^>]+><polygon[^>]+></svg>Map</a></div>', '')
$c = [regex]::Replace($c, '<a class="list-card-btn" href="hotel-heritage-inn\.html">View Hotel</a></div><div style="[^"]+"><a class="card-btn" href="hotel-heritage-inn\.html">Book Now</a><a class="card-btn-map" href="#section-map" onclick="highlightHotel\(\d+\)"><svg[^>]+><polygon[^>]+></svg>Map</a></div>', '')
$c = [regex]::Replace($c, '<a class="list-card-btn" href="hotel-misty-sanctuary\.html">View Hotel</a></div><div style="[^"]+"><a class="card-btn" href="hotel-misty-sanctuary\.html">Book Now</a><a class="card-btn-map" href="#section-map" onclick="highlightHotel\(\d+\)"><svg[^>]+><polygon[^>]+></svg>Map</a></div>', '')
$c = [regex]::Replace($c, '<a class="list-card-btn" href="hotel-rudrya-forest\.html">View Hotel</a></div><div style="[^"]+"><a class="card-btn" href="hotel-rudrya-forest\.html">Book Now</a><a class="card-btn-map" href="#section-map" onclick="highlightHotel\(\d+\)"><svg[^>]+><polygon[^>]+></svg>Map</a></div>', '')
$c = [regex]::Replace($c, '<a class="list-card-btn" href="hotel-rudrya-family\.html">View Hotel</a></div><div style="[^"]+"><a class="card-btn" href="hotel-rudrya-family\.html">Book Now</a><a class="card-btn-map" href="#section-map" onclick="highlightHotel\(\d+\)"><svg[^>]+><polygon[^>]+></svg>Map</a></div>', '')
$c = [regex]::Replace($c, '<a class="list-card-btn" href="hotel-sahyadri-cottage\.html">View Hotel</a></div><div style="[^"]+"><a class="card-btn" href="hotel-sahyadri-cottage\.html">Book Now</a><a class="card-btn-map" href="#section-map" onclick="highlightHotel\(\d+\)"><svg[^>]+><polygon[^>]+></svg>Map</a></div>', '')

# Make the cards clickable by wrapping them or using onclick. 
# We can just inject an onclick attribute directly into the stay-card and list-card divs.
$c = $c.Replace('<div class="stay-card reveal reveal-delay-1">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel1.png"', '<div class="stay-card reveal reveal-delay-1" onclick="window.location.href=''hotel-rudrya-forest.html''" style="cursor:pointer;">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel1.png"')

$c = $c.Replace('<div class="stay-card reveal reveal-delay-2">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel2.png"', '<div class="stay-card reveal reveal-delay-2" onclick="window.location.href=''hotel-rudrya-family.html''" style="cursor:pointer;">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel2.png"')

$c = $c.Replace('<div class="stay-card reveal reveal-delay-3">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel3.png"', '<div class="stay-card reveal reveal-delay-3" onclick="window.location.href=''hotel-sahyadri-cottage.html''" style="cursor:pointer;">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel3.png"')

$c = $c.Replace('<div class="stay-card reveal reveal-delay-1">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel4.png"', '<div class="stay-card reveal reveal-delay-1" onclick="window.location.href=''hotel-cloud-villa.html''" style="cursor:pointer;">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel4.png"')

$c = $c.Replace('<div class="stay-card reveal reveal-delay-2">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel5.png"', '<div class="stay-card reveal reveal-delay-2" onclick="window.location.href=''hotel-heritage-inn.html''" style="cursor:pointer;">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel5.png"')

$c = $c.Replace('<div class="stay-card reveal reveal-delay-3">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel6.png"', '<div class="stay-card reveal reveal-delay-3" onclick="window.location.href=''hotel-misty-sanctuary.html''" style="cursor:pointer;">' + "`n" + '          <div class="card-img-wrap">' + "`n" + '            <img src="hotel6.png"')

# For list cards
$c = $c.Replace('<div class="list-card">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel4.png"', '<div class="list-card" onclick="window.location.href=''hotel-cloud-villa.html''" style="cursor:pointer;">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel4.png"')
$c = $c.Replace('<div class="list-card">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel5.png"', '<div class="list-card" onclick="window.location.href=''hotel-heritage-inn.html''" style="cursor:pointer;">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel5.png"')
$c = $c.Replace('<div class="list-card">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel6.png"', '<div class="list-card" onclick="window.location.href=''hotel-misty-sanctuary.html''" style="cursor:pointer;">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel6.png"')
$c = $c.Replace('<div class="list-card">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel1.png"', '<div class="list-card" onclick="window.location.href=''hotel-rudrya-forest.html''" style="cursor:pointer;">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel1.png"')
$c = $c.Replace('<div class="list-card">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel2.png"', '<div class="list-card" onclick="window.location.href=''hotel-rudrya-family.html''" style="cursor:pointer;">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel2.png"')
$c = $c.Replace('<div class="list-card">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel3.png"', '<div class="list-card" onclick="window.location.href=''hotel-sahyadri-cottage.html''" style="cursor:pointer;">' + "`n" + '            <div class="list-card-img">' + "`n" + '              <img src="hotel3.png"')

$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText($filePath, $c, $Utf8NoBomEncoding)
