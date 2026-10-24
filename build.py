
import json
import shutil
from pathlib import Path

source = Path("undangan-bugis-responsive")
output = Path("dist")
guest_file = source / "tamu.json"

if not (source / "index.html").exists():
    raise FileNotFoundError(f"index.html tidak ditemukan: {source}")

if not guest_file.exists():
    raise FileNotFoundError(f"tamu.json tidak ditemukan: {guest_file}")

guests = json.loads(guest_file.read_text(encoding="utf-8"))

if output.exists():
    shutil.rmtree(output)

output.mkdir(parents=True)

# Salin website utama
for item in source.iterdir():
    if item.name == "tamu.json":
        continue

    target = output / item.name

    if item.is_dir():
        shutil.copytree(item, target)
    else:
        shutil.copy2(item, target)

# Buat halaman personal untuk setiap tamu
used_slugs = set()

for guest in guests:
    slug = guest["slug"].strip().lower()
    name = guest["nama"].strip()

    if not slug or any(
        c not in "abcdefghijklmnopqrstuvwxyz0123456789-"
        for c in slug
    ):
        raise ValueError(f"Slug tidak valid: {slug}")

    if slug in used_slugs:
        raise ValueError(f"Slug duplikat: {slug}")

    used_slugs.add(slug)

    folder = output / slug
    folder.mkdir(parents=True)

    html = (source / "index.html").read_text(encoding="utf-8")

    replacements = [
        ('href="style.css"', 'href="../style.css"'),
        ("href='style.css'", "href='../style.css'"),
        ('src="script.js"', 'src="../script.js"'),
        ("src='script.js'", "src='../script.js'"),
        ('src="assets/', 'src="../assets/'),
        ("src='assets/", "src='../assets/"),
        ('href="assets/', 'href="../assets/'),
        ("href='assets/", "href='../assets/"),
    ]

    for old, new in replacements:
        html = html.replace(old, new)

    (folder / "index.html").write_text(html, encoding="utf-8")
    print(f"Halaman dibuat: /{slug}/ untuk {name}")

print("Pembuatan halaman personal selesai.")
