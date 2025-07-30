package com.web_crawler.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

// MongoDB entity mapping keywords to URLs.
@Document(collection = "inverted_index_table")
public class Keyword {
    @Id
    private String id;
    @TextIndexed
    private String keyword;
    private String url;

    public Keyword(String keyword, String url) {
        this.keyword = keyword;
        this.url = url;
    }

    public String getKeyword() {
        return keyword;
    }

    public String getUrl() {
        return url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
