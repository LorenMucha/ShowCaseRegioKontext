import { Fortzuege } from "./model/indicators/fortzuege";
import { IndicatorImpl } from "./model/indicators/indicator.data";
import { ZuZuege } from "./model/indicators/zuzuege";
import { TabElem } from "./model/tabs-elem";

export const MENU: Map<TabElem, Array<IndicatorImpl>> = new Map<TabElem, Array<IndicatorImpl>>([
    [{ title: "Nachfrage", active: true },
    [new ZuZuege(),
    new Fortzuege()]],
    [{ title: "Marktdaten", active: false },
    [new IndicatorImpl('', '', 'Anzahl Angebote'), new IndicatorImpl('', '', 'arith. Mittel €/m²')]]
]);

export const RANGES = 5;