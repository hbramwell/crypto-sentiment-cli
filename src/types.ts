/**
 * Dependency injection container for service symbols.
 */
const TYPES = {
  ConfigService: Symbol.for("ConfigService"),
  DatabaseService: Symbol.for("DatabaseService"),
  LoggerService: Symbol.for("LoggerService"),
  CoinDataService: Symbol.for("CoinDataService"),
  SentimentAnalysisService: Symbol.for("SentimentAnalysisService"),
  CLIService: Symbol.for("CLIService"),
}

export { TYPES }
