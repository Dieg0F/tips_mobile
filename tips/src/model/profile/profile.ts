import { GeoLocation } from "../geoLocation/geoLocation";
import { Avaliation } from "../Avaliation/avaliation";
import { Contract } from "../contract/contract";

/**
 * Classe para perfis, o memso obj será usado para empresas e autonomos, pois assim fica tudo em uma tabela só
 * Podendo ocorrer alterações!!!!
 */
export interface Profile {
    uid: string; // Salva da conta de autenticação
    nome: string; // Salva ao criar a conta
    email: string; // salva ao criar a conta
    isCompany: boolean; // Salva ao criar conta
    razaoSocial?: string;
    cnpjCpf: string;
    telefone: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    geoLocation: GeoLocation,
    inscEstadual?: string;
    inscMunicipal?: string;
    areaAtuacao: string;
    setor?: string;
    aboutMe: string;
    profilePhotoUrl: string;
    userGalery: Array<string>;
    userRate: Number;
    avaliations: Array<Avaliation>;
    contracts: Array<Contract>;
}