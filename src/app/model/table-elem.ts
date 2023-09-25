export interface TableElem {
    ags: number
    name: string
    value: number
}

export class TableElem implements TableElem {
    constructor(ags: number, name: string, value: number) {
        this.ags = ags
        this.name = name
        this.value = value
    }
}