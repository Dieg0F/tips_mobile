import { Injectable } from '@angular/core';
import { HttpService } from '../../util/http/http';

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
const STATE_ENDIPOINT = '/estados';
const CITY_ENDIPOINT = '/municipios';

@Injectable()
export class Locations {

    constructor(private http: HttpService) { }

    /**
     * @description request all states from IBGE service.
     */
    public getStates() {
        return this.http.get(BASE_URL + STATE_ENDIPOINT);
    }

    /**
     * @description request all cties from IBGE service by state.
     */
    public getCityes(state: number) {
        return this.http.get(BASE_URL + STATE_ENDIPOINT + `/${state}` + CITY_ENDIPOINT);
    }
}
