import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptBaseChartElementModel,
  ChartTypeEnum,
  FormatNumberInputModel,
  ColumnChartFormatModel,
  BarChartFormatModel,
  PieChartFormatModel,
  DoughnutChartFormatModel,
  AppComponentBase,
  PptDefaultChartElementModel,
  PptDefaultChartDataModel,
  PptAreaChartElementModel,
  FormatDropdownInputModel,
  FormatColorPickerInputModel,
  LineChartFormatModel,
  PptPieChartElementModel,
  PptPieChartDataModel,
  FormatTextInputModel
} from '@app/ppt-builder/model';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-stacked100';
import { $ } from 'protractor';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-chart-element',
  templateUrl: './chart-element.component.html',
  styleUrls: ['./chart-element.component.scss']
})
export class ChartElement implements OnInit, OnDestroy, OnChanges {
  @Input('element') element: PptBaseChartElementModel;
  @ViewChild('myChart') myChartElRef: ElementRef;
  myChart: Chart = undefined;

  constructor(pPtBuilderService: PPtBuilderService) {}

  onFormatChangeSub: Subscription;
  onDataChangeSub: Subscription;

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {}

  applyData(): ChartData {
    let chartRef = this.myChart as any;

    let chartData: ChartData = {};

    if (this.element instanceof PptDefaultChartElementModel) {
      if (this.element.format instanceof LineChartFormatModel) {
        this.element.dataModal.dataSets.forEach(item => {
          (item as any).borderColor = item.backgroundColor;
        });
      }

      chartData = {};
      chartData.labels = (this.element as PptDefaultChartElementModel).dataModal.labels;
      chartData.datasets = (this.element as PptDefaultChartElementModel).dataModal.dataSets;
    } else if (this.element instanceof PptPieChartElementModel) {
      chartData = {};
      chartData.labels = (this.element as PptPieChartElementModel).dataModal.labels;

      let pieItem = this.element.dataModal.dataSet;

      chartData.datasets = [
        { label: pieItem.label, backgroundColor: pieItem.backgroundColors.map(item => item.color), data: pieItem.data }
      ];
    }

    if (chartRef) {
      chartRef.data = chartData;
      this.myChart.update();
    }

    return chartData;
  }

  ngOnInit() {
    this.onDataChangeSub = this.element.onDataChange.subscribe(data => {
      if (data) {
        if (this.element instanceof PptDefaultChartElementModel) {
          let defData = data as PptDefaultChartDataModel;

          this.element.dataModal = new PptDefaultChartDataModel();
          this.element.dataModal.labels = defData.labels;
          this.element.dataModal.dataSets = defData.dataSets;
        } else if (this.element instanceof PptPieChartElementModel) {
          let defData = data as PptPieChartDataModel;

          this.element.dataModal = new PptPieChartDataModel();
          this.element.dataModal.labels = defData.labels;
          this.element.dataModal.dataSet = defData.dataSet;
        }
      }

      this.applyData();
    });

    this.onFormatChangeSub = this.element.onFormatChange.subscribe(changeResponse => {
      changeResponse.forEach(res => {
        var formatInput = res.formatInput as FormatCheckboxInputModel;
        var formatNumberInput = res.formatInput as FormatNumberInputModel;
        var formatDropDown = res.formatInput as FormatDropdownInputModel;
        var formatColorPicker = res.formatInput as FormatColorPickerInputModel;
        var formatText = res.formatInput as FormatTextInputModel;

        let chartRef = this.myChart as any;

        if (formatInput.inputId == PPtFormatInputsEnum.legend) {
          chartRef.options.legend.display = formatInput.value;
        } else if (formatInput.inputId == PPtFormatInputsEnum.title) {
          chartRef.options.title.display = formatInput.value;
        } else if (formatInput.inputId == PPtFormatInputsEnum.value) {
          chartRef.options.plugins.datalabels.display = formatInput.value;
        } else if (formatInput.inputId == PPtFormatInputsEnum.chartTitleText) {
          chartRef.options.title.text = formatText.value;
        }

        if (this.element.format instanceof ColumnChartFormatModel) {
          // scales: {
          //   xAxes: [
          //     {
          //       stacked: false,
          //       ticks : {
          //         fontSize: 10,
          //         fontFamily: "'Roboto', sans-serif", fontColor: '#000', fontStyle: '500'
          //       }
          //     }
          //   ],

          if (formatDropDown.inputId == PPtFormatInputsEnum.chartLabelsFont) {
            let fontFamily = this.element.format.formatInputs.chartLabelsFont.value.find(
              q => q.key == this.element.format.formatInputs.chartLabelsFont.selectedItemKey
            );
            if (fontFamily) {
              let currentFontSize = chartRef.options.scales.xAxes[0].ticks.fontSize;
              let currentFontColor = chartRef.options.scales.xAxes[0].ticks.fontColor;
              let currentFontStyle = chartRef.options.scales.xAxes[0].ticks.fontStyle;

              chartRef.options.scales.xAxes[0].ticks = {
                fontSize: currentFontSize,
                fontFamily: `'${fontFamily.value}', sans-serif`,
                fontColor: currentFontColor,
                fontStyle: currentFontStyle
              };
              chartRef.options.scales.yAxes[0].ticks = {
                fontSize: currentFontSize,
                fontFamily: `'${fontFamily.value}', sans-serif`,
                fontColor: currentFontColor,
                fontStyle: currentFontStyle
              };
            }
          } else if (formatNumberInput.inputId == PPtFormatInputsEnum.chartlabelsFontSize) {
            let fontSize = this.element.format.formatInputs.chartLabelsFontSize.value;

            if (fontSize) {
              let currentFontFamily = chartRef.options.scales.xAxes[0].ticks.fontFamily;
              let currentFontColor = chartRef.options.scales.xAxes[0].ticks.fontColor;
              let currentFontStyle = chartRef.options.scales.xAxes[0].ticks.fontStyle;

              chartRef.options.scales.xAxes[0].ticks = {
                fontSize: `${fontSize}`,
                fontFamily: currentFontFamily,
                fontColor: currentFontColor,
                fontStyle: currentFontStyle
              };
              chartRef.options.scales.yAxes[0].ticks = {
                fontSize: `${fontSize}`,
                fontFamily: currentFontFamily,
                fontColor: currentFontColor,
                fontStyle: currentFontStyle
              };
            } else if (formatInput.inputId == PPtFormatInputsEnum.chartSpaceBetweenCategory) {
              chartRef.options.scales.xAxes[0].categoryPercentage =
                (this.element.format as ColumnChartFormatModel).formatInputs.chartSpaceBetweenCategory.max +
                0.1 -
                formatNumberInput.value;
            } else if (formatInput.inputId == PPtFormatInputsEnum.chartSpaceBetweenBar) {
              chartRef.options.scales.xAxes[0].barPercentage =
                (this.element.format as ColumnChartFormatModel).formatInputs.chartSpaceBetweenBar.max +
                0.1 -
                formatNumberInput.value;
            }
          } else if (formatColorPicker.inputId == PPtFormatInputsEnum.chartLabelsFontColor) {
            let fontColor = this.element.format.formatInputs.chartLabelsFontColor.value;

            if (fontColor) {
              let currentFontFamily = chartRef.options.scales.xAxes[0].ticks.fontFamily;
              let currentFontStyle = chartRef.options.scales.xAxes[0].ticks.fontStyle;
              let currentFontSize = chartRef.options.scales.xAxes[0].ticks.fontSize;

              chartRef.options.scales.xAxes[0].ticks = {
                fontSize: currentFontSize,
                fontFamily: currentFontFamily,
                fontColor: `${fontColor}`,
                fontStyle: currentFontStyle
              };
              chartRef.options.scales.yAxes[0].ticks = {
                fontSize: currentFontSize,
                fontFamily: currentFontFamily,
                fontColor: `${fontColor}`,
                fontStyle: currentFontStyle
              };
            }
          } else if (formatInput.inputId == PPtFormatInputsEnum.chartSpaceBetweenCategory) {
            chartRef.options.scales.xAxes[0].categoryPercentage =
              (this.element.format as ColumnChartFormatModel).formatInputs.chartSpaceBetweenCategory.max +
              0.1 -
              formatNumberInput.value;
          } else if (formatInput.inputId == PPtFormatInputsEnum.chartSpaceBetweenBar) {
            chartRef.options.scales.xAxes[0].barPercentage =
              (this.element.format as ColumnChartFormatModel).formatInputs.chartSpaceBetweenBar.max +
              0.1 -
              formatNumberInput.value;
          }
        } else if (this.element.format instanceof BarChartFormatModel) {
          if (formatInput.inputId == PPtFormatInputsEnum.chartSpaceBetweenCategory) {
            chartRef.options.scales.yAxes[0].categoryPercentage =
              (this.element.format as ColumnChartFormatModel).formatInputs.chartSpaceBetweenCategory.max +
              0.1 -
              formatNumberInput.value;
          } else if (formatInput.inputId == PPtFormatInputsEnum.chartSpaceBetweenBar) {
            chartRef.options.scales.yAxes[0].barPercentage =
              (this.element.format as ColumnChartFormatModel).formatInputs.chartSpaceBetweenBar.max +
              0.1 -
              formatNumberInput.value;
          }
        } else if (this.element.format instanceof PieChartFormatModel) {
          if (formatInput.inputId == PPtFormatInputsEnum.pieRotation) {
            chartRef.options.rotation = formatNumberInput.value;
          }
        } else if (this.element.format instanceof DoughnutChartFormatModel) {
          if (formatInput.inputId == PPtFormatInputsEnum.pieRotation) {
            chartRef.options.rotation = formatNumberInput.value;
          } else if (formatInput.inputId == PPtFormatInputsEnum.pieCutoutPercentage) {
            chartRef.options.cutoutPercentage = formatNumberInput.value;
          }
        } else if (this.element.format instanceof LineChartFormatModel) {
          if (formatInput.inputId == PPtFormatInputsEnum.smoothLine) {
            chartRef.data.datasets.forEach((item: any) => (item.lineTension = formatInput.value ? 0.5 : 0));
          }
        }

        this.myChart.update();
      });
    });

    let chartType = this.element.chartType;
    let ctx = (this.myChartElRef.nativeElement as any).getContext('2d');
    let chartOptions: Chart.ChartConfiguration = {};

    chartOptions.data = this.applyData();

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
          color: 'black',
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
        text: this.element.format.formatInputs.chartTitleText.value
      },
      scales: {
        xAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 10,
              fontFamily: "'Roboto', sans-serif",
              fontColor: '#000',
              fontStyle: '500'
            }
          }
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              beginAtZero: true,
              fontFamily: "'Roboto', sans-serif",
              fontColor: '#000',
              fontStyle: '500'
            }
          }
        ]
      }
    };

    let scatterDataOlumlu = [
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

    let scatterDataOlumsuz = [
      {
        x: 30,
        y: 10
      },
      {
        x: 30,
        y: 50
      },
      {
        x: 50,
        y: 200
      }
    ];

    let scatterDataSet = [
      {
        label: 'Olumlu',
        data: scatterDataOlumlu
      },
      {
        label: 'Olumsuz',
        data: scatterDataOlumsuz
      }
    ];

    let pieData = chartOptions.data;

    if (this.element.format instanceof LineChartFormatModel)
      chartOptions.data.datasets.forEach(
        item => (item.lineTension = this.element.format.formatInputs.smoothLine.value ? 0.5 : 0)
      );

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
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: true };
    } else if (chartType == ChartTypeEnum.MarkedLine) {
      chartOptions.type = 'line';
      chartOptions.options.elements.point.radius = 6;
      chartOptions.options.elements.point.pointStyle = 'rect';
    } else if (chartType == ChartTypeEnum.StackedMarkedLine) {
      chartOptions.type = 'line';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.elements.point.radius = 6;
      chartOptions.options.elements.point.pointStyle = 'rect';
    } else if (chartType == ChartTypeEnum.StackedMarkedLine100) {
      chartOptions.type = 'line';

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.elements.point.radius = 6;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false };
    } else if (chartType == ChartTypeEnum.MarkedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 7;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.showLines = false;
      chartOptions.data.datasets = scatterDataSet;
    } else if (chartType == ChartTypeEnum.SmoothMarkedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 7;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.showLines = true;
      chartOptions.data.datasets = scatterDataSet;
    } else if (chartType == ChartTypeEnum.SmoothLinedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 0;
      chartOptions.options.showLines = true;
      chartOptions.data.datasets = scatterDataSet;
    } else if (chartType == ChartTypeEnum.StraightMarkedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 7;
      chartOptions.options.showLines = true;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.elements.line.tension = 0;
      chartOptions.data.datasets = scatterDataSet;
    } else if (chartType == ChartTypeEnum.StraightLinedScatter) {
      chartOptions.type = 'scatter';

      chartOptions.options.elements.point.radius = 0;
      chartOptions.options.elements.point.pointStyle = 'rect';
      chartOptions.options.elements.line.tension = 0;
      chartOptions.options.showLines = true;
      chartOptions.data.datasets = scatterDataSet;
    } else if (chartType == ChartTypeEnum.Pie) {
      chartOptions.type = 'pie';
      chartOptions.options.elements.arc.borderWidth = -1;
      chartOptions.data = pieData;
    } else if (chartType == ChartTypeEnum.ExplodedPie) {
      chartOptions.type = 'pie';
      chartOptions.options.elements.arc.borderWidth = 15;
      chartOptions.data = pieData;
    } else if (chartType == ChartTypeEnum.Area) {
      chartOptions.type = 'line';
      chartOptions.data.datasets.forEach(item => (item.fill = true));
      chartOptions.options.elements.line.tension = 0;
    } else if (chartType == ChartTypeEnum.StackedArea) {
      chartOptions.type = 'line';
      chartOptions.data.datasets.forEach(item => (item.fill = true));
      chartOptions.options.elements.line.tension = 0;

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
    } else if (chartType == ChartTypeEnum.StackedArea100) {
      chartOptions.type = 'line';
      chartOptions.data.datasets.forEach(item => (item.fill = true));
      chartOptions.options.elements.line.tension = 0;

      chartOptions.options.scales.xAxes[0].stacked = true;
      chartOptions.options.scales.yAxes[0].stacked = true;
      chartOptions.options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false };
    } else if (chartType == ChartTypeEnum.Doughnut) {
      chartOptions.type = 'doughnut';
      chartOptions.data = pieData;
    } else if (chartType == ChartTypeEnum.ExplodedDoughnut) {
      chartOptions.type = 'doughnut';
      chartOptions.data = pieData;
      chartOptions.options.elements.arc.borderWidth = 15;
    } else if (chartType == ChartTypeEnum.Bubble) {
      chartOptions.type = 'bubble';
      chartOptions.data = {
        datasets: [
          {
            label: 'John',
            data: [
              {
                x: 3,
                y: 15,
                r: 10
              }
            ],
            backgroundColor: '#ffc94a',
            hoverBackgroundColor: '#ffc94a'
          },
          {
            label: 'Paul',
            data: [
              {
                x: 6,
                y: 20,
                r: 14
              }
            ],
            backgroundColor: '#42c3c9',
            hoverBackgroundColor: '#42c3c9'
          },
          {
            label: 'George',
            data: [
              {
                x: 4,
                y: 10,
                r: 30
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          }
        ]
      };
    }

    this.myChart = new Chart(ctx, chartOptions);
  }

  ngOnDestroy() {
    this.onDataChangeSub.unsubscribe();
    this.onFormatChangeSub.unsubscribe();
  }
}
