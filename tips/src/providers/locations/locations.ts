import { HttpService } from "../../util/http/http";
import { Injectable } from "@angular/core";

const BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades"
const STATE_ENDIPOINT = "/estados"
const CITY_ENDIPOINT = "/municipios"

@Injectable()
export class Locations {

    constructor(private http: HttpService) { }

    getStates() {
        this.http.get(BASE_URL + STATE_ENDIPOINT)
            .then((res) => {
                console.log(res)
            })
    }

    getCityes(state: number) {
        this.http.get(BASE_URL + STATE_ENDIPOINT + `/${state}` + CITY_ENDIPOINT)
            .then((res) => {
                console.log(res)
            })
    }
}