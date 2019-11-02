import { Profile } from '../../model/profile/profile';
import { Solicitation } from '../../model/solicitation/solicitation';
import { Constants } from '../../util/constants/constants';

const SOLICITATION_IS_OPEN = '1';
const SOLICITATION_IS_RUNNING = '2';
const SOLICITATION_IS_FINISHED = '3';
const SOLICITATION_IS_CANCELED = '4';

export class MockUsers {

    public buildList(users: Profile[]) {
        return [];
    }

    public setStatus(solicitations: Solicitation[]) {
        solicitations.forEach((s) => {
            switch (s.status) {
                case SOLICITATION_IS_OPEN:
                    s.status = Constants.SOLICITATION_IS_OPEN;
                    break;
                case SOLICITATION_IS_RUNNING:
                    s.status = Constants.SOLICITATION_IS_RUNNING;
                    break;
                case SOLICITATION_IS_FINISHED:
                    s.status = Constants.SOLICITATION_IS_FINISHED;
                    break;
                case SOLICITATION_IS_CANCELED:
                    s.status = Constants.SOLICITATION_IS_CANCELED;
                    break;
            }
        });
        return [];
    }

    public getSolicitations() {
        return [];
    }
}
