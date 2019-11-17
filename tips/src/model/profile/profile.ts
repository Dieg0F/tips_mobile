/**
 * Classe para perfis, o memso obj será usado para empresas e autonomos, pois assim fica tudo em uma tabela só
 * Podendo ocorrer alterações!!!!
 */
// tslint:disable-next-line:interface-name
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
    userRateStars: number;
    userMinRate: number;
    userMaxRate: number;
    solicitationCount: number;
    avaliationsCount: number;
    deviceToken: string;
    social: {
        facebook: string;
        showFacebook: boolean;
        instagram: string;
        showInstagram: boolean;
        whatsapp: string;
        showWhatsApp: boolean;
        directCall: boolean;
    };
    accStatus: string;
}
