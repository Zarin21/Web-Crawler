package com.web_crawler.backend.repository;

import com.web_crawler.backend.model.Keyword;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

// Enable Text Search over the Keyword field.
public interface KeywordRepository extends MongoRepository<Keyword, String> {

    @Query("{ $text: { $search: ?0 } }")
    List<Keyword> findByKeywordText(String query);
}
