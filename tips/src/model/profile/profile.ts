import { GeoLocation } from "../geoLocation/geoLocation";

/**
 * Classe para perfis, o memso obj será usado para empresas e autonomos, pois assim fica tudo em uma tabela só
 * Podendo ocorrer alterações!!!!
 */
export interface Profile {
    uid: string; // Salva da conta de autenticação
    nome: string; // Salva ao criar a conta
    email: string; // salva ao criar a conta    
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
}
