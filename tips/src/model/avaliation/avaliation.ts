export interface Avaliation {
    uId: string;
    evaluatorUid: string;
    ratedUid: string;
    serviceUid: string;
    name: string;
    profileNames: {
        evaluatorName: string;
        ratedName: string;
    }
    body: string;
    rate: number;
    date: number;
}


