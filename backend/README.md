# Backend service for web-crawling
This service provides the following endpoints:

## API Endpoints

- **POST `/api/crawl`** - Initiates a web crawl starting from the provided URL up to the specified depth, extracting keywords from heading tags and building an inverted index.

- **POST `/api/search`** - Searches the inverted index for pages containing the specified keyword in their heading tags and returns matching URLs with titles.

- **GET `/api/status`** - Returns a simple health check message.

## Run
`./gradlew bootRun`