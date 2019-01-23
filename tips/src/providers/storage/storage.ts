import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageProvider {

    constructor(private storage: Storage) { }

    public getItem(key: string): Promise<any> {
        console.log('Getting from storage')
        return this.storage.get(key)        
    }

    public setItem(key: string, obj: any): Promise<any> {
        console.log('Saving on storage')
        return this.storage.set(key, JSON.stringify(obj))
    }

    public removeItem(key: string): Promise<void> {
        return this.storage.remove(key)
    }
}