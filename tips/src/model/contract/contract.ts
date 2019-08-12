/**
 * Interface para Contratos, com o Id do perfil contratado (hiredUid) e do contratante (hiresUid).
 * Pode ocorrer mudanças.
 */
export interface Contract {
    uId: string;
    name: string;
    description: string;
    userUid: string; //Contratante
    hiredUid: string; //Contratado
    date: string;
    status: string;
    isActive: boolean;
    isRemoved: boolean;
}