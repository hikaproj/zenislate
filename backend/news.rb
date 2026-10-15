#!/usr/bin/env ruby
# -*- coding: utf-8 -*-
# ==============================================================================
# Zenislate - Multi-Runtime CORS RSS Proxy (Ruby CGI Edition)
# Created by Hikaproj
# License: MIT
# ==============================================================================

require 'cgi'
require 'open-uri'
require 'rexml/document'
require 'json'
require 'digest/md5'
require 'time'

cgi = CGI.new
puts "Access-Control-Allow-Origin: *"
puts "Access-Control-Allow-Methods: GET, OPTIONS"
puts "Access-Control-Allow-Headers: Content-Type"
puts "Content-Type: application/json; charset=UTF-8"
puts "Cache-Control: public, max-age=600\n\n"

exit 0 if ENV['REQUEST_METHOD'] == 'OPTIONS'

feed_url = cgi.params['url']&.first || 'https://news.yahoo.co.jp/rss/topics/top-picks.xml'

begin
  URI.open(feed_url, 'User-Agent' => 'Zenislate/1.0 (+Created by Hikaproj)', :read_timeout => 8) do |f|
    doc = REXML::Document.new(f.read)
    channel = doc.elements['//channel']
    source_title = channel ? (channel.elements['title']&.text || 'ニュース') : 'ニュース'

    items = []
    doc.elements.each('//item') do |item|
      link = item.elements['link']&.text || ''
      title = item.elements['title']&.text || ''
      pub_date = item.elements['pubDate']&.text || ''

      items << {
        id: Digest::MD5.hexdigest(link),
        title: title.strip,
        link: link.strip,
        pubDate: pub_date.strip,
        source: source_title.strip
      }
    end

    puts JSON.generate({
      status: 'success',
      updatedAt: Time.now.utc.isoformat,
      source: source_title,
      items: items
    })
  end
rescue => e
  puts JSON.generate({
    status: 'error',
    message: e.message
  })
end
