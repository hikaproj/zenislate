#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zenislate - Multi-Runtime CORS RSS Proxy (Python 3 CGI Edition)
Created by Hikaproj
License: MIT
"""

import sys
import os
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import json
import hashlib
from datetime import datetime, timezone

# CGI HTTP Headers
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Methods: GET, OPTIONS")
print("Access-Control-Allow-Headers: Content-Type")
print("Content-Type: application/json; charset=UTF-8")
print("Cache-Control: public, max-age=600\n")

if os.environ.get("REQUEST_METHOD") == "OPTIONS":
    sys.exit(0)

# Parse query string
qs = os.environ.get("QUERY_STRING", "")
params = urllib.parse.parse_qs(qs)
url = params.get("url", ["https://news.yahoo.co.jp/rss/topics/top-picks.xml"])[0]

try:
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Zenislate/1.0 (+Created by Hikaproj)'}
    )
    with urllib.request.urlopen(req, timeout=8) as response:
        xml_data = response.read()

    root = ET.fromstring(xml_data)
    channel = root.find("channel")
    if channel is None:
        channel = root

    source_title = "ニュース"
    title_el = channel.find("title")
    if title_el is not None and title_el.text:
        source_title = title_el.text.strip()

    items = []
    for item in channel.findall("item"):
        link = item.findtext("link", "").strip()
        title = item.findtext("title", "").strip()
        pub_date = item.findtext("pubDate", "").strip()

        items.append({
            "id": hashlib.md5(link.encode('utf-8')).hexdigest(),
            "title": title,
            "link": link,
            "pubDate": pub_date,
            "source": source_title
        })

    result = {
        "status": "success",
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "source": source_title,
        "items": items
    }
    print(json.dumps(result, ensure_ascii=False))

except Exception as e:
    err_result = {
        "status": "error",
        "message": str(e)
    }
    print(json.dumps(err_result, ensure_ascii=False))
