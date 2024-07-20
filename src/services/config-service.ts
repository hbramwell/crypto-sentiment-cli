import { config } from "dotenv"
import { injectable } from "inversify"

/**
 * Service for managing configuration variables.
 */
@injectable()
export class ConfigService {
  constructor() {
    // Load environment variables from .env file
    config()
  }

  /**
   * Retrieves the value of a specific environment variable.
   * @param key - The name of the environment variable.
   * @returns The value of the environment variable, or an empty string if it is not defined.
   */
  get(key: string): string {
    return process.env[key] || ""
  }
}
