
import { Headers, Http, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

	/**
	 * Request Service Constructor
	 * @param http Class with method used to make a HTTP Request
	 */
    constructor(
        public http: Http,
    ) { }

    async setHeader() {
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({ headers: headers });
    }

	/**
	 * Method to perform GET on the desired url
	 * @param url url that will get the GET
	 */
    public async get(url: string): Promise<any> {
        let options = await this.setHeader();
        return new Promise((resolve, reject) => {
            this.http.get(url, options)
                .subscribe(data => {
                    resolve(data.json());
                }, (error) => {
                    reject(error);
                });
        });
    }

	/**
	 * Method to perform POST in the desired url by passing an object in the body
	 * @param data JSON object that will be attached to the body
	 * @param url Url to be POST
	 */
    public async post(data: any, url: string): Promise<any> {
        let options = await this.setHeader();
        return new Promise((resolve, reject) => {
            this.http.post(url, data, options)
                .subscribe(data => {
                    resolve(data);
                }, (err) => {
                    reject(err);
                });
        });
    }

	/**
	 * Method to perform POST in the desired url by passing an object in the body
	 * @param data JSON object that will be attached to the body
	 * @param url Url to be POST
	 */
    public async put(data: any, url: string): Promise<any> {
        let options = await this.setHeader();
        return new Promise((resolve, reject) => {
            this.http.put(url, data, options)
                .subscribe(data => {
                    resolve(data);
                }, (err) => {
                    reject(err);
                });
        });
    }
}
