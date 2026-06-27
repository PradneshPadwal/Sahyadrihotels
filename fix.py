import re
import sys

def main():
    file_path = 'd:/Downloadsss/Bhimashankar-hotels/index.html'
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Remove stars (both correct and corrupted versions)
    content = re.sub(r'<div class="card-stars">.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'â˜…', '', content)
    content = re.sub(r'˜…', '', content)
    content = re.sub(r'\?/', '₹', content) # Sometimes rupees symbol gets corrupted to ?
    content = re.sub(r'\?(\d)', r'₹\1', content)

    # 2. Fix the mess in stay-card footers
    # The mess looks like: <button class="card-btn" href="hotel-name.html">View Hotel</a></div><div style="..."><a class="card-btn" href="hotel-name.html">Book Now</a><a class="card-btn-map" ...>...Map</a>
    # We'll just replace it with empty, leaving only the price in the footer.
    content = re.sub(r'<button class="card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a>', '', content, flags=re.DOTALL)
    
    # In some places, it might have been an anchor instead of a button:
    content = re.sub(r'<a class="card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a>', '', content, flags=re.DOTALL)

    # Same for list cards
    content = re.sub(r'<a class="list-card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a></div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<button class="list-card-btn" href="([^"]+)">View Hotel</a></div><div[^>]*>.*?Map</a></div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<a class="list-card-btn" href="[^"]+">Book Now</a>', '', content)
    
    # 3. Make the cards clickable
    # For grid cards: <div class="stay-card reveal reveal-delay-X"> -> add onclick
    def add_onclick_grid(m):
        img = m.group(2)
        urls = {
            'hotel1.png': 'hotel-rudrya-forest.html',
            'hotel2.png': 'hotel-rudrya-family.html',
            'hotel3.png': 'hotel-sahyadri-cottage.html',
            'hotel4.png': 'hotel-cloud-villa.html',
            'hotel5.png': 'hotel-heritage-inn.html',
            'hotel6.png': 'hotel-misty-sanctuary.html',
        }
        url = urls.get(img, '#')
        return f'<div class="{m.group(1)}" onclick="window.location.href=\'{url}\'" style="cursor:pointer;">\n          <div class="card-img-wrap">\n            <img src="{img}"'

    content = re.sub(r'<div class="(stay-card.*?)">\s*<div class="card-img-wrap">\s*<img src="(hotel\d\.png)"', add_onclick_grid, content)

    # For list cards: <div class="list-card"> -> add onclick
    def add_onclick_list(m):
        img = m.group(1)
        urls = {
            'hotel1.png': 'hotel-rudrya-forest.html',
            'hotel2.png': 'hotel-rudrya-family.html',
            'hotel3.png': 'hotel-sahyadri-cottage.html',
            'hotel4.png': 'hotel-cloud-villa.html',
            'hotel5.png': 'hotel-heritage-inn.html',
            'hotel6.png': 'hotel-misty-sanctuary.html',
        }
        url = urls.get(img, '#')
        return f'<div class="list-card" onclick="window.location.href=\'{url}\'" style="cursor:pointer;">\n            <div class="list-card-img">\n              <img src="{img}"'

    content = re.sub(r'<div class="list-card">\s*<div class="list-card-img">\s*<img src="(hotel\d\.png)"', add_onclick_list, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Fixed index.html successfully")

if __name__ == '__main__':
    main()
