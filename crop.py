import re

with open('idbi.svg', 'r') as f:
    content = f.read()

# Make it square 48x48
content = re.sub(r'width="[^"]+"', 'width="48"', content)
content = re.sub(r'height="[^"]+"', 'height="48"', content)

# The circle is located approximately at X=32.5. 
# We set viewBox to X=32, Y=-1, Width=48, Height=48
if 'viewBox' in content:
    content = re.sub(r'viewBox="[^"]+"', 'viewBox="32 -1 48 48"', content)
else:
    content = content.replace('<svg', '<svg viewBox="32 -1 48 48"')

with open('public/idbi_icon.svg', 'w') as f:
    f.write(content)
