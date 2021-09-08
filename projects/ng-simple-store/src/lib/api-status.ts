import { isNil } from './helper';

export const enum API_STATUS {
    SUCCESS,
    LOADING,
    FAIL,
}

export interface ApiStatuses {
    [id: string]: API_STATUS;
}

export function buildLoadingStatuses(ids: string | string[]): { apiStatuses: ApiStatuses } {
    return buildStatuses(ids, API_STATUS.LOADING);
}

export function buildSuccessStatuses(ids: string | string[]): { apiStatuses: ApiStatuses } {
    return buildStatuses(ids, API_STATUS.SUCCESS);
}

export function buildFailStatuses(ids: string | string[]): { apiStatuses: ApiStatuses } {
    return buildStatuses(ids, API_STATUS.FAIL);
}

function buildStatuses(ids: string | string[], status: API_STATUS): { apiStatuses: ApiStatuses } {
    if (isNil(ids)) {
        return { apiStatuses: {} };
    }

    ids = Array.isArray(ids) ? ids : [ids];

    const apiStatuses: ApiStatuses = {};

    ids.forEach((id) => (apiStatuses[id] = status));

    return { apiStatuses };
}
