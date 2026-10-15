#!/usr/bin/perl
# ==============================================================================
# Zenislate - Multi-Runtime CORS RSS Proxy (Perl CGI Edition)
# Created by Hikaproj
# License: MIT
# ==============================================================================
use strict;
use warnings;
use utf8;
use Digest::MD5 qw(md5_hex);
use Encode qw(encode_utf8 decode_utf8);

# Print HTTP headers
print "Access-Control-Allow-Origin: *\n";
print "Access-Control-Allow-Methods: GET, OPTIONS\n";
print "Access-Control-Allow-Headers: Content-Type\n";
print "Content-Type: application/json; charset=UTF-8\n";
print "Cache-Control: public, max-age=600\n\n";

if (($ENV{'REQUEST_METHOD'} || '') eq 'OPTIONS') {
    exit(0);
}

my $query_string = $ENV{'QUERY_STRING'} || '';
my $url = 'https://news.yahoo.co.jp/rss/topics/top-picks.xml';

if ($query_string =~ /(?:^|&)url=([^&]+)/) {
    my $raw_url = $1;
    $raw_url =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
    $url = $raw_url if $raw_url =~ /^https?:\/\//;
}

# Fetch via curl or perl HTTP if available
my $xml_content = '';
if (`which curl 2>/dev/null`) {
    $xml_content = `curl -s -L --max-time 8 -A "Zenislate/1.0 (+Created by Hikaproj)" "$url"`;
}

if (!$xml_content) {
    # Fallback response
    print '{"status":"error","message":"Failed to fetch RSS via Perl CGI."}';
    exit(0);
}

# Simple regex-based RSS item extraction for zero-dependency portability
my $source_title = "ニュース";
if ($xml_content =~ /<channel[^>]*>.*?<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s) {
    $source_title = $1;
    $source_title =~ s/^\s+|\s+$//g;
}

my @items = ();
while ($xml_content =~ /<item[^>]*>(.*?)<\/item>/sg) {
    my $item_xml = $1;
    my ($title, $link, $pubDate) = ('', '', '');
    
    if ($item_xml =~ /<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s) {
        $title = $1;
        $title =~ s/^\s+|\s+$//g;
        $title =~ s/"/\\"/g;
    }
    if ($item_xml =~ /<link[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/s) {
        $link = $1;
        $link =~ s/^\s+|\s+$//g;
    }
    if ($item_xml =~ /<pubDate[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/pubDate>/s) {
        $pubDate = $1;
        $pubDate =~ s/^\s+|\s+$//g;
    }
    
    my $id = md5_hex($link);
    push @items, sprintf('{"id":"%s","title":"%s","link":"%s","pubDate":"%s","source":"%s"}',
        $id, $title, $link, $pubDate, $source_title);
}

my $items_json = join(',', @items);
print sprintf('{"status":"success","source":"%s","items":[%s]}', $source_title, $items_json);
