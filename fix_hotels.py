import glob

def fix_file(filepath):
    # Read the file as windows-1252 (ANSI) to get the raw string literals
    with open(filepath, 'r', encoding='windows-1252') as f:
        content = f.read()

    # The string literals we want to replace
    replacements = {
        "â,¹": "₹",
        "â€“": "—",
        "â€”": "—",
        "â˜…": "★",
        "âˆ’": "−",
        "Â·": "·",
        "â†’": "→",
        "ðŸ™ ": "🙏",
        "ðŸ ¨": "🏨",
        "ðŸ ¢": "🏢",
        "ðŸ“…": "📅",
        "ðŸŒ™": "🌙",
        "ðŸ› ï¸ ": "🛏️",
        "ðŸ‘¥": "👥",
        "ðŸ’°": "💰",
        "ðŸ’µ": "💵"
    }

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Also handle some edge case corruptions we saw like ,12,499
    content = content.replace(",1", "₹")

    # Write it back as proper UTF-8
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
for file in glob.glob("d:/Downloadsss/Bhimashankar-hotels/hotel-*.html"):
    fix_file(file)

print("Done fixing files!")
