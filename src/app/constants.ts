import { IndicatorImpl } from "./model/indicators/indicator.data";
import { ArithmetischesMittel } from "./model/indicators/mieten";
import { ZuUndFortzuege } from "./model/indicators/zu.fortzuege";
import { TabElem } from "./model/tabs-elem";

export const MENU: Map<TabElem, Array<IndicatorImpl>> = new Map<TabElem, Array<IndicatorImpl>>([
    [{ title: "Nachfrage", active: true },
    [new ZuUndFortzuege(),
    new IndicatorImpl('', '', 'Auspendler', ''),
    new IndicatorImpl('', '', 'Einpendler', '')]],
    [{ title: "Marktdaten", active: false },
    [new IndicatorImpl('', '', 'Anzahl Angebote', ''), new ArithmetischesMittel()]]
]);

export const RANGES = 5;
