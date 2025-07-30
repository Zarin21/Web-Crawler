package com.web_crawler.backend;

import com.web_crawler.backend.Keyword;
import com.web_crawler.backend.KeywordRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashSet;
import java.util.concurrent.ConcurrentLinkedQueue;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")

// API Endpoint for /api/crawl & /api/search
// Handles web crawling and indexing of keywords.
public class CrawlerService {

    private final KeywordRepository keywordRepository;
    private final HashSet<String> crawlSet = new HashSet<>();

    public CrawlerService(KeywordRepository keywordRepository) {
        this.keywordRepository = keywordRepository;
    }

    @GetMapping("/crawl")
    public boolean crawl(@RequestParam String url, @RequestParam int depth) {
        ConcurrentLinkedQueue<String> crawlQueue = new ConcurrentLinkedQueue<>();
        crawlQueue.add(url);
        crawlSet.add(url);

        int currentDepth = 0;
        while (!crawlQueue.isEmpty() && currentDepth <= depth) {
            int levelSize = crawlQueue.size();
            for (int i = 0; i < levelSize; i++) {
                crawlNext(crawlQueue);
            }
            currentDepth++;
        }

        return true;
    }

    public void crawlNext(ConcurrentLinkedQueue<String> crawlQueue) {
        String url = crawlQueue.poll();
        if (url == null) return;

        try {
            Document doc = Jsoup.connect(url).get();
            Elements links = doc.select("a[href]");
            for (Element link : links) {
                String absUrl = link.absUrl("href");
                if (!crawlSet.contains(absUrl)) {
                    crawlQueue.add(absUrl);
                    crawlSet.add(absUrl);
                }
            }
            createIndexes(doc, url);
        } catch (IOException e) {
            System.err.println("Failed to crawl: " + url);
        }
    }

    public void createIndexes(Document doc, String url) {
        Elements headers = doc.select("h1, h2, h3, h4, h5, h6");
        for (Element header : headers) {
            String[] words = header.text().toLowerCase().split("\\W+");
            for (String word : words) {
                if (word.length() > 2) {    // Ignore short/common words
                    keywordRepository.save(new Keyword(word, url));
                }
            }
        }
    }

    @GetMapping("/search")
    public Object search(@RequestParam String query) {
        return keywordRepository.findByKeywordText(query);
    }
}
