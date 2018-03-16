import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

import { DataService } from './../../services';
import { Chart } from './../../services';

import 'd3-transition';
import * as moment from 'moment';

interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}

@Component({
  selector: 'app-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit {
  @ViewChild('chart')
  public chart: ElementRef;
  
  @ViewChild('fileInput')
  public fileInput: any;
  
  public lineColor: string = '06f';
  public chartData: any;
  public formattedChartData: any;
  public imgWidth: number;
  public imgHeight: number;
  public sliderValue: number = 50;
  
  private lineChart: any;
  private width: number = 900;
  private height: number = 550;
  private imgLeft: number = 0;
  private imgTop: number;
  private margin: any = {
    left: 50,
    right: 10,
    top: 10,
    bottom: 50
  };
  
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getChartData()
      .subscribe((chartData: any) => {
        this.chartData = this.parseData(chartData, 'MM-DD-YY');
        this.lineChart = new Chart(
          this.chart, this.chartData, this.margin, this.width, this.height
        );
        this.drawChart();
        this.formattedChartData = JSON.stringify(this.chartData);
      });
  }
  
  public changeChartData(): void {
    const chartData: any = JSON.parse(this.formattedChartData);
  
    this.chartData = this.parseData(chartData);
    this.lineChart.updateChartData(this.chartData);
  }
  
  public changeColor(): void {
    this.lineChart.updateLineColor(this.lineColor);
  }
  
  public upload(): void {
    const fileBrowser = this.fileInput.nativeElement;
    const file = fileBrowser.files && fileBrowser.files[0];
    const reader = new FileReader();
    const img = new Image();
    
    if (file) {
      img.src = window.URL.createObjectURL(file);
  
      img.onload = () => {
        this.imgWidth = img.naturalWidth;
        this.imgHeight = img.naturalHeight;
        this.imgTop = this.height - this.imgHeight;
      };
      
      reader.onload = ((ev: FileReaderEvent) => {
        this.lineChart.upload(ev.target.result, this.imgLeft, this.imgTop, this.imgWidth, this.imgHeight);
      });

      reader.readAsDataURL(fileBrowser.files[0]);
    }
  }
  
  public slide(): void {
    const scaleHeight = this.sliderValue * 2 * this.imgHeight / 100;
    const scaleWidth = this.sliderValue * 2 * this.imgWidth / 100;

    this.imgTop = this.height - scaleHeight;
    this.lineChart.setAttr('image', 'height', scaleHeight);
    this.lineChart.setAttr('image', 'width', scaleWidth);
    this.lineChart.setAttr('image', 'y', this.imgTop);
  }
  
  private parseData(data: any, timeFormat: string = ''): any {
    return data
      .sort((a, b) => {
        if (a.date < b.date) { return -1; }
        if (a.date > b.date) { return 1; }
        return 0;
      }).map((item: any) => {
        item.date = moment.utc(item.date, timeFormat).toDate();
      
        return item;
      });
  }
  
  private drawChart(): void {
    this.lineChart.addClipPath();
    this.lineChart.drawLine(this.lineColor);
  }
}
