import { injectable } from "inversify";
import chalk from "chalk";

/**
 * Service for logging messages with different levels of severity.
 */
@injectable()
export class LoggerService {
  /**
   * Logs an informational message.
   * @param message - The message to be logged.
   */
  info(message: string): void {
    console.log(chalk.blue(message));
  }

  /**
   * Logs an error message.
   * @param message - The message to be logged.
   */
  error(message: string): void {
    console.error(chalk.red(message));
  }

  /**
   * Logs a success message.
   * @param message - The message to be logged.
   */
  success(message: string): void {
    console.log(chalk.green(message));
  }
}
