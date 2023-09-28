export interface TableElem {
    id: number
    name: string
    value: number
}

export class TableElem implements TableElem {
    constructor(id: number, name: string, value: number) {
        this.id = id
        this.name = name
        this.value = value
    }
}