import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.HashSet;
import java.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CrawlerService {

    @GetMapping("/crawl")
    public boolean crawl(@RequestParam String url) {
        HashSet<String> CrawlSet = new HashSet<String>();  // To-Crawl Set
        ConcurrentLinkedQueue<String> CrawlQueue = new ConcurrentLinkedQueue<>();

        CrawlQueue.add(url);

        while (!CrawlQueue.isEmpty()) {
            crawlNext(CrawlQueue, CrawlSet);
        }

        return true
    }

    public boolean crawlNext(ConcurrentLinkedQueue<String> CrawlQueue, HashSet<String> CrawlSet) {
        String url CrawlQueue.poll();
        // if (CrawlSet.contains(url)) {
        //     return false;
        // }
        parse(url, CrawlQueue);

        CrawlSet.add(url);
        return true;
    }

    public void parse(String url, ConcurrentLinkedQueue<String> CrawlQueue) {
        try {
            Document doc = Jsoup.connect(url).get();
            Elements links = doc.select("a[href]");
            for (Element link : links) {
                String absUrl = link.absUrl("href");
                if (!CrawlSet.contains(absUrl)) {
                    CrawlQueue.add(absUrl);
                }
            }

            // Add tokens to the database
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

