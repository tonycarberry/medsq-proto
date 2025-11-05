#!/usr/bin/env python3
"""Simple proxy server to make Figma MCP assets accessible on the network"""
import http.server
import socketserver
import urllib.request
import urllib.error
from urllib.parse import urlparse

PORT = 3846

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/assets/'):
            try:
                # Forward request to localhost Figma server
                url = f'http://localhost:3845{self.path}'
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req) as response:
                    if response.getcode() == 200:
                        self.send_response(200)
                        # Forward content type
                        content_type = response.headers.get('Content-Type', 'application/octet-stream')
                        self.send_header('Content-Type', content_type)
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.send_header('Cache-Control', 'no-cache')
                        self.end_headers()
                        self.wfile.write(response.read())
                        return
                    else:
                        print(f"Figma server returned {response.getcode()} for {self.path}")
                        self.send_response(502)
                        self.end_headers()
                        return
            except urllib.error.HTTPError as e:
                print(f"HTTP Error proxying {self.path}: {e.code} {e.reason}")
                # Try to forward the error response
                self.send_response(e.code)
                self.end_headers()
                return
            except Exception as e:
                print(f"Error proxying {self.path}: {type(e).__name__}: {e}")
                self.send_response(502)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(f"Proxy error: {str(e)}".encode())
                return
        
        self.send_response(404)
        self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), ProxyHandler) as httpd:
        print(f"Proxy server running on port {PORT}")
        print(f"Access Figma assets at: http://YOUR_IP:{PORT}/assets/...")
        httpd.serve_forever()


