import { GeoLocation } from "../geoLocation/geoLocation";

/**
 * Classe para perfis, o memso obj será usado para empresas e autonomos, pois assim fica tudo em uma tabela só
 * Podendo ocorrer alterações!!!!
 */
export interface Profile {
    uid: string;
    nome: string;
    email: string;
    isAPro: boolean;
    isActive: boolean;
    telefone: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    cpf: string;
    geoLocation: GeoLocation,
    areaAtuacao: string;
    setor?: string;
    aboutMe: string;
    profilePhotoUrl: string;
    hideMyProfile: boolean;
    userGalery: Array<string>;
    userRate: number;
    userMinRate: number;
    userMaxRate: number;
    servicesCount: number;
    avaliationsCount: number;
    deviceToken: string;
}


