export class Constants {

    /**
     * Firebase Collections.
     */
    static PROFILES_COLLECTION = "profiles";
    static USERS_COLLECTION = "users";
    static AVALIATIONS_COLLECTION = "avaliations";
    static SOLICITATION_COLLECTION = "solicitations";
    static SECTORS_COLLECTION = "sectors";
    static AREAS_COLLECTION = "areas";

    /**
     * Local Storage Keys
     */
    static USER_PROFILE_LOCAL_DB = "userProfile";
    static USER_LOCAL_DB = "user";
    static USER_AUTH_LOCAL_DB = "userAuth";
    static SECTORS_LOCAL_DB = "sectors";

    /**
     * Default values for Profiles searchs.
     */
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

    static SOLICITATION_DETAILS = "solicitation";
    static SOLICITATION_DETAILS_HIRED = "hiredProfile";
    static SOLICITATION_PROFILE = "profileToSolicitation";

    static PROFILE_LIST = "profiles";

    static CONTACT_PROFILE = "userProfile";

    /**
     * Solicitation status.
     */
    static SOLICITATION_IS_OPEN = "SOLICITATION_IS_OPEN";
    static SOLICITATION_IS_RUNNING = "SOLICITATION_IS_RUNNING";
    static SOLICITATION_IS_FINISHED = "SOLICITATION_IS_FINISHED";
    static SOLICITATION_IS_CANCELED = "SOLICITATION_IS_CANCELED";
    static SOLICITATION_IS_REMOVED = "SOLICITATION_IS_REMOVED";
    static SOLICITATION_IS_AWAIT_TO_FINISH = "SOLICITATION_IS_AWAIT_TO_FINISH";
    static SOLICITATION_IS_AWAIT_TO_CANCEL = "SOLICITATION_IS_AWAIT_TO_CANCEL";

    /**
     * Solicitations search tags.
     */
    static SOLICITATIONS_RECEIVED = "SOLICITATIONS_RECEIVED";
    static SOLICITATIONS_DONE = "SOLICITATIONS_DONE";
    static ALL_SOLICITATIONS = "ALL_SOLICITATIONS";

    /**
     * Search values
     */
    static SEARCH_COMPLETE = "SEARCH_COMPLETE";
    static SEARCH_BASIC = "SEARCH_BASIC";
    static SEARCH_DISABLED = "SEARCH_DISABLED";
}

