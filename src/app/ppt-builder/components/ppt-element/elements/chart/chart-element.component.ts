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
import 'chartjs-plugin-stacked100';

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
      labels: ['Renault', 'Toyota', 'Mercedes', 'Volkswagen', 'Fiat'],
      datasets: [
        {
          label: 'Olumlu',
          backgroundColor: '#000080',
          data: [80, 50, 23, 56, 43],
          fill: false
        },
        {
          label: 'Olumsuz',
          backgroundColor: '#d3d3d3',
          data: [90, 45, 26, 64, 37],
          fill: false
        }
      ]
    };

    chartOptions.options = {
      elements: {
        point: {
          radius: 0
        },
        line: {
          tension: 0.4
        },
        arc: {
          borderWidth: 1
        }
      },
      plugins: {
        stacked100: { enable: false },
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

    let scatterData = [
      {
        x: 10,
        y: 20
      },
      {
        x: 50,
        y: 40
      },
      {
        x: 150,
        y: 200
      }
    ];

    let pieData = {
      labels: ['Africa', 'Asia', 'Europe', 'Latin America'],
      datasets: [
        {
          label: 'Population (millions)',
          backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9'],
          data: [478, 267, 734, 784]
        }
      ]
    };

    if (chartType == ChartTypeEnum.ClusteredColumn) {
      chartOptions.type = 'bar';
    } else if (chartType == ChartTypeEnum.StackedColumn) {
      chartOptions.type = 'bar';
      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
    } else if (chartType == ChartTypeEnum.StackedColumn100) {
      chartOptions.type = 'bar';
      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false };
    } else if (chartType == ChartTypeEnum.ClusteredBar) {
      chartOptions.type = 'horizontalBar';
    } else if (chartType == ChartTypeEnum.StackedBar) {
      chartOptions.type = 'horizontalBar';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
    } else if (chartType == ChartTypeEnum.StackedBar100) {
      chartOptions.type = 'horizontalBar';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false };
    } else if (chartType == ChartTypeEnum.Line) {
      chartOptions.type = 'line';
    } else if (chartType == ChartTypeEnum.StackedLine) {
      chartOptions.type = 'line';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
    } else if (chartType == ChartTypeEnum.StackedLine100) {
      chartOptions.type = 'line';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false };
    } else if (chartType == ChartTypeEnum.MarkedLine) {
      chartOptions.type = 'line';
      chartOptions.options.elements.point.radius = 3;
    } else if (chartType == ChartTypeEnum.StackedMarkedLine) {
      chartOptions.type = 'line';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.elements.point.radius = 3;
    } else if (chartType == ChartTypeEnum.StackedMarkedLine100) {
      chartOptions.type = 'line';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.elements.point.radius = 3;
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false };
    } else if (chartType == ChartTypeEnum.MarkedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 7;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.showLines = false;
      chartOptions.data.datasets[0].label = 'Scatter Dataset';
      chartOptions.data.datasets[0].data = scatterData;
    } else if (chartType == ChartTypeEnum.SmoothMarkedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 7;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.showLines = true;
      chartOptions.data.datasets[0].label = 'Scatter Dataset';
      chartOptions.data.datasets[0].data = scatterData;
    } else if (chartType == ChartTypeEnum.SmoothLinedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 0;
      chartOptions.options.showLines = true;
      chartOptions.data.datasets[0].label = 'Scatter Dataset';
      chartOptions.data.datasets[0].data = scatterData;
    } else if (chartType == ChartTypeEnum.StraightMarkedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 7;
      chartOptions.options.showLines = true;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.elements.line.tension = 0;
      chartOptions.data.datasets[0].label = 'Scatter Dataset';
      chartOptions.data.datasets[0].data = scatterData;
    } else if (chartType == ChartTypeEnum.StraightLinedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 0;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.elements.line.tension = 0;
      chartOptions.options.showLines = true;
      chartOptions.data.datasets[0].label = 'Scatter Dataset';
      chartOptions.data.datasets[0].data = scatterData;
    } else if (chartType == ChartTypeEnum.Pie) {
      chartOptions.type = 'pie';
      chartOptions.options.elements.arc.borderWidth = -1;
      chartOptions.data = pieData;
    } else if (chartType == ChartTypeEnum.ExplodedPie) {
      chartOptions.type = 'pie';
      chartOptions.options.elements.arc.borderWidth = 15;
      chartOptions.data = pieData;
    }

    this.myChart = new Chart(ctx, chartOptions);
  }

  ngOnDestroy() {}
}
