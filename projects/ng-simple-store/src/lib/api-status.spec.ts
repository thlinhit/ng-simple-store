import { API_STATUS, buildFailStatuses, buildLoadingStatuses, buildSuccessStatuses } from './api-status';

describe('ApiStatus', () => {
    test.each([
        [null, { apiStatuses: {} }],
        [undefined, { apiStatuses: {} }],
        [[], { apiStatuses: {} }],
    ])('given %p as input, returns %p', (input, expectedResult) => {
        expect(buildLoadingStatuses(input)).toEqual(expectedResult);
        expect(buildSuccessStatuses(input)).toEqual(expectedResult);
        expect(buildFailStatuses(input)).toEqual(expectedResult);
    });

    test.each([
        ['1', { apiStatuses: { ['1']: API_STATUS.LOADING } }],
        [['1'], { apiStatuses: { ['1']: API_STATUS.LOADING } }],
        [
            ['1', '2'],
            {
                apiStatuses: {
                    ['1']: API_STATUS.LOADING,
                    ['2']: API_STATUS.LOADING,
                },
            },
        ],
    ])('given %p as input, buildLoadingStatuses returns %p', (input, expectedResult) => {
        expect(buildLoadingStatuses(input)).toEqual(expectedResult);
    });

    test.each([
        ['1', { apiStatuses: { ['1']: API_STATUS.SUCCESS } }],
        [['1'], { apiStatuses: { ['1']: API_STATUS.SUCCESS } }],
        [
            ['1', '2'],
            {
                apiStatuses: {
                    ['1']: API_STATUS.SUCCESS,
                    ['2']: API_STATUS.SUCCESS,
                },
            },
        ],
    ])('given %p as input, buildSuccessStatuses returns %p', (input, expectedResult) => {
        expect(buildSuccessStatuses(input)).toEqual(expectedResult);
    });

    test.each([
        ['1', { apiStatuses: { ['1']: API_STATUS.FAIL } }],
        [['1'], { apiStatuses: { ['1']: API_STATUS.FAIL } }],
        [
            ['1', '2'],
            {
                apiStatuses: {
                    ['1']: API_STATUS.FAIL,
                    ['2']: API_STATUS.FAIL,
                },
            },
        ],
    ])('given %p as input, buildFailStatuses returns %p', (input, expectedResult) => {
        expect(buildFailStatuses(input)).toEqual(expectedResult);
    });
});
