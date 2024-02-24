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

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
          width = 850 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

        const svg = d3.select('#line-chart')
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

        const xScale = d3.scaleTime()
          .domain(d3.extent(chartData, (d: ChartData): Date => d.date) as [Date, Date])
          .range([0, width])


        const yScale = d3.scaleLinear()
          .domain([0, d3.max(chartData, (d: ChartData): number => +d.value) as number])
          .range([height, 0]);

        const line = d3.line<any>()
          .x(d => xScale(d.date))
          .y(d => yScale(d.value))

        //area
        const area = d3.area<any>()
          .x(d => xScale(d.date))
          .y0(height)
          .y1(d => yScale(d.value))

        svg.append("path")
          .datum(chartData)
          .attr("fill", "#69b3a2")
          .attr("fill-opacity", .3)
          .attr("stroke", "none")
          .attr("d", area)

        svg.append('path')
          .datum(chartData)
          .attr('fill', 'none')
          .attr('stroke', '#22543d')
          .attr('stroke-width', 2)
          .attr('d', line)

        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale))

        svg.append('g')
          .call(d3.axisLeft(yScale).tickSizeOuter(0))

        // Add the line
        svg.selectAll("myCircles")
          .data(chartData)
          .enter()
          .append("circle")
          .attr("fill", "red")
          .attr("stroke", "none")
          .attr("cx", d => xScale(d.date))
          .attr("cy", d => yScale(d.value))
          .attr("r", 3)
      });
  }
}