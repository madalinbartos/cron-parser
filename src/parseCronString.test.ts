import parseCronString from './parseCronString';

describe('parseCronString', () => {
    it('should parse a valid cron string correctly', () => {
        const cronString = '*/15 0 1,15 * 1-5 /usr/bin/find';
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        parseCronString(cronString);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'minute        0 15 30 45\n' +
            'hour          0\n' +
            'day of month  1 15\n' +
            'month         1 2 3 4 5 6 7 8 9 10 11 12\n' +
            'day of week   1 2 3 4 5\n' +
            'command       /usr/bin/find'
        );

        consoleLogSpy.mockRestore();
    });

    it('should handle a cron string with single values', () => {
        const cronString = '0 12 1 1 1 /usr/bin/test';
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        parseCronString(cronString);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'minute        0\n' +
            'hour          12\n' +
            'day of month  1\n' +
            'month         1\n' +
            'day of week   1\n' +
            'command       /usr/bin/test'
        );

        consoleLogSpy.mockRestore();
    });

    it('should handle mixed valid and invalid ranges', () => {
        const cronString = '0 0 1-5 1-12 1-7 /usr/bin/find';

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        parseCronString(cronString);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'minute        0\n' +
            'hour          0\n' +
            'day of month  1 2 3 4 5\n' +
            'month         1 2 3 4 5 6 7 8 9 10 11 12\n' +
            'day of week   1 2 3 4 5 6 7\n' +
            'command       /usr/bin/find'
        );

        consoleLogSpy.mockRestore();
    });

    it('should throw an error for an invalid cron string with missing fields', () => {
        const cronString = '*/15 0 1,15';
        expect(() => parseCronString(cronString)).toThrow('Invalid cron string. Expected format: \'minute hour day_of_month month day_of_week command\'');
    });

    it('should throw an error for invalid minute range', () => {
        const cronString = '60 0 * * * /usr/bin/find';
        expect(() => parseCronString(cronString)).toThrow('Invalid minute value: 60');
    });

    it('should throw an error for invalid hour range', () => {
        const cronString = '*/15 24 * * * /usr/bin/find';
        expect(() => parseCronString(cronString)).toThrow('Invalid hour value: 24');
    });

    it('should throw an error for invalid day of month', () => {
        const cronString = '0 0 32 * * /usr/bin/find';
        expect(() => parseCronString(cronString)).toThrow('Invalid day of month value: 32');
    });

    it('should throw an error for invalid month', () => {
        const cronString = '0 0 1 13 * /usr/bin/find';
        expect(() => parseCronString(cronString)).toThrow('Invalid month value: 13');
    });

    it('should throw an error for invalid day of week', () => {
        const cronString = '0 0 * * 8 /usr/bin/find';
        expect(() => parseCronString(cronString)).toThrow('Invalid day of week value: 8');
    });
});
