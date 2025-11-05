#!/usr/bin/env python3
"""Check if Figma assets are accessible"""
import urllib.request
import urllib.error
import sys

assets = [
    "2f04396e3ae8649eb6dcaba8183fecde487158c1.svg",
    "4881bc6da349ae40bcded0318ad4d2e86e143475.png",
    "22ac3c59900403b465fb931d5debadf474a11a7d.png",
    "9a74b7bf676016c321dbf156dd8949652bcd9c54.png",
    "a86e373b73ae969cd287a820cab49fde39e4b988.png",
    "71123b7e2a3ecf54d9fd6ef769f0a6356ae743c6.png",
    "53cb410a1742a4f7b16d7d2a0febbc00dc376705.png",
    "26502788607439737562b684a272e4fa2c7e89ec.png",
]

print("Checking Figma MCP server (localhost:3845)...")
print("-" * 60)

for asset in assets[:3]:  # Check first 3
    url = f'http://localhost:3845/assets/{asset}'
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.getcode() == 200:
                print(f"✓ {asset} - OK ({len(response.read())} bytes)")
            else:
                print(f"✗ {asset} - Status: {response.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"✗ {asset} - HTTP {e.code}: {e.reason}")
    except Exception as e:
        print(f"✗ {asset} - Error: {type(e).__name__}: {e}")

print("\n" + "-" * 60)
print("Checking proxy server (localhost:3846)...")

for asset in assets[:3]:  # Check first 3
    url = f'http://localhost:3846/assets/{asset}'
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.getcode() == 200:
                print(f"✓ {asset} - OK ({len(response.read())} bytes)")
            else:
                print(f"✗ {asset} - Status: {response.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"✗ {asset} - HTTP {e.code}: {e.reason}")
    except Exception as e:
        print(f"✗ {asset} - Error: {type(e).__name__}: {e}")

