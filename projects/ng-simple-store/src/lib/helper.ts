import { EntityState } from './entity.store';

// @internal
export type getEntityType<S> = S extends EntityState<infer E> ? E : never;

export function isNil(obj: any): boolean {
    return obj == null;
}

export function isEmpty(obj: any): boolean {
    return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

export function notEmpty(obj: any): boolean {
    return !isEmpty(obj);
}

export function compact<T>(arr: Array<T>): Array<T> {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.filter(Boolean);
}
