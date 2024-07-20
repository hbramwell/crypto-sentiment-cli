import { injectable, inject } from "inversify"
import { Ollama } from "ollama"
import { TYPES } from "../types"
import { ConfigService } from "./config-service"
import { LoggerService } from "./logger-service"

/**
 * Service class for performing sentiment analysis on cryptocurrency data.
 */
@injectable()
export class SentimentAnalysisService {
  private ollama: Ollama

  /**
   * Constructor for SentimentAnalysisService.
   * @param configService - The ConfigService instance for retrieving configuration values.
   * @param loggerService - The LoggerService instance for logging errors.
   */
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService,
    @inject(TYPES.LoggerService) private loggerService: LoggerService,
  ) {
    this.ollama = new Ollama({ host: this.configService.get("OLLAMA_API_URL") })
  }

  /**
   * Generates sentiment analysis for the given cryptocurrency data.
   * @param coinData - The cryptocurrency data to analyze.
   * @returns A promise that resolves to a string representing the sentiment analysis result.
   * @throws If there is an error generating the sentiment analysis.
   */
  async generateSentiment(coinData: any): Promise<string> {
    try {
      const prompt = `Analyze the following cryptocurrency data and provide a brief sentiment analysis (positive, neutral, or negative) with a short explanation:
      
      Coin: ${coinData.name.toUpperCase()}
      Price: $${coinData.quote.USD.price.toFixed(2)}
      24h Change: ${coinData.quote.USD.percent_change_24h.toFixed(2)}%
      7d Change: ${coinData.quote.USD.percent_change_7d.toFixed(2)}%
      Market Cap: $${coinData.quote.USD.market_cap.toFixed(2)}
      Volume 24h: $${coinData.quote.USD.volume_24h.toFixed(2)}`

      const response = await this.ollama.generate({
        model: "llama3",
        prompt: prompt,
      })

      return response.response
    } catch (error: any) {
      this.loggerService.error(`Error generating sentiment: ${error.message}`)
      throw error
    }
  }
}
