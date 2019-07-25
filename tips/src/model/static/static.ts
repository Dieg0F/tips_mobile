import { Profile } from "../profile/profile";

export class AppConfig {
    public static USER_PROFILE: Profile = {
        uid: "",
        nome: "",
        email: "",
        isCompany: false,
        razaoSocial: "",
        cnpjCpf: "",
        telefone: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        inscEstadual: "",
        inscMunicipal: "",
        areaAtuacao: "",
        setor: "",
        aboutMe: "",
        profilePhotoUrl: "",
        userGalery: [],    
        geoLocation: undefined,                
        avaliations: [],
        contracts: []
    }

    public static HAS_USER: boolean = false

    public static PROFILE_PHOTO_PATH = 'profilePhoto/'
}