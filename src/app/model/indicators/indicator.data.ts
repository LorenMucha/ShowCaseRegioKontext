export interface Indicator {
    description: string
    url: string
    title: string;
}

export class IndicatorImpl implements Indicator {
    description: string
    url: string
    title: string
    constructor(description: string, url: string, title: string) {
        this.description = description
        this.url = url
        this.title = title
    }
}