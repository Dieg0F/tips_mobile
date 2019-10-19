import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageProvider {

    constructor(private storage: Storage) { }

    /**
     * @description request value from storage.
     * @param key data key on storage.
     */
    public getItem(key: string): Promise<any> {
        return this.storage.get(key);
    }

    /**
     * @description save data on storage.
     * @param key data key on storage.
     * @param obj data to be saved.
     */
    public setItem(key: string, obj: any): Promise<any> {
        return this.storage.set(key, JSON.stringify(obj));
    }

    /**
     * @description remove data from storage.
     * @param key data key on storage.
     */
    public removeItem(key: string): Promise<void> {
        return this.storage.remove(key);
    }

    /**
     * @description clear all data on storage.
     */
    public clearAll() {
        return this.storage.clear();
    }
}
