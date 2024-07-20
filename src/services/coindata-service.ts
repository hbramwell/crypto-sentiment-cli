import { injectable, inject } from "inversify"
import axios from "axios"
import { TYPES } from "../types"
import { ConfigService } from "./config-service"
import { LoggerService } from "./logger-service"

@injectable()
/**
 * Service for fetching coin data from the CoinMarketCap API and implementing rate limiting.
 */
export class CoinDataService {
  private lastCall: number = 0
  private minInterval: number = 1000 // 1 second

  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService,
    @inject(TYPES.LoggerService) private loggerService: LoggerService,
  ) {}

  /**
   * Fetches coin data from the CoinMarketCap API for a specific coin.
   * @param coin - The symbol of the coin to fetch data for.
   * @returns A Promise that resolves to the fetched coin data.
   * @throws If there is an error fetching the data.
   */
  async fetchCoinData(coin: string): Promise<any> {
    try {
      await this.rateLimit()
      const response = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`,
        {
          params: { symbol: coin },
          headers: {
            "X-CMC_PRO_API_KEY": this.configService.get(
              "COINMARKETCAP_API_KEY",
            ),
          },
        },
      )
      return response.data.data[coin]
    } catch (error: any) {
      this.loggerService.error(
        `Error fetching data for ${coin}: ${error.message}`,
      )
      throw error
    }
  }

  /**
   * Implements rate limiting to prevent excessive API calls.
   * @returns A Promise that resolves when the rate limit is satisfied.
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now()
    if (now - this.lastCall < this.minInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minInterval - (now - this.lastCall)),
      )
    }
    this.lastCall = Date.now()
  }
}
