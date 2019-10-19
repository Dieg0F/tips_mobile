/**
 * Classe para perfis, o memso obj será usado para empresas e autonomos, pois assim fica tudo em uma tabela só
 * Podendo ocorrer alterações!!!!
 */
export interface Profile {
    uid: string;
    name: {
        firstName: string;
        lastName: string;
    };
    email: string;
    isAPro: boolean;
    isActive: boolean;
    phone: string;
    street: string;
    houseNumber: string;
    district: string;
    city: string;
    state: string;
    cpf: string;
    geoLocation: {
        lat: number;
        lng: number;
    };
    job: string;
    aboutMe: string;
    profilePhotoUrl: string;
    hideMyProfile: boolean;
    userRate: number;
    userMinRate: number;
    userMaxRate: number;
    solicitationCount: number;
    avaliationsCount: number;
    deviceToken: string;
}
