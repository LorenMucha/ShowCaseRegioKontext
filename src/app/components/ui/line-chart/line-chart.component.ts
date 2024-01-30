import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core'
import * as d3 from 'd3'
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { BehaviorSubject, filter, map, mergeAll, takeUntil, tap, toArray } from 'rxjs';
import { Indicator } from 'src/app/model/indicators/indicator.data';
import { DataService } from 'src/app/services/data.service';

interface ChartData {
  date: Date,
  value: number
}

@Component({
  standalone: true,
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit {

  @Input() indicator!: Indicator
  @Input() feature!: Feature<Geometry>

  constructor(private httpClient: HttpClient) { }


  ngAfterViewInit() {

    this.httpClient.get<any[]>(`assets/data/${this.indicator.url}`)
      .pipe(
        mergeAll(),
        filter((x) => x.Name == this.feature.get("name")),
        map((x) => {
          return { date: new Date(`${x.Jahr}-01-01`), value: x[this.indicator.title] }
        }),
        toArray()
      ).subscribe((chartData) => {

        const svg = d3.select('#line-chart')
          .append('svg')
          .attr('width', 400)
          .attr('height', 500);
        const xScale = d3.scaleTime()
          .domain(d3.extent(chartData, (d: ChartData): Date => d.date) as [Date, Date])
          .range([0, 400]);

        const yScale = d3.scaleLinear()
          .domain([0, 100])
          .range([300, 0]);

        const line = d3.line<any>()
          .x(d => xScale(d.date))
          .y(d => yScale(d.value))

        svg.append('path')
          .datum(chartData)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2)
          .attr('d', line);
        svg.append('g')
          .attr('transform', `translate(0, ${300})`)
          .call(d3.axisBottom(xScale));
        svg.append('g')
          .call(d3.axisLeft(yScale));
      });
  }
}