import { UUID } from 'angular2-uuid';
import { Constants } from "../../util/constants/constants";
import { StorageProvider } from "../storage/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class SectorsProvider {

    public count = 0;

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
        return this.db.collection(Constants.SECTORS_COLLECTION)
            .valueChanges();
    }

    async insertSector(sector: any): Promise<void> {
        console.log('insertSector >> sector', sector)
        sector.uid = UUID.UUID();
        this.db.collection(Constants.SECTORS_COLLECTION)
            .doc(sector.uid).set(sector)
    }

    insertAll() {
        if (this.count == sectors.length)
            this.insertSector(sectors[this.count])
                .then(() => {
                    this.count++
                    this.insertAll();
                })
    }
}

var sectors =
    [{
        "uid": "",
        "sectorName": "Pedreiro",
        "area": "Construção Civil"
    },
    {
        "uid": "",
        "sectorName": "Servente",
        "area": "Construção Civil"
    },
    {
        "uid": "",
        "sectorName": "Eletricista",
        "area": "Construção Civil"
    },
    {
        "uid": "",
        "sectorName": "Pintor",
        "area": "Construção Civil"
    },
    {
        "uid": "",
        "sectorName": "Encanador",
        "area": "Construção Civil"
    },
    {
        "uid": "",
        "sectorName": "Médico",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Dentista",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Enfermeira",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Nutricionista",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Psicólogo",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Personal Trainer",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Fisioterapeuta",
        "area": "Saúde"
    },
    {
        "uid": "",
        "sectorName": "Advogado Criminal",
        "area": "Advocacia"
    },
    {
        "uid": "",
        "sectorName": "Advogado Trabalhista",
        "area": "Advocacia"
    },
    {
        "uid": "",
        "sectorName": "Advogado Penal",
        "area": "Advocacia"
    },
    {
        "uid": "",
        "sectorName": "Advogado Ambiental",
        "area": "Advocacia"
    },
    {
        "uid": "",
        "sectorName": "Advogado Tributário",
        "area": "Advocacia"
    },
    {
        "uid": "",
        "sectorName": "Advogado Empresarial",
        "area": "Advocacia"
    },
    {
        "uid": "",
        "sectorName": "Técnico em Manutenção de Computadores",
        "area": "Computação"
    },
    {
        "uid": "",
        "sectorName": "Desenvolvedor Web",
        "area": "Computação"
    },
    {
        "uid": "",
        "sectorName": "Desenvolvedor Mobile",
        "area": "Computação"
    },
    {
        "uid": "",
        "sectorName": "Desenvolvedor FullStack",
        "area": "Computação"
    },
    {
        "uid": "",
        "sectorName": "Taxista",
        "area": "Transporte"
    },
    {
        "uid": "",
        "sectorName": "Motoboy",
        "area": "Transporte"
    },
    {
        "uid": "",
        "sectorName": "Motorista de Aplicativo",
        "area": "Transporte"
    },
    {
        "uid": "",
        "sectorName": "Motorista de Van",
        "area": "Transporte"
    },
    {
        "uid": "",
        "sectorName": "Carreto – Frete",
        "area": "Transporte"
    },
    {
        "uid": "",
        "sectorName": "Confeiteira",
        "area": "Culinária"
    },
    {
        "uid": "",
        "sectorName": "Cozinheiro",
        "area": "Culinária"
    },
    {
        "uid": "",
        "sectorName": "Churrasqueiro",
        "area": "Culinária"
    },
    {
        "uid": "",
        "sectorName": "Musico",
        "area": "Artes"
    },
    {
        "uid": "",
        "sectorName": "Banda",
        "area": "Artes"
    },
    {
        "uid": "",
        "sectorName": "Cantor",
        "area": "Artes"
    },
    {
        "uid": "",
        "sectorName": "Pintura",
        "area": "Artes"
    },
    {
        "uid": "",
        "sectorName": "Fotografo",
        "area": "Artes"
    },
    {
        "uid": "",
        "sectorName": "Engenheiro Civil",
        "area": "Engenharia"
    },
    {
        "uid": "",
        "sectorName": "Engenheiro Mecânico",
        "area": "Engenharia"
    },
    {
        "uid": "",
        "sectorName": "Engenheiro de Telecomunicações",
        "area": "Engenharia"
    },
    {
        "uid": "",
        "sectorName": "Engenheiro Biomédico",
        "area": "Engenharia"
    },
    {
        "uid": "",
        "sectorName": "Arquiteto",
        "area": "Arquitetura"
    },
    {
        "uid": "",
        "sectorName": "Paisagista",
        "area": "Arquitetura"
    },
    {
        "uid": "",
        "sectorName": "Cabelereiro",
        "area": "Beleza"
    },
    {
        "uid": "",
        "sectorName": "Maquiador",
        "area": "Beleza"
    },
    {
        "uid": "",
        "sectorName": "Manicure e Pedicure",
        "area": "Beleza"
    },
    {
        "uid": "",
        "sectorName": "Esteticista",
        "area": "Beleza"
    },
    {
        "uid": "",
        "sectorName": "Montador de Moveis",
        "area": "Movelaria"
    },
    {
        "uid": "",
        "sectorName": "Marceneiro",
        "area": "Movelaria"
    },
    {
        "uid": "",
        "sectorName": "Design de Interiores",
        "area": "Decoração e Design de Ambientes"
    },
    {
        "uid": "",
        "sectorName": "Decoração de Festas",
        "area": "Decoração e Design de Ambientes"
    },
    {
        "uid": "",
        "sectorName": "Jardinagem",
        "area": "Decoração e Design de Ambientes"
    },
    {
        "uid": "",
        "sectorName": "Paisagista",
        "area": "Decoração e Design de Ambientes"
    },
    {
        "uid": "",
        "sectorName": "Mecânico",
        "area": "Mecânica"
    }
    ];