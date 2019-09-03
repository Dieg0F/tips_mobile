import { Constants } from "../../util/constants/constants";
import { StorageProvider } from "../storage/storage";
import { AngularFirestore } from "@angular/fire/firestore";

export class SectorsProvider {

    constructor(
        private db: AngularFirestore,
        private storage: StorageProvider) { }

    async saveSectorsOnStorage(sectors: any): Promise<void> {
        return this.storage.setItem(Constants.SECTORS_LOCAL_DB, sectors);
    }

    async getSectorsOnStorage(): Promise<void> {
        return this.storage.getItem(Constants.SECTORS_LOCAL_DB);
    }

    async getSectors(): Promise<any> {
        console.log('getSectors >> Get All Sectors')
        return this.db.collection(Constants.PROFILES_COLLECTION)
            .get()
            .toPromise()
    }

    async insertSector(sector: any): Promise<void> {
        console.log('saveProfile >> Saving Profile')
        this.db.collection(Constants.PROFILES_COLLECTION).doc(sector.uid).set(sector)
    }

    insertAll() {
        this.saveSectorsOnStorage(sectors)
    }
}

var sectors = [{
    "sectorName": "Pedreiro",
    "area": "Construção Civil"
},
{
    "sectorName": "Servente",
    "area": "Construção Civil"
},
{
    "sectorName": "Eletricista",
    "area": "Construção Civil"
},
{
    "sectorName": "Pintor",
    "area": "Construção Civil"
},
{
    "sectorName": "Encanador",
    "area": "Construção Civil"
},
{
    "sectorName": "Médico",
    "area": "Saúde"
},
{
    "sectorName": "Dentista",
    "area": "Saúde"
},
{
    "sectorName": "Enfermeira",
    "area": "Saúde"
},
{
    "sectorName": "Nutricionista",
    "area": "Saúde"
},
{
    "sectorName": "Psicólogo",
    "area": "Saúde"
},
{
    "sectorName": "Personal Trainer",
    "area": "Saúde"
},
{
    "sectorName": "Fisioterapeuta",
    "area": "Saúde"
},
{
    "sectorName": "Advogado Criminal",
    "area": "Advocacia"
},
{
    "sectorName": "Advogado Trabalhista",
    "area": "Advocacia"
},
{
    "sectorName": "Advogado Penal",
    "area": "Advocacia"
},
{
    "sectorName": "Advogado Ambiental",
    "area": "Advocacia"
},
{
    "sectorName": "Advogado Tributário",
    "area": "Advocacia"
},
{
    "sectorName": "Advogado Empresarial",
    "area": "Advocacia"
},
{
    "sectorName": "Técnico em Manutenção de Computadores",
    "area": "Computação"
},
{
    "sectorName": "Desenvolvedor Web",
    "area": "Computação"
},
{
    "sectorName": "Desenvolvedor Mobile",
    "area": "Computação"
},
{
    "sectorName": "Desenvolvedor FullStack",
    "area": "Computação"
},
{
    "sectorName": "Taxista",
    "area": "Transporte"
},
{
    "sectorName": "Motoboy",
    "area": "Transporte"
},
{
    "sectorName": "Motorista de Aplicativo",
    "area": "Transporte"
},
{
    "sectorName": "Motorista de Van",
    "area": "Transporte"
},
{
    "sectorName": "Carreto – Frete",
    "area": "Transporte"
},
{
    "sectorName": "Confeiteira",
    "area": "Culinária"
},
{
    "sectorName": "Cozinheiro",
    "area": "Culinária"
},
{
    "sectorName": "Churrasqueiro",
    "area": "Culinária"
},
{
    "sectorName": "Musico",
    "area": "Artes"
},
{
    "sectorName": "Banda",
    "area": "Artes"
},
{
    "sectorName": "Cantor",
    "area": "Artes"
},
{
    "sectorName": "Pintura",
    "area": "Artes"
},
{
    "sectorName": "Fotografo",
    "area": "Artes"
},
{
    "sectorName": "Engenheiro Civil",
    "area": "Engenharia"
},
{
    "sectorName": "Engenheiro Mecânico",
    "area": "Engenharia"
},
{
    "sectorName": "Engenheiro de Telecomunicações",
    "area": "Engenharia"
},
{
    "sectorName": "Engenheiro Biomédico",
    "area": "Engenharia"
},
{
    "sectorName": "Arquiteto",
    "area": "Arquitetura"
},
{
    "sectorName": "Paisagista",
    "area": "Arquitetura"
},
{
    "sectorName": "Cabelereiro",
    "area": "Beleza"
},
{
    "sectorName": "Maquiador",
    "area": "Beleza"
},
{
    "sectorName": "Manicure e Pedicure",
    "area": "Beleza"
},
{
    "sectorName": "Esteticista",
    "area": "Beleza"
},
{
    "sectorName": "Montador de Moveis",
    "area": "Movelaria"
},
{
    "sectorName": "Marceneiro",
    "area": "Movelaria"
},
{
    "sectorName": "Design de Interiores",
    "area": "Decoração e Design de Ambientes"
},
{
    "sectorName": "Decoração de Festas",
    "area": "Decoração e Design de Ambientes"
},
{
    "sectorName": "Jardinagem",
    "area": "Decoração e Design de Ambientes"
},
{
    "sectorName": "Paisagista",
    "area": "Decoração e Design de Ambientes"
},
{
    "sectorName": "Mecânico",
    "area": "Mecânica"
}
];