import { injectable, inject } from "inversify"
import ora from "ora"
import { TYPES } from "../types"
import { DatabaseService } from "./database-service"
import { LoggerService } from "./logger-service"
import { CoinDataService } from "./coindata-service"
import { SentimentAnalysisService } from "./sentiment-service"

@injectable()
export class CLIService {
  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService,
    @inject(TYPES.LoggerService) private logger: LoggerService,
    @inject(TYPES.CoinDataService) private coinDataService: CoinDataService,
    @inject(TYPES.SentimentAnalysisService)
    private sentimentService: SentimentAnalysisService,
  ) {}

  // Initialize the CLI service
  async initialize(): Promise<void> {
    await this.dbService.initialize()
    process.on("SIGINT", () => this.gracefulShutdown())
    process.on("SIGTERM", () => this.gracefulShutdown())
  }

  // Analyze sentiment for a given coin
  async analyzeSentiment(coin: string): Promise<void> {
    const spinner = ora("Analyzing sentiment...").start()

    try {
      const coinData = await this.coinDataService.fetchCoinData(coin)
      const sentiment = await this.sentimentService.generateSentiment(coinData)

      await this.dbService.runQuery(
        "INSERT INTO sentiment_history (coin, date, sentiment, price) VALUES (?, ?, ?, ?)",
        [coin, new Date().toISOString(), sentiment, coinData.quote.USD.price],
      )

      spinner.succeed("Sentiment analysis complete")
      this.logger.success(`Sentiment for ${coin}: ${sentiment}`)
    } catch (error: any) {
      spinner.fail("Sentiment analysis failed")
      this.logger.error(`Error: ${error.message}`)
    }
  }

  // Get sentiment history for a given coin
  async getSentimentHistory(coin: string): Promise<void> {
    try {
      const history = await this.dbService.getAllQuery(
        "SELECT * FROM sentiment_history WHERE coin = ? ORDER BY date DESC LIMIT 10",
        [coin],
      )
      this.logger.info(`Sentiment history for ${coin}:`)
      history.forEach((entry: any) => {
        console.log(
          `${entry.date}: ${entry.sentiment} (Price: $${entry.price.toFixed(
            2,
          )})`,
        )
      })
    } catch (error: any) {
      this.logger.error(`Error fetching sentiment history: ${error.message}`)
    }
  }

  // Get the last sentiment for a given coin
  async getLastSentiment(coin: string): Promise<void> {
    try {
      const lastSentiment = await this.dbService.getQuery(
        "SELECT * FROM sentiment_history WHERE coin = ? ORDER BY date DESC LIMIT 1",
        [coin],
      )
      if (lastSentiment) {
        this.logger.info(`Last sentiment for ${coin}:`)
        console.log(
          `${lastSentiment.date}: ${
            lastSentiment.sentiment
          } (Price: $${lastSentiment.price.toFixed(2)})`,
        )
      } else {
        this.logger.info(`No sentiment history found for ${coin}`)
      }
    } catch (error: any) {
      this.logger.error(`Error fetching last sentiment: ${error.message}`)
    }
  }

  // List all coins with sentiment history
  async listAllSentiments(): Promise<void> {
    try {
      const allSentiments = await this.dbService.getAllQuery(
        "SELECT DISTINCT coin FROM sentiment_history ORDER BY coin",
      )
      this.logger.info("All coins with sentiment history:")
      allSentiments.forEach((entry: any) => {
        console.log(entry.coin)
      })
    } catch (error: any) {
      this.logger.error(`Error listing all sentiments: ${error.message}`)
    }
  }

  // Delete sentiment history for a given coin
  async deleteSentimentHistory(coin: string): Promise<void> {
    try {
      await this.dbService.runQuery(
        "DELETE FROM sentiment_history WHERE coin = ?",
        [coin],
      )
      this.logger.success(`Sentiment history for ${coin} has been deleted`)
    } catch (error: any) {
      this.logger.error(`Error deleting sentiment history: ${error.message}`)
    }
  }

  // Perform a graceful shutdown
  private async gracefulShutdown(): Promise<void> {
    console.log("\nShutting down gracefully...")
    await this.dbService.close()
    process.exit(0)
  }
}
