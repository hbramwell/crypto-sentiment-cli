import { injectable, inject } from "inversify"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { TYPES } from "../types"
import { LoggerService } from "./logger-service"

@injectable()
export class DatabaseService {
  private db: any

  constructor(
    @inject(TYPES.LoggerService) private loggerService: LoggerService,
  ) {}

  /**
   * Initializes the database connection and creates the necessary table if it doesn't exist.
   */
  async initialize(): Promise<void> {
    this.db = await open({
      filename: "./crypto_sentiment.db",
      driver: sqlite3.Database,
    })

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS sentiment_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin TEXT,
        date TEXT,
        sentiment TEXT,
        price REAL
      )
    `)
  }

  /**
   * Executes a SQL query that doesn't return any result.
   * @param sql The SQL query to execute.
   * @param params The parameters to bind to the query.
   * @returns A promise that resolves when the query is executed.
   * @throws If there is an error executing the query.
   */
  async runQuery(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.run(sql, params)
    } catch (error: any) {
      this.loggerService.error(`Database error: ${error.message}`)
      throw error
    }
  }

  /**
   * Executes a SQL query that returns multiple rows.
   * @param sql The SQL query to execute.
   * @param params The parameters to bind to the query.
   * @returns A promise that resolves with an array of rows.
   * @throws If there is an error executing the query.
   */
  async getAllQuery(sql: string, params: any[] = []): Promise<any[]> {
    try {
      return await this.db.all(sql, params)
    } catch (error: any) {
      this.loggerService.error(`Database error: ${error.message}`)
      throw error
    }
  }

  /**
   * Executes a SQL query that returns a single row.
   * @param sql The SQL query to execute.
   * @param params The parameters to bind to the query.
   * @returns A promise that resolves with the first row returned by the query.
   * @throws If there is an error executing the query.
   */
  async getQuery(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.get(sql, params)
    } catch (error: any) {
      this.loggerService.error(`Database error: ${error.message}`)
      throw error
    }
  }

  /**
   * Closes the database connection.
   */
  async close(): Promise<void> {
    await this.db.close()
  }
}
