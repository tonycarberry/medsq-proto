#!/usr/bin/env python3
"""
Rename hash-based image filenames to meaningful names based on their usage.
Updates all HTML references automatically.
"""

import os
import re
from pathlib import Path

# Mapping of old hash-based filenames to new meaningful names
RENAME_MAP = {
    # index.html - Hero zipwire images
    "74d022a2e9d12219f0ea1785ca21a70fc0ff7322.png": "hero-zipwire-overflow.png",
    "22ac3c59900403b465fb931d5debadf474a11a7d.png": "hero-zipwire-base.png",
    "487a08588634d59932e3cfa516a22d9482b1c11b.png": "hero-zipwire-variant2-1.png",
    "1f197b81d8ebb8bac67d9f2a7b2e2c2e604a20a1.png": "hero-zipwire-variant2-2.png",
    "95129d101f6c7681fb397bdb8ba15f2ca54dca4b.png": "hero-zipwire-variant2-3.png",
    "8c01fa7d849d94270c139e2919d2160276430641.png": "hero-zipwire-variant4-1.png",
    "47e4bde4fd4e353c376465bc0dba03d502561bb8.png": "hero-zipwire-variant4-2.png",
    "cdd40bb013991dd3648fb25a494072bb7bc3f78e.png": "hero-zipwire-variant5-1.png",
    "316ce031662ab6722d250451ee0c6c4834dee14f.png": "hero-zipwire-variant6-1.png",
    "f3707b642efef55cd7cebf07d42aa452a445290d.png": "hero-zipwire-variant7-1.png",
    "10fc6048a07961bad6e86a6faec50939f46a0b2f.svg": "hero-logo.svg",
    
    # index.html - Attraction section images
    "ff23c7e90675612971846f8207980c361c2d23f9.png": "attraction-hotel.png",
    "35de54f0f78096abe0cf849295a1b394461647a0.png": "attraction-food-drink-2.png",
    "d9027e57701130a55082a0e80110a1aaff7d1d4c.png": "attraction-altitude.png",
    "02d25f072fd0b6c4df304c80c975ed6f58799a92.png": "attraction-coop-live.png",
    "18fc97b9bb98e544be7528f7de115eef55218aa5.png": "attraction-etihad-stadium.png",
    
    # hotel.html - Hero and section images
    "0b5e4d4205be1378e7a851b9ba315818a10c9ff4.png": "hotel-standard-room-1.png",
    "271ac4be4b80828c18cfeb160755160b4dacf732.png": "hotel-standard-room-2.png",
    "ed7b9439aecbf4060a3ed53e0f09148d88b0133b.png": "hotel-penthouse-1.png",
    "84c82ad49c84fbb4fa36d50ca45e61419c46a03a.png": "hotel-penthouse-2.png",
    "bd1579f779b48e952b8fd178950719741a9e303a.png": "hotel-penthouse-3.png",
    
    # conferences-and-events.html
    "0ea5a50d991bbed707da125f804ccfdc90515d11.png": "conferences-hero.png",
    "f1d0b7219b11bb03e369f2a94d018a3441d51c7a.png": "conferences-city-hall.png",
    "c4668963363e2ab9a531508c4bf405b5c125c2d4.png": "conferences-level-04.png",
    "95f7193f6e16db6a631d8d6a2cafaaf8849f3c57.png": "conferences-crossbar.png",
    "a2d1241334382617d23b276bad77740e09fdab2a.png": "conferences-pitch-view.png",
    
    # food-and-drink.html - Section images
    "3cc3574067b9a6cfdbf9d5490a01b7fc9400b17e.png": "food-sky-bar-1.png",
    "68856543f9aad4d279ab00f8f5d7f9317f69a7b3.png": "food-sky-bar-2.png",
    "ebc9baff76ba4ed43c14f2563d0a23415d1a715c.png": "food-sky-bar-3.png",
    "5c4f03f3770be8c078b84bc92f321971a6e6d2f1.png": "food-blend-1.png",
    "92b0f039b9cd4f0935f4c7461b4972749c3634ec.png": "food-blend-2.png",
    "46ab9ff4e57c6c472014ef0198d9c9fe129a5d44.png": "food-brasserie-1.png",
    "56590ff02ca0bd37bd29960427b308d34a0b8bff.png": "food-brasserie-2.png",
    "dcc96f016e4d90cdd6bed3214971292facfc9478.png": "food-market-hall-2.png",
    "70aa2afe3486d4e15724cf6e531755ff65247769.png": "food-level-0-1.png",
    "c6fcf401d4c14dedd5f4ca84a3ee9c0ca6a13ff3.png": "food-level-0-2.png",
}

def rename_files():
    """Rename image files from hash-based names to meaningful names."""
    assets_dir = Path("assets")
    renamed_count = 0
    
    print("Renaming image files...")
    print("-" * 60)
    
    for old_name, new_name in RENAME_MAP.items():
        old_path = assets_dir / old_name
        new_path = assets_dir / new_name
        
        if old_path.exists():
            if new_path.exists():
                print(f"⚠ Skipping {old_name} - {new_name} already exists")
            else:
                old_path.rename(new_path)
                print(f"✓ {old_name} → {new_name}")
                renamed_count += 1
        else:
            print(f"✗ {old_name} not found")
    
    print("-" * 60)
    print(f"Renamed {renamed_count} files")
    return renamed_count

def update_html_files():
    """Update all HTML files to use new image filenames."""
    html_files = [
        "index.html",
        "hotel.html",
        "conferences-and-events.html",
        "attractions.html",
        "food-and-drink.html",
    ]
    
    updated_count = 0
    
    print("\nUpdating HTML files...")
    print("-" * 60)
    
    for html_file in html_files:
        if not Path(html_file).exists():
            print(f"⚠ {html_file} not found, skipping")
            continue
        
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all old filenames with new ones
        for old_name, new_name in RENAME_MAP.items():
            # Replace in src attributes
            content = content.replace(f'src="assets/{old_name}"', f'src="assets/{new_name}"')
            # Also handle source tags for videos
            content = content.replace(f'src="assets/{old_name}"', f'src="assets/{new_name}"')
        
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {html_file}")
            updated_count += 1
        else:
            print(f"  {html_file} - no changes needed")
    
    print("-" * 60)
    print(f"Updated {updated_count} HTML files")
    return updated_count

def main():
    print("=" * 60)
    print("Image Renaming Script")
    print("=" * 60)
    print()
    
    # Rename files
    renamed = rename_files()
    
    # Update HTML references
    updated = update_html_files()
    
    print()
    print("=" * 60)
    print("Summary:")
    print(f"  Files renamed: {renamed}")
    print(f"  HTML files updated: {updated}")
    print("=" * 60)

if __name__ == "__main__":
    main()

