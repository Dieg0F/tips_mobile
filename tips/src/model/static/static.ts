import { Profile } from "../profile/profile";

export class AppConfig {
    public static USER_PROFILE: Profile = {
        uid: "",
        name: {
            firstName: "",
            lastName: "",
        },
        email: "",
        isAPro: true,
        isActive: true,
        phone: "",
        street: "",
        houseNumber: "",
        district: "",
        city: "",
        state: "",
        cpf: "",
        geoLocation: {
            lat: 0,
            lng: 0
        },
        job: "",
        aboutMe: "",
        profilePhotoUrl: "",
        hideMyProfile: false,
        userRate: 0,
        userMaxRate: 0,
        userMinRate: 0,
        solicitationCount: 0,
        avaliationsCount: 0,
        deviceToken: ""
    }

    public static HAS_USER: boolean = false

    public static PROFILE_PHOTO_PATH = 'profilePhoto/'
}