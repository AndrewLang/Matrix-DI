

export interface IKeyValuePair<TKey, TValue> {
    Key: TKey;
    Value: TValue;
}

export interface IDictionary<TKey, TValue> {
    Add(key: TKey, value: TValue): void;
    ContainsKey(key: TKey): boolean;
    Item(key: TKey): TValue;
    Keys(): TKey[];
    Remove(key: TKey): boolean;
    Values(): TValue[];
    readonly Items: IKeyValuePair<TKey, TValue>[];
    FirstOrDefault(predicate?: (item: IKeyValuePair<TKey, TValue>) => boolean): IKeyValuePair<TKey, TValue> ;
}

export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    private internalMap = new Map<TKey, TValue>();
    private items = [];

    get Items(): IKeyValuePair<TKey, TValue>[] {
        return this.items;
    }

    Add(key: TKey, value: TValue): void {
        this.internalMap.set(key, value);
        this.items.push({ Key: key, Value: value });
    }
    ContainsKey(key: TKey): boolean {
        return this.internalMap.has(key);
    }
    Count(): number {
        return this.internalMap.size;
    }
    Item(key: TKey): TValue {
        return this.internalMap.get(key);
    }
    Keys(): TKey[] {
        let keys = [];

        this.internalMap.forEach((value, key) => {
            keys.push(key);
        })
        return keys;
    }
    Remove(key: TKey): boolean {
        let entity;
        for (let item of this.items) {
            if (item.Key === key) {
                entity = item;
                break;
            }
        }
        if (entity) {
            let index = this.items.indexOf(entity);
            this.items.splice(index, 1);
        }

        return this.internalMap.delete(key);
    }
    Values(): TValue[] {
        let values = [];
        this.internalMap.forEach((value, key) => {
            values.push(value);
        })

        return values;
    }

    FirstOrDefault(predicate?: (item: IKeyValuePair<TKey, TValue>) => boolean): IKeyValuePair<TKey, TValue> {

        let result: IKeyValuePair<TKey, TValue>;

        for (let item of this.items) {

            if (predicate) {
                if (predicate(item)) {
                    result = item;
                    break;
                }
            } else {
                result = item;
                break;
            }
        }

        return result;
    }
}