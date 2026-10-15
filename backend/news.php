<?php
/**
 * Zenislate - Multi-Runtime CORS RSS Proxy (PHP Edition)
 * Created by Hikaproj
 * License: MIT
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: public, max-age=600"); // 10分キャッシュ

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$defaultFeed = "https://news.yahoo.co.jp/rss/topics/top-picks.xml";
$url = isset($_GET['url']) && filter_var($_GET['url'], FILTER_VALIDATE_URL) ? $_GET['url'] : $defaultFeed;

$ctx = stream_context_create([
    'http' => [
        'timeout' => 8,
        'user_agent' => 'Zenislate/1.0 (+Created by Hikaproj)'
    ]
]);

$xmlString = @file_get_contents($url, false, $ctx);
if ($xmlString === false) {
    http_response_code(502);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch RSS feed from source."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$xml = @simplexml_load_string($xmlString, "SimpleXMLElement", LIBXML_NOCDATA);
if ($xml === false) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid XML or RSS format returned."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$items = [];
$sourceTitle = isset($xml->channel->title) ? (string)$xml->channel->title : "ニュース";

if (isset($xml->channel->item)) {
    foreach ($xml->channel->item as $item) {
        $link = (string)$item->link;
        $items[] = [
            "id" => md5($link),
            "title" => trim((string)$item->title),
            "link" => $link,
            "pubDate" => (string)$item->pubDate,
            "source" => $sourceTitle
        ];
    }
}

echo json_encode([
    "status" => "success",
    "updatedAt" => date(DATE_ATOM),
    "source" => $sourceTitle,
    "items" => $items
], JSON_UNESCAPED_UNICODE);
