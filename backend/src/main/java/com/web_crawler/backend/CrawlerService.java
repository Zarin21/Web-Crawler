package com.web_crawler.backend;

import com.web_crawler.backend.SearchResult;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CrawlerService {
    private Map<String, Set<String>> invertedIndex = new HashMap<>();
    private Set<String> visitedUrls = new HashSet<>();
    private Map<String, String> urlTitles = new HashMap<>();

    public void crawl(String startUrl, int maxDepth) {
        // Clear previous crawl data
        invertedIndex.clear();
        visitedUrls.clear();
        urlTitles.clear();
        crawlRecursive(startUrl, 0, maxDepth);
    }

    private void crawlRecursive(String url, int currentDepth, int maxDepth) {
        if (currentDepth > maxDepth || visitedUrls.contains(url)) {
            return;
        }

        try {
            visitedUrls.add(url);
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(5000)
                    .get();
            String pageTitle = doc.title();
            urlTitles.put(url, pageTitle);

            Elements headings = doc.select("h1, h2, h3, h4, h5, h6");
            
            for (Element heading : headings) {
                String text = heading.text().toLowerCase().trim();

                String[] words = text.split("\\s+");
                
                for (String word : words) {
                    word = word.replaceAll("[^a-zA-Z0-9]", "");
                    
                    if (!word.isEmpty() && word.length() > 2) {
                        invertedIndex.computeIfAbsent(word, k -> new HashSet<>()).add(url);
                    }
                }
            }
            
            if (currentDepth < maxDepth) {
                Elements links = doc.select("a[href]");
                
                for (Element link : links) {
                    String nextUrl = link.absUrl("href");

                    if (nextUrl.startsWith("http") && isSameDomain(url, nextUrl)) {
                        crawlRecursive(nextUrl, currentDepth + 1, maxDepth);
                    }
                }
            }
            
        } catch (IOException e) {
            System.err.println("Error crawling " + url + ": " + e.getMessage());
        }
    }

    private boolean isSameDomain(String url1, String url2) {
        try {
            String domain1 = new URL(url1).getHost();
            String domain2 = new URL(url2).getHost();
            return domain1.equals(domain2);
        } catch (Exception e) {
            return false;
        }
    }

    public List<SearchResult> search(String keyword) {
        keyword = keyword.toLowerCase().trim();
        
        Set<String> urls = invertedIndex.getOrDefault(keyword, new HashSet<>());
        
        return urls.stream()
                .map(url -> new SearchResult(url, urlTitles.getOrDefault(url, "Untitled")))
                .collect(Collectors.toList());
    }

    public Map<String, Set<String>> getInvertedIndex() {
        return invertedIndex;
    }
}