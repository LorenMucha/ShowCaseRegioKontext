export interface Indicator {
    description: string
    url: string
    title: string
    geosonUrl: string
}

export class IndicatorImpl implements Indicator {
    description: string
    url: string
    title: string
    geosonUrl: string
    constructor(description: string, url: string, title: string, geosonUrl: string) {
        this.description = description
        this.url = url
        this.title = title
        this.geosonUrl = geosonUrl
    }
}