import {ElementRef} from "@angular/core";

import { Axis, axisBottom, axisLeft } from 'd3-axis';
import { ScaleLinear, ScaleTime, scaleLinear, scaleTime } from 'd3-scale';
import { BaseType, Selection, select } from 'd3-selection';
import { Line, curveLinear, line } from 'd3-shape';
import 'd3-transition';
import * as moment from 'moment';

export class Chart {
  public svg: Selection<BaseType, {}, null, undefined>;
  
  private xScale: ScaleTime<any, any>;
  private yScale: ScaleLinear<any, any>;
  private xAxis: Axis<number | Date | { valueOf(): number; }>;
  private yAxis: Axis<number | Date | { valueOf(): number; }>;
  private line: Line<any>;
  private domXAxis: any;
  private domYAxis: any;
  
  constructor(
    public el: ElementRef,
    public data: any,
    public margin: any,
    public width: number,
    public height: number
  ) {
    const { min, max } = { min: 0, max: 520 };
    
    this.svg = select(this.el.nativeElement)
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    this.xScale = scaleTime()
      .domain([moment(data[0].date, 'MM-DD-YY').toDate(), moment(data.slice(-1)[0].date, 'MM-DD-YY').toDate()])
      .range([0, this.width]);
    
    this.yScale = scaleLinear()
      .domain([min, max])
      .range([this.height, 0]);
  
    this.xAxis = axisBottom(this.xScale)
      .tickSizeInner(-this.height)
      .tickSizeOuter(1)
      .tickPadding(10)
      .ticks(4);
  
    this.yAxis = axisLeft(this.yScale)
      .tickSizeInner(-this.width)
      .tickSizeOuter(1)
      .tickPadding(10)
      .ticks(5);
  
    this.domXAxis = this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis);
  
    this.domYAxis = this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);
  
    this.line = line<any>()
      .curve(curveLinear)
      .x((d: any): number => this.xScale(d.date))
      .y((d: any): number => this.yScale(d.count));
  }
  
  public addClipPath(): void {
    this.svg.append('defs')
      .append('clipPath')
      .attr('id', 'lines-clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);
  }
  
  public drawLine(lineColor: string): void {
    this.svg.selectAll(`.line`)
      .data([this.data])
      .enter()
      .append('path')
      .attr('class', `line`)
      .attr('clip-path', 'url(#lines-clip)')
      .attr('stroke', `#${lineColor}`)
      .attr('d', this.line)
      .exit()
      .remove();
  }
  
  public upload(file: any, left: number, top: number, imgWidth: number, imgHeight: number): void {
    const imgs = this.svg.selectAll('image')
      .data([0]);
    
    imgs.enter()
      .insert('svg:image', '.axis--x')
      .attr('xlink:href', file)
      .attr('x', left)
      .attr('y', top)
      .attr('width', imgWidth)
      .attr('height', imgHeight);
  }
  
  public updateChartData(data: any): void {
    this.svg.select('.line')
      .datum(data)
      .transition()
      .duration(750)
      .attr('d', this.line);
  }
  
  public updateLineColor(color: string): void {
    this.svg.select('.line')
      .attr('stroke', `#${color}`);
  }
  
  public setAttr(selector: string, attr: string, val: any): void {
    this.svg.select(selector)
      .attr(attr, val);
  }
}
