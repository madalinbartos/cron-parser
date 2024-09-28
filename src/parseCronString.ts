import expandField from "./expandField";

/**
 * Formats the output by aligning the field name to the left and joining the values.
 *
 * @param fieldName - The name of the cron field (e.g., 'minute', 'hour').
 * @param values - An array of numbers or strings representing the expanded cron field values.
 * @returns A formatted string representing the cron field and its values.
 */
const formatOutput = (fieldName: string, values: number[] | string[]): string => `${fieldName.trim().padEnd(14)}${values.join(' ')}`;;

/**
 * Parses a cron string and expands each field to show the times at which it will run.
 * Logs the formatted output to the console.
 *
 * @param cronString - The cron string to be parsed (e.g., '*\/15 0 1,15 * 1-5 /usr/bin/find').
 * @throws Will throw an error if the cron string format is invalid.
 */
const parseCronString = (cronString: string): void => {
    if (!cronString) {
        throw new Error("No cron string provided. Please provide a valid cron string as an argument.");
    }

    const fields = cronString.split(' ');

    if (fields.length < 6) {
        throw new Error("Invalid cron string. Expected format: 'minute hour day_of_month month day_of_week command'");
    }

    const [minuteField, hourField, dayOfMonthField, monthField, dayOfWeekField, ...command] = fields;

    const minutes = expandField(minuteField, 0, 59, 'minute');
    const hours = expandField(hourField, 0, 23, 'hour');
    const daysOfMonth = expandField(dayOfMonthField, 1, 31, 'day of month');
    const months = expandField(monthField, 1, 12, 'month');
    const daysOfWeek = expandField(dayOfWeekField, 1, 7, 'day of week');

    const output = [
        formatOutput('minute', minutes),
        formatOutput('hour', hours),
        formatOutput('day of month', daysOfMonth),
        formatOutput('month', months),
        formatOutput('day of week', daysOfWeek),
        formatOutput('command', command)
    ];

    console.log(output.join('\n'));
};

export default parseCronString;