/**
 * Interface para Contratos, com o Id do perfil contratado (hiredUid) e do contratante (hiresUid).
 * Pode ocorrer mudanças.
 */
export interface Contract {
    contractId: string; 
    hiredUid: string; //Contratado
    hiresUid: string; //Contratante
}