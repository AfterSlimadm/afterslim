#!/usr/bin/env python3
"""
Custom HTTP server for the seed.com clone.
Handles:
- Static files from the current directory
- API routes returning JSON mock responses
- Extensionless files with proper Content-Type
- CORS headers for local development
"""
import http.server
import json
import os
import mimetypes

PORT = 9999
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# API mock responses
API_RESPONSES = {
    '/api/auth/check-authentication': {'msg': 'Unauthorized', 'success': False},
    '/api/auth/location': {'country': 'US', 'region': 'CA'},
}

class SeedHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.path.split('?')[0]  # Strip query string

        # Handle API routes
        if path in API_RESPONSES:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(API_RESPONSES[path]).encode())
            return

        # Handle _next/data JSON files
        if path.startswith('/_next/') or path.startswith('/api/'):
            # Strip leading slash for file lookup
            path = path.lstrip('/')

        # Default: serve static files
        super().do_GET()

    def guess_type(self, path):
        """Override to handle extensionless files and .js files."""
        base, ext = os.path.splitext(path)
        if ext == '':
            # Extensionless files - check if they're JSON (API responses)
            return 'application/json'
        if ext == '.js':
            return 'application/javascript'
        if ext == '.json':
            return 'application/json'
        if ext == '.css':
            return 'text/css'
        if ext == '.woff2':
            return 'font/woff2'
        if ext == '.webp':
            return 'image/webp'
        return super().guess_type(path)

    def end_headers(self):
        # Add CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 'public, max-age=31536000')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def log_message(self, format, *args):
        # Only log errors and important requests
        msg = format % args
        if '404' in msg or '500' in msg or 'api/' in msg:
            super().log_message(format, *args)

if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), SeedHandler) as httpd:
        print(f"Serving seed.com clone on http://localhost:{PORT}")
        print(f"Directory: {DIRECTORY}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()
