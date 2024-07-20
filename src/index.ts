import { program } from "commander"
import { Container } from "inversify"
import "reflect-metadata"
import { TYPES } from "./types"
import { ConfigService } from "./services/config-service"
import { DatabaseService } from "./services/database-service"
import { LoggerService } from "./services/logger-service"
import { CoinDataService } from "./services/coindata-service"
import { SentimentAnalysisService } from "./services/sentiment-service"
import { CLIService } from "./services/cli-service"

// Function to bootstrap the application
async function bootstrap() {
  const container = new Container()

  // Binding services to the container
  container
    .bind<ConfigService>(TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope()
  container
    .bind<DatabaseService>(TYPES.DatabaseService)
    .to(DatabaseService)
    .inSingletonScope()
  container
    .bind<LoggerService>(TYPES.LoggerService)
    .to(LoggerService)
    .inSingletonScope()
  container
    .bind<CoinDataService>(TYPES.CoinDataService)
    .to(CoinDataService)
    .inSingletonScope()
  container
    .bind<SentimentAnalysisService>(TYPES.SentimentAnalysisService)
    .to(SentimentAnalysisService)
    .inSingletonScope()
  container.bind<CLIService>(TYPES.CLIService).to(CLIService).inSingletonScope()

  const cliService = container.get<CLIService>(TYPES.CLIService)
  await cliService.initialize()

  // Setting up the CLI program
  program.version("1.0.0").description("Crypto Sentiment Analysis CLI")

  // Defining commands and their actions
  program
    .command("analyze <coin>")
    .description("Analyze sentiment for a specific coin")
    .action((coin) => cliService.analyzeSentiment(coin))

  program
    .command("history <coin>")
    .description("Get sentiment history for a specific coin")
    .action((coin) => cliService.getSentimentHistory(coin))

  program
    .command("last <coin>")
    .description("Get last sentiment for a specific coin")
    .action((coin) => cliService.getLastSentiment(coin))

  program
    .command("list")
    .description("List all coins with sentiment history")
    .action(() => cliService.listAllSentiments())

  program
    .command("delete <coin>")
    .description("Delete sentiment history for a specific coin")
    .action((coin) => cliService.deleteSentimentHistory(coin))

  program.parse(process.argv)
}

// Calling the bootstrap function and handling errors
bootstrap().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
