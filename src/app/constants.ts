import { IndicatorImpl } from "./model/indicators/indicator.data";
import { TabElem } from "./model/tabs-elem";

export const MENU: Map<TabElem, Array<IndicatorImpl>> = new Map<TabElem, Array<IndicatorImpl>>([
    [{ title: "Marktdaten", active: true },
    [new IndicatorImpl('kjhdkJAHKHKJASFAKhdJKDKJSHDKAHJKAHDHASKJ', 'zu_fortzuege.json', 'Zu und Fortzüge'), new IndicatorImpl('', '', 'Auspendler'), new IndicatorImpl('', '', 'Einpendler')]],
    [{ title: "Mieten", active: false },
    [new IndicatorImpl('', '', 'Anzahl Angebote'), new IndicatorImpl('', '', 'arith. Mittel €/m²')]]
]);
