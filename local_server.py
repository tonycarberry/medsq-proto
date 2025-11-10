#!/usr/bin/env python3
"""Local development server accessible on local network"""
import http.server
import socketserver
import socket
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(__file__), **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def get_local_ip():
    """Get the local IP address"""
    try:
        # Connect to a remote address to determine local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "localhost"

if __name__ == '__main__':
    local_ip = get_local_ip()
    
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print("\n" + "="*60)
        print("🚀 Server is running!")
        print("="*60)
        print(f"\n📱 Access on your computer:")
        print(f"   http://localhost:{PORT}")
        print(f"\n📱 Access on your phone:")
        print(f"   http://{local_ip}:{PORT}")
        print(f"\n💡 Make sure your phone is on the same WiFi network")
        print(f"\nPress Ctrl+C to stop the server\n")
        print("="*60 + "\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!")

