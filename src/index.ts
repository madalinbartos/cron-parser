import parseCronString from "./parseCronString";

/**
 * Main entry point for the cron parser application.
 * Retrieves the cron string from the command line arguments and attempts to parse it.
 * If an error occurs during parsing, it logs the error message to the console and exits the program.
 */
const cronString = process.argv[2];

try {
    parseCronString(cronString);
}
catch (error) {
    console.error((error as Error).message);
    process.exit(1);
}