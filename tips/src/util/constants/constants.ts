export class Constants {

    /**
     * Firebase Collections.
     */
    static PROFILES_COLLECTION = "profiles";
    static USERS_COLLECTION = "users";
    static AVALIATIONS_COLLECTION = "avaliations";
    static SERVICES_COLLECTION = "services";
    static SECTORS_COLLECTION = "sectors";
    static AREAS_COLLECTION = "areas";

    /**
     * Local Storage Keys
     */
    static USER_PROFILE_LOCAL_DB = "userProfile";
    static USER_LOCAL_DB = "user";
    static USER_AUTH_LOCAL_DB = "userAuth";
    static SECTORS_LOCAL_DB = "sectors";

    static DEFAULT_VALUE_FOR_JOB_SEARCH = "Selecione uma profissão."
    static DEFAULT_VALUE_FOR_STATE_SEARCH = "Selecione um estado."
    static DEFAULT_VALUE_FOR_CITY_SEARCH = "Escolha um estado primeiro."
    static DEFAULT_VALUE_FOR_RATE_SEARCH = "Selecione uma nota de avaliação"

    /**
     * NavParams Keys
     */
    static AVALIATION_DETAILS = "avaliation";
    static AVALIATION_DETAILS_OWNER = "avaliationOwner";
    static AVALIATION_OWNER_ID = "ownerAvaliationsUid";
    static AVALIATION_HIDE_DETAILS = "hideDetailsOptions";

    static SERVICE_DETAILS = "service";
    static SERVICE_DETAILS_HIRED = "hiredProfile";
    static SERVICE_PROFILE = "profileToService";

    static PROFILE_LIST = "profiles";

    static CONTACT_PROFILE = "userProfile";

    static SERVICE_IS_OPEN = "SERVICE_IS_OPEN";
    static SERVICE_IS_RUNNING = "SERVICE_IS_RUNNING";
    static SERVICE_IS_FINISHED = "SERVICE_IS_FINISHED";
    static SERVICE_IS_CANCELED = "SERVICE_IS_CANCELED";
    static SERVICE_IS_REMOVED = "SERVICE_IS_REMOVED";
    static SERVICE_IS_AWAIT_TO_FINISH = "SERVICE_IS_AWAIT_TO_FINISH";
    static SERVICE_IS_AWAIT_TO_CANCEL = "SERVICE_IS_AWAIT_TO_CANCEL";

    static SERVICES_RECEIVED = "SERVICES_RECEIVED";
    static SERVICES_DONE = "SERVICES_DONE";
    static ALL_SERVICES = "ALL_SERVICES";

    static SEARCH_COMPLETE = "SEARCH_COMPLETE";
    static SEARCH_BASIC = "SEARCH_BASIC";
    static SEARCH_DISABLED = "SEARCH_DISABLED";
}