export class Constants {

    /**
     * Firebase Collections.
     */
    public static PROFILES_COLLECTION = 'profiles';
    public static USERS_COLLECTION = 'users';
    public static AVALIATIONS_COLLECTION = 'avaliations';
    public static SOLICITATION_COLLECTION = 'solicitations';
    public static SECTORS_COLLECTION = 'sectors';
    public static AREAS_COLLECTION = 'areas';

    /**
     * Local Storage Keys
     */
    public static USER_PROFILE_LOCAL_DB = 'userProfile';
    public static USER_LOCAL_DB = 'user';
    public static USER_AUTH_LOCAL_DB = 'userAuth';
    public static SECTORS_LOCAL_DB = 'sectors';

    /**
     * Default values for Profiles searchs.
     */
    public static DEFAULT_VALUE_FOR_JOB_SEARCH = 'Selecione uma profissão.';
    public static DEFAULT_VALUE_FOR_STATE_SEARCH = 'Selecione um estado.';
    public static DEFAULT_VALUE_FOR_CITY_SEARCH = 'Escolha um estado primeiro.';
    public static DEFAULT_VALUE_FOR_RATE_SEARCH = 'Selecione uma nota de avaliação';

    /**
     * NavParams Keys
     */
    public static AVALIATION_DETAILS = 'avaliation';
    public static AVALIATION_DETAILS_OWNER = 'avaliationOwner';
    public static AVALIATION_OWNER_ID = 'ownerAvaliationsUid';
    public static AVALIATION_AS_VISITOR = 'asVisitor';

    public static AVALIATION_RECEIVED = 'Avaliações recebidas';
    public static AVALIATION_DONE = 'Avaliações feitas';
    public static ALL_AVALIAITONS = 'Todas as avaliações';

    public static SOLICITATION_DETAILS = 'solicitation';
    public static SOLICITATION_DETAILS_HIRED = 'hiredProfile';
    public static SOLICITATION_PROFILE = 'profileToSolicitation';

    public static PROFILE_LIST = 'profiles';

    public static CONTACT_PROFILE = 'userProfile';

    /**
     * Solicitation status.
     */
    public static SOLICITATION_IS_OPEN = 'SOLICITATION_IS_OPEN';
    public static SOLICITATION_IS_RUNNING = 'SOLICITATION_IS_RUNNING';
    public static SOLICITATION_IS_FINISHED = 'SOLICITATION_IS_FINISHED';
    public static SOLICITATION_IS_CANCELED = 'SOLICITATION_IS_CANCELED';
    public static SOLICITATION_IS_REMOVED = 'SOLICITATION_IS_REMOVED';
    public static SOLICITATION_IS_AWAIT_TO_FINISH = 'SOLICITATION_IS_AWAIT_TO_FINISH';
    public static SOLICITATION_IS_AWAIT_TO_CANCEL = 'SOLICITATION_IS_AWAIT_TO_CANCEL';

    /**
     * Solicitations search tags.
     */
    public static SOLICITATIONS_RECEIVED = 'SOLICITATIONS_RECEIVED';
    public static SOLICITATIONS_DONE = 'SOLICITATIONS_DONE';
    public static ALL_SOLICITATIONS = 'ALL_SOLICITATIONS';

    /**
     * Search values
     */
    public static SEARCH_COMPLETE = 'SEARCH_COMPLETE';
    public static SEARCH_BASIC = 'SEARCH_BASIC';
    public static SEARCH_DISABLED = 'SEARCH_DISABLED';

    /**
     * Login error values
     */
    public static USER_NOT_FOUND = 'auth/user-not-found';
    public static LOGIN_NETWORK_FAIL = 'auth/network-request-failed';
    public static USER_WRONG_PASS = 'auth/wrong-password';
    public static NEW_ACCOUNT_EMAIL_IN_USE = 'auth/email-already-in-use';
}
