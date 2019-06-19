import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptChartElementModel,
  ChartTypeEnum
} from '@app/ppt-builder/model';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'ppt-chart-element',
  templateUrl: './chart-element.component.html',
  styleUrls: ['./chart-element.component.scss']
})
export class ChartElement implements OnInit, OnDestroy {
  @Input('element') element: PptChartElementModel;
  @ViewChild('myChart') myChartElRef: ElementRef;
  myChart: Chart = undefined;
  isChartActive?: boolean = false;

  constructor() {}

  ngOnInit() {
    this.element.onFormatChange.subscribe(res => {
      var formatInput = res as FormatCheckboxInputModel;
      let chartRef = this.myChart as any;

      if (formatInput.inputId == PPtFormatInputsEnum.legend) {
        chartRef.options.legend.display = formatInput.value;
      } else if (formatInput.inputId == PPtFormatInputsEnum.title) {
        chartRef.options.title.display = formatInput.value;
      } else if (formatInput.inputId == PPtFormatInputsEnum.value) {
        chartRef.options.plugins.datalabels.display = formatInput.value;
      }

      this.myChart.update();
    });

    let chartType = this.element.chartType;
    let ctx = (this.myChartElRef.nativeElement as any).getContext('2d');
    let chartOptions: Chart.ChartConfiguration = {};

    chartOptions.data = {
      labels: ['Votes'],
      datasets: [
        {
          label: '# of Votes',
          backgroundColor: '#000080',
          data: [80]
        },
        {
          label: '# of Votes2',
          backgroundColor: '#d3d3d3',
          data: [90]
        },
        {
          label: '# of Votes3',
          backgroundColor: '#add8e6',
          data: [45]
        }
      ]
    };

    chartOptions.options = {
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            weight: 'bold'
          },
          formatter: Math.round,
          display: false
        }
      },
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          fontColor: '#000080'
        }
      },
      title: {
        display: false,
        text: 'example title'
      },
      scales: {
        xAxes: [
          {
            stacked: false
          }
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };

    if (chartType == ChartTypeEnum.ClusteredColumn) {
      chartOptions.type = 'bar';
    } else if (chartType == ChartTypeEnum.StackedColumn) {
      chartOptions.type = 'bar';
      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
    }

    this.myChart = new Chart(ctx, chartOptions);
  }

  ngOnDestroy() {}
}
