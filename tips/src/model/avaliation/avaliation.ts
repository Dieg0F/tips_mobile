// tslint:disable-next-line:interface-name
export interface Avaliation {
    uId: string;
    evaluatorUid: string;
    ratedUid: string;
    solicitationId: string;
    name: string;
    profileNames: {
        evaluatorName: string;
        ratedName: string;
    };
    body: string;
    rate: number;
    date: number;
}
