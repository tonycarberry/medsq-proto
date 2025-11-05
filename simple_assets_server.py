#!/usr/bin/env python3
"""Simple assets server for local development"""
import http.server
import socketserver
import os

PORT = 3845
ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'assets')

class AssetsHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ASSETS_DIR, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
        print(f"Created {ASSETS_DIR} directory")
        print("Please add your image files to this directory")
    
    with socketserver.TCPServer(("", PORT), AssetsHandler) as httpd:
        print(f"Assets server running on http://localhost:{PORT}")
        print(f"Serving assets from: {ASSETS_DIR}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()
