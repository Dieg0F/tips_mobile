/**
 * Interface para Contratos, com o Id do perfil contratado (hiredUid) e do contratante (hiresUid).
 * Pode ocorrer mudanças.
 */
export interface Contract {
    uId: string;
    contractId: string;
    ownerUid: string;
    contractorUid: string;
    hiredUid: string;
    lastActionByUserUid: string;
    name: string;
    description: string;
    date: string;
    status: string;
    isRemoved: boolean;
}