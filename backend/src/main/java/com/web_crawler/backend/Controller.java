package com.web_crawler.backend;

import com.web_crawler.backend.CrawlerService;
import com.web_crawler.backend.CrawlRequest;
import com.web_crawler.backend.SearchRequest;
import com.web_crawler.backend.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Controller {
    @Autowired
    private CrawlerService crawlerService;
    
    @PostMapping("/crawl")
    public ResponseEntity<String> crawl(@RequestBody CrawlRequest request) {
        try {
            crawlerService.crawl(request.getUrl(), request.getDepth());
            return ResponseEntity.ok("Crawling completed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<SearchResult>> search(@RequestBody SearchRequest request) {
        try {
            List<SearchResult> results = crawlerService.search(request.getKeyword());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Web Crawler API is running");
    }
}