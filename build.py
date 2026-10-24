
import json
import re
import shutil
from html import escape
from pathlib import Path

SOURCE = Path("undangan-bugis-responsive")
OUTPUT = Path("dist")
GUEST_FILE = SOURCE / "tamu.json"


def main():
    if not (SOURCE / "index.html").is_file():
        raise FileNotFoundError(f"index.html tidak ditemukan di {SOURCE}")

    if not GUEST_FILE.is_file():
        raise FileNotFoundError(f"tamu.json tidak ditemukan di {SOURCE}")

    guests = json.loads(GUEST_FILE.read_text(encoding="utf-8"))

    if not isinstance(guests, list):
        raise ValueError("tamu.json harus berupa array.")

    seen = set()

    for guest in guests:
        slug = str(guest.get("slug", "")).strip().lower()
        name = str(guest.get("nama", "")).strip()

        if not re.fullmatch(r"[a-z0-9-]+", slug) or not name:
            raise ValueError(f"Data tamu tidak valid: {guest}")

        if slug in seen:
            raise ValueError(f"Slug duplikat: {slug}")

        seen.add(slug)

    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)

    OUTPUT.mkdir(parents=True)

    # Salin website utama beserta seluruh asetnya.
    for item in SOURCE.iterdir():
        if item.name == "tamu.json":
            continue

        target = OUTPUT / item.name

        if item.is_dir():
            shutil.copytree(item, target)
        else:
            shutil.copy2(item, target)

    original_html = (SOURCE / "index.html").read_text(encoding="utf-8")

    # Ubah URL aset relatif agar tetap benar pada halaman /nama-tamu/.
    def adjust_asset_path(match):
        attribute = match.group(1)
        quote = match.group(2)
        path = match.group(3)

        if path.startswith(("http://", "https://", "/", "#", "data:")):
            return match.group(0)

        return f"{attribute}={quote}../{path}{quote}"

    for guest in guests:
        slug = guest["slug"].strip().lower()
        name = guest["nama"].strip()

        html = original_html

        # Sesuaikan CSS, JavaScript, dan aset relatif.
        html = re.sub(
            r"""(href|src)=(["'])(?!\.\./)([^"']+)\2""",
            adjust_asset_path,
            html,
        )

        # Personalisasi nama tamu.
        pattern = (
            r"""(<[^>]*\bid=["']guest-name["'][^>]*>)"""
            r"""(.*?)"""
            r"""(</[^>]+>)"""
        )

        html, count = re.subn(
            pattern,
            lambda match: (
                match.group(1) + escape(name) + match.group(3)
            ),
            html,
            count=1,
            flags=re.IGNORECASE | re.DOTALL,
        )

        if count != 1:
            raise ValueError('Elemen id="guest-name" tidak ditemukan.')

        folder = OUTPUT / slug
        folder.mkdir(parents=True, exist_ok=True)

        (folder / "index.html").write_text(html, encoding="utf-8")
        print(f"Berhasil membuat halaman /{slug}/ untuk {name}")

    print(f"Build berhasil: {len(guests)} halaman tamu.")


if __name__ == "__main__":
    main()
