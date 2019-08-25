import { Profile } from "../profile/profile";

export class AppConfig {
    public static USER_PROFILE: Profile = {
        uid: "",
        nome: "",
        email: "",
        telefone: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        cpf: "",
        areaAtuacao: "",
        setor: "",
        aboutMe: "",
        profilePhotoUrl: "",
        userGalery: [],
        hideMyProfile: false,
        userRate: 0,
        userMaxRate: 0,
        userMinRate: 0,
        contractsCount: 0,
        avaliationsCount: 0,
        geoLocation: undefined,
    }

    public static HAS_USER: boolean = false

    public static PROFILE_PHOTO_PATH = 'profilePhoto/'
}