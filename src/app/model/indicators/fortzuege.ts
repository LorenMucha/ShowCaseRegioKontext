import { IndicatorImpl } from "./indicator.data"

//generated
export interface FortzuegeData {
    "Jahr": number,
    "Kennziffer": number,
    "Name": string,
    "Fortzüge insgesamt": number,
    "12051000 Brandenburg an der Havel Zuz": number,
    "12053000 Frankfurt (Oder)  Zuz": number,
    "12060052 Eberswalde  Zuz": number,
    "12061316 Lübben (Spreewald) Zuz": number,
    "12063208 Nauen Zuz": number,
    "12063252 Rathenow Zuz": number,
    "12065100 Gransee Zuz": number,
    "12066196 Lübbenau/Spreewald  Zuz": number,
    "12067144 Fürstenwalde/Spree  Zuz": number,
    "12069017 Beelitz Zuz": number,
    "12069020 Bad Belzig Zuz": number,
    "12072169 Jüterbog Zuz": number,
    "12072232 Luckenwalde Zuz": number,
    "12072477 Zossen Zuz": number,
    "12073008 Angermünde Zuz": number,
}

export class Fortzuege implements IndicatorImpl {
    url: string = 'zu_fortzuege.json'
    description: string = 'Der Indikator beschreibt die Fortzüge aus Berlin. Dieser Indikator ist wichtig, um die Muster der Bevölkerungsbewegungen zwischen Berlin und den umliegenden Brandenburger Gemeinden zu verstehen. Darüber hinaus bietet er Einblicke in die Attraktivität der Hauptstadtregion, wirtschaftliche Verflechtungen und demografische Trends.'
    title: string = 'Fortzüge insgesamt'
}