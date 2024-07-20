# Crypto Sentiment Analysis CLI

## Overview

The Crypto Sentiment Analysis CLI is a powerful, modular TypeScript application designed to fetch cryptocurrency data, perform sentiment analysis, and manage historical sentiment data. It leverages the CoinMarketCap API for real-time crypto data and uses Ollama for sentiment analysis.

## Features

- Fetch real-time cryptocurrency data
- Perform sentiment analysis on crypto trends
- Store and manage historical sentiment data
- Rate-limited API calls to respect usage limits
- Modular architecture for easy extensibility
- Dependency injection for improved testability
- Graceful error handling and shutdown procedures

## Prerequisites

- Node.js (v14 or later)
- Bun runtime
- CoinMarketCap API key
- Ollama running locally or accessible via URL

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/horacebramwell/crypto-sentiment-cli.git
   cd crypto-sentiment-cli
   ```

2. Install dependencies:

   ```
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following content:
   ```
   COINMARKETCAP_API_KEY=your_api_key_here
   OLLAMA_API_URL=http://localhost:11434
   ```

## Usage

Run the CLI using Bun:

```
bun run src/index.ts <command> [options]
```

Available commands:

- `analyze <coin>`: Analyze sentiment for a specific coin
- `history <coin>`: Get sentiment history for a specific coin
- `last <coin>`: Get last sentiment for a specific coin
- `list`: List all coins with sentiment history
- `delete <coin>`: Delete sentiment history for a specific coin

Example:

```
bun run src/index.ts analyze BTC
```

## Architecture

The application follows a modular architecture with dependency injection:

- `config-service`: Manages environment variables and configuration
- `database-service`: Handles database operations (SQLite)
- `logger-service`: Provides logging functionality
- `coindata-service`: Fetches cryptocurrency data from CoinMarketCap API
- `sentiment-service`: Performs sentiment analysis using Ollama
- `cli-service`: Orchestrates CLI operations and user interactions

## Development

### Project Structure

```
src/
├── index.ts
├── types.ts
└── services/
    ├── config-service.ts
    ├── database-service.ts
    ├── logger-service.ts
    ├── coindata-service.ts
    ├── sentiment-service.ts
    └── cli-service.ts
```

### Adding New Features

1. Create a new service in the `services/` directory if needed
2. Update `types.ts` to include any new service types
3. Inject the new service into `cli-service` or other relevant services
4. Add new CLI commands in `index.ts` if required

### Running Tests

To run tests (once implemented):

```
bun test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

Please ensure your code adheres to the existing style and passes all tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinMarketCap](https://coinmarketcap.com/) for providing cryptocurrency data
- [Ollama](https://ollama.ai/) for the sentiment analysis capabilities
- [InversifyJS](https://inversify.io/) for dependency injection

## TODO

- Implement comprehensive unit and integration tests
- Add caching layer to reduce API calls
- Implement input validation and sanitization
- Enhance error handling and recovery mechanisms
- Add telemetry and monitoring capabilities
- Implement a plugin system for extending functionality
- Support configuration files in addition to environment variables
- Implement a more sophisticated rate limiting strategy
- Add support for multiple sentiment analysis models
- Implement database schema versioning for easy upgrades
