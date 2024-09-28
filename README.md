# Cron Parser

A TypeScript command-line application for parsing and expanding cron strings into the specific times they represent.

## Overview

This tool parses a cron expression and expands each of its five fields (minute, hour, day of month, month, day of week) to show the exact times at which the cron job will run. The parsed cron string is then formatted and printed in a table-like format.

## Installation

Install dependencies:

```
npm install
```

## Usage

To run the application, use the following command:

```
npm start -- "<cron_string>"
```

Replace <cron_string> with the actual cron string you want to parse.

Example:

```
npm start -- "*/15 0 1,15 * 1-5 /usr/bin/find"
```

Expected output for the example above:

```
minute         0 15 30 45
hour           0
day of month   1 15
month          1 2 3 4 5 6 7 8 9 10 11 12
day of week    1 2 3 4 5
command        /usr/bin/find
```

## Testing

Run all tests:
```
npm test
```

Run tests silently (without the `console.log` output):
```
npm run test:silent
```

Run tests in watch mode:
```
npm run test:watch
```