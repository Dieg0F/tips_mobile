/**
 * Interface para Serviços, com o Id do perfil contratado (hiredUid) e do contratante (hiresUid).
 * Pode ocorrer mudanças.
 */
export interface Solicitation {
    uId: string;
    solicitationId: string;
    contractorUid: string;
    hiredUid: string;
    lastActionByUserUid: string;
    name: string;
    description: string;
    observations: Array<string>;
    date: string;
    status: string;
    removedTo: {
        contractorUid: string;
        hiredUid: string;
    }
    avaliatedTo: {
        contractorAvaliation: string;
        hiredAvaliation: string;
    }
}
