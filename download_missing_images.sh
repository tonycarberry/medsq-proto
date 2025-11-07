#!/bin/bash
# Script to download missing images from localhost:3845

BASE_URL="http://localhost:3845/assets"
ASSETS_DIR="assets"

# List of missing images
MISSING_IMAGES=(
  "74d022a2e9d12219f0ea1785ca21a70fc0ff7322.png"
  "22ac3c59900403b465fb931d5debadf474a11a7d.png"
  "487a08588634d59932e3cfa516a22d9482b1c11b.png"
  "1f197b81d8ebb8bac67d9f2a7b2e2c2e604a20a1.png"
  "95129d101f6c7681fb397bdb8ba15f2ca54dca4b.png"
  "8c01fa7d849d94270c139e2919d2160276430641.png"
  "47e4bde4fd4e353c376465bc0dba03d502561bb8.png"
  "cdd40bb013991dd3648fb25a494072bb7bc3f78e.png"
  "316ce031662ab6722d250451ee0c6c4834dee14f.png"
  "f3707b642efef55cd7cebf07d42aa452a445290d.png"
  "10fc6048a07961bad6e86a6faec50939f46a0b2f.svg"
  "ff23c7e90675612971846f8207980c361c2d23f9.png"
  "35de54f0f78096abe0cf849295a1b394461647a0.png"
  "d9027e57701130a55082a0e80110a1aaff7d1d4c.png"
  "02d25f072fd0b6c4df304c80c975ed6f58799a92.png"
  "18fc97b9bb98e544be7528f7de115eef55218aa5.png"
  "0b5e4d4205be1378e7a851b9ba315818a10c9ff4.png"
  "271ac4be4b80828c18cfeb160755160b4dacf732.png"
  "ed7b9439aecbf4060a3ed53e0f09148d88b0133b.png"
  "84c82ad49c84fbb4fa36d50ca45e61419c46a03a.png"
  "bd1579f779b48e952b8fd178950719741a9e303a.png"
  "0ea5a50d991bbed707da125f804ccfdc90515d11.png"
  "f1d0b7219b11bb03e369f2a94d018a3441d51c7a.png"
  "c4668963363e2ab9a531508c4bf405b5c125c2d4.png"
  "95f7193f6e16db6a631d8d6a2cafaaf8849f3c57.png"
  "a2d1241334382617d23b276bad77740e09fdab2a.png"
)

echo "Downloading missing images from $BASE_URL..."
echo ""

success_count=0
fail_count=0

for image in "${MISSING_IMAGES[@]}"; do
  url="${BASE_URL}/${image}"
  output="${ASSETS_DIR}/${image}"
  
  # Check if file already exists
  if [ -f "$output" ]; then
    echo "✓ Already exists: $image"
    continue
  fi
  
  # Download the file
  if curl -s -f -o "$output" "$url"; then
    echo "✓ Downloaded: $image"
    success_count=$((success_count + 1))
  else
    echo "✗ Failed: $image"
    fail_count=$((fail_count + 1))
    # Remove empty file if download failed
    [ -f "$output" ] && rm "$output"
  fi
done

echo ""
echo "=== Summary ==="
echo "Successfully downloaded: $success_count"
echo "Failed: $fail_count"
echo "Total: ${#MISSING_IMAGES[@]}"

