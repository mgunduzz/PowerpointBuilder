import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { PptElementModel, PPtFormatInputsEnum, FormatCheckboxInputModel } from '@app/ppt-builder/model';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'ppt-chart-element',
  templateUrl: './chart-element.component.html',
  styleUrls: ['./chart-element.component.scss']
})
export class ChartElement implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
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

    var ctx = (this.myChartElRef.nativeElement as any).getContext('2d');

    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
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
      },
      options: {
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
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  ngOnDestroy() {}
}
