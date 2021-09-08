import { ApiStatuses } from './entity.store';
import { Injectable } from '@angular/core';
import { isNil } from './helper';
import { API_STATUS } from './api-status.constant';

@Injectable({
    providedIn: 'root',
})
export class ApiStatusService {
    buildLoadingStatuses(ids: string | string[]): { apiStatuses: ApiStatuses } {
        return this._buildStatuses(ids, API_STATUS.LOADING);
    }

    buildSuccessStatuses(ids: string | string[]): { apiStatuses: ApiStatuses } {
        return this._buildStatuses(ids, API_STATUS.SUCCESS);
    }

    buildFailStatuses(ids: string | string[]): { apiStatuses: ApiStatuses } {
        return this._buildStatuses(ids, API_STATUS.FAIL);
    }

    private _buildStatuses(ids: string | string[], status: API_STATUS): { apiStatuses: ApiStatuses } {
        if (isNil(ids)) {
            return { apiStatuses: {} };
        }

        ids = Array.isArray(ids) ? ids : [ids];

        const apiStatuses: ApiStatuses = {};

        ids.forEach((id) => (apiStatuses[id] = status));

        return { apiStatuses };
    }
}
