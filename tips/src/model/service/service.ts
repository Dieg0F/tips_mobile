/**
 * Interface para Serviços, com o Id do perfil contratado (hiredUid) e do contratante (hiresUid).
 * Pode ocorrer mudanças.
 */
export interface Service {
    uId: string;
    serviceId: string;
    ownerUid: string;
    contractorUid: string;
    hiredUid: string;
    lastActionByUserUid: string;
    avaliationUid: string;
    name: string;
    description: string;
    date: string;
    status: string;
    isRemoved: boolean;
}