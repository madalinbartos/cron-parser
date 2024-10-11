import { mappedMonths } from "./constants";

const convertMonth = (month: string) => {
    return mappedMonths[month] || Number(month);
}

/**
 * Expands a cron field value to all possible values within a specified range.
 * Supports handling of ranges (e.g., '1-5'), steps (e.g., '*\/15'), and specific values.
 *
 * @param field - The cron field string to be expanded (e.g., '*\/15', '1,5-10').
 * @param start - The minimum value of the range (inclusive).
 * @param end - The maximum value of the range (inclusive).
 * @param fieldName - The name of the cron field (used for error messages).
 * @returns An array of numbers representing all the valid values in the field.
 * @throws Will throw an error if the field contains invalid values or ranges.
 */
const expandField = (field: string, start: number, end: number, fieldName: string): number[] => {
    const expanded: Set<number> = new Set();
    const parts = field.split(',');

    for (const fieldPart of parts) {
        let normalizedFieldPart = fieldPart.toUpperCase();

        if (fieldName === 'month' && mappedMonths[normalizedFieldPart]) {
            normalizedFieldPart = mappedMonths[normalizedFieldPart].toString();
        }

        if (normalizedFieldPart.includes('/')) {
            const [initial, step] = normalizedFieldPart.split('/');
            const parsedStep = Number(step);
            const parsedInitial = Number(initial);

            if (isNaN(parsedStep) || parsedStep <= start || parsedStep > end) {
                throw new Error(`Invalid step value in ${fieldName}: ${fieldPart}`);
            }

            let initialStart: number;

            if (initial === "*") {
                initialStart = start;
            }
            else if (!isNaN(parsedInitial)) {
                initialStart = parsedInitial;
            }
            else {
                throw new Error(`Invalid initial value in ${fieldName}: ${fieldPart}`)
            }

            for (let i = initialStart; i <= end; i += parsedStep) {
                expanded.add(i);
            }
        }
        else if (normalizedFieldPart.includes('-')) {
            const [rangeStart, rangeEnd] = normalizedFieldPart.split('-').map((part) => {
                if (fieldName === 'month') {
                    return convertMonth(part)
                }
                if (isNaN(parseInt(part))) {
                    throw new Error(`Invalid ${fieldName} range: ${fieldPart}`)
                }
                return Number(part);
            });
            if (rangeStart < start || rangeEnd > end) {
                throw new Error(`Invalid ${fieldName} range: ${fieldPart}`);
            }
            if (rangeStart < rangeEnd) {
                for (let i = rangeStart; i <= rangeEnd; i++) {
                    expanded.add(i);
                }
            }
            else {
                for (let i = rangeStart; i <= end; i++) {
                    expanded.add(i);
                }
                for (let i = start; i <= rangeEnd; i++) {
                    expanded.add(i);
                }
            }

        } else if (normalizedFieldPart === '*') {
            for (let i = start; i <= end; i++) {
                expanded.add(i);
            }
        } else {
            const value = parseInt(normalizedFieldPart);
            if (isNaN(value) || value < start || value > end) {
                throw new Error(`Invalid ${fieldName} value: ${fieldPart}`);
            }
            expanded.add(value);
        }
    }

    return Array.from(expanded).sort((a, b) => a - b);
};

export default expandField;