import { AfterViewInit, Component } from '@angular/core'
import * as d3 from 'd3'

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
  ngAfterViewInit() {
    const data: ChartData[] = [
      { date: new Date('2020-01-01'), value: 30 },
      { date: new Date('2020-02-01'), value: 60 },
      { date: new Date('2020-03-01'), value: 40 },
      { date: new Date('2020-04-01'), value: 80 },
      { date: new Date('2020-05-01'), value: 50 },
      { date: new Date('2020-06-01'), value: 70 }
    ];

    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, (d: ChartData): Date => d.date) as [Date, Date])
      .range([0, 500]);
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([300, 0]);
    const line = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
    svg.append('g')
      .attr('transform', `translate(0, ${300})`)
      .call(d3.axisBottom(xScale));
    svg.append('g')
      .call(d3.axisLeft(yScale));
  }
}