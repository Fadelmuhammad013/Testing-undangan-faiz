import json
import re
import shutil
from html import escape
from pathlib import Path

SOURCE = Path("undangan-bugis-responsive")
OUTPUT = Path("dist")
GUEST_FILE = SOURCE / "tamu.json"


def validate_inputs():
    if not (SOURCE / "index.html").is_file():
        raise FileNotFoundError(
            f"File {SOURCE / 'index.html'} tidak ditemukan. "
            "Pastikan nama folder sumber sudah benar."
        )

    if not GUEST_FILE.is_file():
        raise FileNotFoundError(
            f"File {GUEST_FILE} tidak ditemukan."
        )

    guests = json.loads(GUEST_FILE.read_text(encoding="utf-8"))

    if not isinstance(guests, list):
        raise ValueError("tamu.json harus berisi array JSON.")

    seen = set()

    for guest in guests:
        if not isinstance(guest, dict):
            raise ValueError("Setiap tamu harus berupa objek JSON.")

        slug = str(guest.get("slug", "")).strip().lower()
        name = str(guest.get("nama", "")).strip()

        if not slug or not name:
            raise ValueError("Setiap tamu wajib memiliki slug dan nama.")

        if not re.fullmatch(r"[a-z0-9-]+", slug):
            raise ValueError(f"Slug tidak valid: {slug}")

        if slug in seen:
            raise ValueError(f"Slug duplikat: {slug}")

        if slug == "assets":
            raise ValueError("Slug 'assets' tidak boleh digunakan.")

        seen.add(slug)

    return guests


def copy_site_files():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)

    OUTPUT.mkdir(parents=True)

    for item in SOURCE.iterdir():
        if item.name == "tamu.json":
            continue

        destination = OUTPUT / item.name

        if item.is_dir():
            shutil.copytree(item, destination)
        else:
            shutil.copy2(item, destination)


def make_guest_html(original_html, name):
    # Sesuaikan aset untuk halaman yang berada di /nama-tamu/
    replacements = [
        ('href="style.css"', 'href="../style.css"'),
        ("href='style.css'", "href='../style.css'"),
        ('src="script.js"', 'src="../script.js"'),
        ("src='script.js'", "src='../script.js'"),
        ('src="assets/', 'src="../assets/'),
        ("src='assets/", "src='../assets/"),
        ('href="assets/', 'href="../assets/'),
        ("href='assets/", "href='../assets/'),
    ]

    html = original_html

    for old, new in replacements:
        html = html.replace(old, new)

    # Ganti teks di elemen nama tamu tanpa mengubah tag HTML-nya.
    pattern = (
        r'(<[^>]*\bid=["\']guest-name["\'][^>]*>)'
        r'.*?'
        r'(</[^>]+>)'
    )

    html, count = re.subn(
        pattern,
        lambda match: match.group(1) + escape(name) + match.group(2),
        html,
        count=1,
        flags=re.IGNORECASE | re.DOTALL,
    )

    if count != 1:
        raise ValueError(
            'Elemen dengan id="guest-name" tidak ditemukan di index.html.'
        )

    return html


def main():
    guests = validate_inputs()
    copy_site_files()

    original_html = (
        SOURCE / "index.html"
    ).read_text(encoding="utf-8")

    for guest in guests:
        slug = guest["slug"].strip().lower()
        name = guest["nama"].strip()

        folder = OUTPUT / slug
        folder.mkdir(parents=True, exist_ok=True)

        guest_html = make_guest_html(original_html, name)

        (folder / "index.html").write_text(
            guest_html,
            encoding="utf-8",
        )

        print(f"Berhasil membuat /{slug}/ untuk {name}")

    print(f"Build selesai. Total halaman tamu: {len(guests)}")


if __name__ == "__main__":
    main()
