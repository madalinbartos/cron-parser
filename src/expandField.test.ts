import expandField from './expandField';

describe('expandField', () => {
    test('expands a single value', () => {
        expect(expandField('5', 0, 59, 'minute')).toEqual([5]);
    });

    test('expands a range of values', () => {
        expect(expandField('1-5', 0, 59, 'minute')).toEqual([1, 2, 3, 4, 5]);
    });

    test('expands a stepped value expression with asterisk start', () => {
        expect(expandField('*/15', 0, 59, 'minute')).toEqual([0, 15, 30, 45]);
    });

    test('expands a stepped value expression with zero start', () => {
        expect(expandField('0/15', 0, 59, 'minute')).toEqual([0, 15, 30, 45]);
    });

    test('expands a stepped value expression with one start', () => {
        expect(expandField('1/15', 0, 59, 'minute')).toEqual([1, 16, 31, 46]);
    });

    test('expands a stepped value expression with mixed values, ranges and asterisk', () => {
        expect(expandField('1,3,5-7,*/20', 0, 59, 'minute')).toEqual([0, 1, 3, 5, 6, 7, 20, 40]);
    });

    test('expands full wildcard', () => {
        expect(expandField('*', 0, 59, 'minute')).toEqual([...Array(60).keys()]);
    });

    test('throws error on a stepped value expression with mixed values and ranges', () => {
        expect(() => expandField('1,3,5-7/20', 0, 59, 'minute')).toThrow('Invalid initial value in minute: 5-7/20');
    });

    test('throws error on invalid range', () => {
        expect(() => expandField('60-70', 0, 59, 'minute')).toThrow('Invalid minute range: 60-70');
    });

    test('throws error on zero step', () => {
        expect(() => expandField('*/0', 0, 59, 'minute')).toThrow('Invalid step value in minute: */0');
    });

    test('throws error on negative step', () => {
        expect(() => expandField('*/-5', 0, 59, 'minute')).toThrow('Invalid step value in minute: */-5');
    });

    test('throws error on non-numeric step', () => {
        expect(() => expandField('*/foo', 0, 59, 'minute')).toThrow('Invalid step value in minute: */foo');
    });

    test('throws error on out of range step', () => {
        expect(() => expandField('*/500', 0, 59, 'minute')).toThrow('Invalid step value in minute: */500');
    });

    test('throws error on empty input', () => {
        expect(() => expandField('', 0, 59, 'minute')).toThrow('Invalid minute value: ');
    });

    test('throws error on non-numeric values', () => {
        expect(() => expandField('a,b,c', 0, 59, 'minute')).toThrow('Invalid minute value: a');
    });

    test('throws error on mixed valid and invalid inputs', () => {
        expect(() => expandField('5,foo', 0, 59, 'minute')).toThrow('Invalid minute value: foo');
    });

    test('throws error on invalid characters', () => {
        expect(() => expandField('1,2,3,@', 0, 59, 'minute')).toThrow('Invalid minute value: @');
    });
});
