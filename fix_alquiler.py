import re

file_path = '/Users/victor/DeA/sitio_clonado/alquiler.html'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Replace broken %20 in src with %2520 to double-encode for local file system
#    Pattern: src="/images/boats/deals/([^"]+)"
def fix_url(match):
    path = match.group(1)
    # Replace %20 with %2520 so browsers request "file%20name" as "file%2520name" 
    # which matches the file on disk named "file%20name"
    new_path = path.replace('%20', '%2520')
    return f'src="/images/boats/deals/{new_path}"'

content = re.sub(r'src="/images/boats/deals/([^"]+)"', fix_url, content)

# 2. Replace external onclicks with local ficha-barco.html
# Pattern matching the specific onclick format in the file
content = re.sub(r"onclick=\"window\.location='https://deantonioyachtsibiza\.com/alquiler/[^']+'[;]*\"", "onclick=\"window.location='/alquiler/ficha-barco.html'\"", content)

# 3. Replace hrefs that point to external site detail pages (long slugs end in .html)
# We want to avoid replacing /alquiler.html itself.
# The detail pages look like /alquiler/deantonio....html
content = re.sub(r"href=\"/alquiler/([a-zA-Z0-9-]+)\.html\"", "href=\"/alquiler/ficha-barco.html\"", content)

with open(file_path, 'w') as f:
    f.write(content)

print("alquiler.html processed successfully.")
