/**
 * Classe para perfis, o memso obj será usado para empresas e autonomos, pois assim fica tudo em uma tabela só
 * Podendo ocorrer alterações!!!!
 */
export class Profile {
    uid: string = ""; // Salva da conta de autenticação
    nome: string = ""; // Salva ao criar a conta
    email: string = ""; // salva ao criar a conta
    isCompany: boolean = false; // Salva ao criar conta
    razaoSocial: string = "";
    cnpjCpf: string = "";
    telefone: string = "";
    rua: string = "";
    bairro: string = "";
    cidade: string = "";
    estado: string = "";
    // geoLocation: GeoLocation???    
    inscEstadual: string = "";
    inscMunicipal: string = "";
    areaAtuacao: string = "";
    setor: string = "";
    aboutMe: string = "";
    // avaliations: Avaliations
    // reviewsCount: number
    // contracts: Contract
    // contractCount: number
}