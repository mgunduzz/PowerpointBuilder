import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { PptElementModel, PPtFormatInputsEnum, FormatCheckboxInputModel } from '@app/ppt-builder/model';

@Component({
  selector: 'ppt-chart-element',
  templateUrl: './chart-element.component.html',
  styleUrls: ['./chart-element.component.scss']
})
export class ChartElement implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  @ViewChild('myChart') myChartElRef: ElementRef;
  myChart: Chart = undefined;

  constructor() {}

  ngOnInit() {
    this.element.onFormatChange.subscribe(res => {
      var formatInput = res as FormatCheckboxInputModel;
      if (formatInput.inputId == PPtFormatInputsEnum.legend) {
        (this.myChart as any).options.legend.display = formatInput.value;
      } else if (formatInput.inputId == PPtFormatInputsEnum.title) {
        (this.myChart as any).options.title.display = formatInput.value;
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
        legend: {
          display: false,
          position: 'right',
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
