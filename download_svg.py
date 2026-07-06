import urllib.request
url = "https://www.idbibank.in/assets/images/IDBI_Logo.svg"
try:
    urllib.request.urlretrieve(url, "idbi.svg")
    print("SVG downloaded successfully")
except Exception as e:
    print(e)
