import { BaseElementFormatModel } from '.';
import { EventEmitter } from 'events';
import {
  BaseFormatInputModel,
  ShapeTypeEnum,
  BarChartFormatModel,
  ColumnChartFormatModel
} from './element-format-model';
import { Subject } from 'rxjs';

export enum PPtElementEnum {
  Table = 1,
  Chart = 2,
  Text = 3,
  Image = 4,
  Shape
}

export enum ChartTypeEnum {
  ClusteredColumn = 1,
  StackedColumn,
  StackedColumn100,
  ClusteredBar,
  StackedBar,
  StackedBar100,
  Line,
  StackedLine,
  StackedLine100,
  MarkedLine,
  StackedMarkedLine,
  StackedMarkedLine100,
  MarkedScatter,
  SmoothMarkedScatter,
  SmoothLinedScatter,
  StraightMarkedScatter,
  StraightLinedScatter,
  Pie,
  ExplodedPie,
  Area,
  StackedArea,
  StackedArea100,
  Doughnut,
  ExplodedDoughnut,
  Bubble
}

interface PptxGenerator {
  generatePptxItem(pptx: any, slide: any): any;
}

export class PptElementModel implements PptxGenerator {
  generatePptxItem(pptx: any, slide: any) {
    return;
  }

  constructor() {
    this.format = new BaseElementFormatModel();
    this.onFormatChange = new Subject<BaseFormatInputModel>();
  }

  type: PPtElementEnum;
  name: string;
  x?: string;
  y?: string;
  format: BaseElementFormatModel;
  onFormatChange: Subject<BaseFormatInputModel>;
  isActiveElement: boolean;
  id: number;
  isActive: boolean;
}

export class PptChartElementModel extends PptElementModel {
  chartType: ChartTypeEnum;

  generatePptxItem(pptx: any, slide: any) {
    let chart: any = {};

    let dataChartAreaLine = [
      {
        name: 'Actual Sales',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [1500, 4600, 5156, 3167, 8510, 8009, 6006, 7855, 12102, 12789, 10123, 15121]
      },
      {
        name: 'Projected Sales',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [1000, 2600, 3456, 4567, 5010, 6009, 7006, 8855, 9102, 10789, 11123, 12121]
      }
    ];

    let scatterData = [
      { name: 'X-Axis', values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { name: 'Y-Value 1', values: [13, 20, 21, 25] },
      { name: 'Y-Value 2', values: [21, 32, 35, 49] }
    ];

    let pieData = [
      {
        name: 'Project Status',
        labels: ['Red', 'Amber', 'Green', 'Unknown'],
        values: [8, 20, 30, 2]
      }
    ];

    let bubbleData = [
      { name: 'X-Axis', values: [0.3, 0.6, 0.9, 1.2, 1.5, 1.7] },
      { name: 'Y-Value 1', values: [1.3, 9, 7.5, 2.5, 7.5, 5], sizes: [1, 4, 2, 3, 7, 4] },
      { name: 'Y-Value 2', values: [5, 3, 2, 7, 2, 10], sizes: [9, 7, 9, 2, 4, 8] }
    ];

    chart.Data = dataChartAreaLine;

    let elX = this.format.formatInputs.x.value;
    let elY = this.format.formatInputs.y.value;
    let boardEl: any = document.getElementsByClassName('board');
    let boardW = boardEl[0].offsetWidth;
    let boardY = boardEl[0].offsetHeight;

    elX = elX < 0 ? 0 : elX;
    elY = elY < 0 ? 0 : elY;

    let xRate = ((elX * 100) / boardW / 10).toFixed(2);
    let yRate = ((elY * 100) / boardY / 20).toFixed(2);

    let elW = this.format.formatInputs.width.value;
    let elH = this.format.formatInputs.height.value;
    elW = elW < 0 ? 0 : elW;
    elH = elH < 0 ? 0 : elH;

    let wRate = ((elW * 100) / boardW / 10).toFixed(2);
    let hRate = ((elH * 100) / boardY / 20).toFixed(2);

    chart.Options = { x: xRate, y: yRate, w: wRate, h: hRate };
    let columnChartFormatModel: ColumnChartFormatModel = this.format as ColumnChartFormatModel;
    let barChartFormatModel: BarChartFormatModel = this.format as BarChartFormatModel;

    switch (this.chartType) {
      //column bar
      case ChartTypeEnum.ClusteredColumn:
        chart.Type = pptx.charts.BAR;
        chart.Options.barGrouping = 'clustered';
        chart.Options.barGapWidthPct = columnChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedColumn:
        chart.Type = pptx.charts.BAR;
        chart.Options.barGrouping = 'stacked';
        chart.Options.barGapWidthPct = columnChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedColumn100:
        chart.Type = pptx.charts.BAR;
        chart.Options.barGrouping = 'percentStacked';
        chart.Options.barGapWidthPct = columnChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      //horizontal bar
      case ChartTypeEnum.ClusteredBar:
        chart.Type = pptx.charts.BAR;
        chart.Options.barGrouping = 'clustered';
        chart.Options.barDir = 'bar';
        chart.Options.barGapWidthPct = barChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedBar:
        chart.Type = pptx.charts.BAR;
        chart.Options.barGrouping = 'stacked';
        chart.Options.barDir = 'bar';
        chart.Options.barGapWidthPct = barChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedBar100:
        chart.Type = pptx.charts.BAR;
        chart.Options.barGrouping = 'percentStacked';
        chart.Options.barDir = 'bar';
        chart.Options.barGapWidthPct = barChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      //line
      case ChartTypeEnum.Line:
        chart.Type = pptx.charts.LINE;
        break;
      case ChartTypeEnum.StackedLine:
        chart.Type = pptx.charts.LINE;
        chart.Options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedLine100:
        chart.Type = pptx.charts.LINE;
        chart.Options.barGrouping = 'percentStacked';
        break;
      case ChartTypeEnum.MarkedLine:
        chart.Type = pptx.charts.LINE;
        break;
      case ChartTypeEnum.StackedMarkedLine:
        chart.Type = pptx.charts.LINE;
        chart.Options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedMarkedLine100:
        chart.Type = pptx.charts.LINE;
        chart.Options.barGrouping = 'percentStacked';
        break;
      //Scatter
      case ChartTypeEnum.MarkedScatter:
        chart.Type = pptx.charts.SCATTER;
        chart.Data = scatterData;
        chart.Options.lineSize = 0;
        chart.Options.lineDataSymbolSize = 15;
        break;
      case ChartTypeEnum.SmoothMarkedScatter:
        chart.Type = pptx.charts.SCATTER;
        chart.Data = scatterData;
        chart.Options.lineSize = 2;
        chart.Options.lineSmooth = true;
        break;
      case ChartTypeEnum.SmoothMarkedScatter:
        chart.Type = pptx.charts.SCATTER;
        chart.Data = scatterData;
        chart.Options.lineSize = 2;
        chart.Options.lineSmooth = true;
        chart.Options.lineDataSymbolSize = 0;
        break;
      case ChartTypeEnum.StraightMarkedScatter:
        chart.Type = pptx.charts.SCATTER;
        chart.Data = scatterData;
        chart.Options.lineSize = 2;
        chart.Options.lineSmooth = false;
        break;
      case ChartTypeEnum.StraightLinedScatter:
        chart.Type = pptx.charts.SCATTER;
        chart.Data = scatterData;
        chart.Options.lineSize = 2;
        chart.Options.lineSmooth = false;
        chart.Options.lineDataSymbolSize = 0;
        break;
      //PIE
      case ChartTypeEnum.Pie:
        chart.Type = pptx.charts.PIE;
        chart.Data = pieData;
        break;
      case ChartTypeEnum.ExplodedPie:
        chart.Type = pptx.charts.PIE;
        chart.Data = pieData;
        break;
      //AREA
      case ChartTypeEnum.Area:
        chart.Type = pptx.charts.AREA;
        chart.Data = dataChartAreaLine;
        break;
      case ChartTypeEnum.StackedArea:
        chart.Type = pptx.charts.AREA;
        chart.Data = dataChartAreaLine;
        chart.Options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedArea100:
        chart.Type = pptx.charts.AREA;
        chart.Data = dataChartAreaLine;
        chart.Options.barGrouping = 'percentStacked';
        break;
      //Doughnut
      case ChartTypeEnum.Doughnut:
        chart.Type = pptx.charts.DOUGHNUT;
        chart.Data = dataChartAreaLine;
        break;
      case ChartTypeEnum.ExplodedDoughnut:
        chart.Type = pptx.charts.DOUGHNUT;
        chart.Data = dataChartAreaLine;
        break;
      case ChartTypeEnum.Bubble:
        chart.Type = pptx.charts.BUBBLE;
        chart.Data = bubbleData;
        break;
      default:
        break;
    }

    slide.addChart(chart.Type, chart.Data, chart.Options);
  }
}

export class PptTableElementModel extends PptElementModel {
  row: number;
  col: number;
}

export class PptTextElementModel extends PptElementModel {
  text: string;
  backgroundColor: string;
  fontSize: string;
  font: string;
  fontWeigth: number;
  fontStyle: string;
  color: string;
  radius: string;
  width: string;
}

export class PptShapeElementModel extends PptElementModel {
  shapeType: ShapeTypeEnum;
  rotate: number;
  radius: number;
  lineSize: number;
  lineStyle: string;
  isLineArrow: boolean;
  arrowDirection: string;
  color: string;
  isShowText: boolean;
  textAlign: string;
  textFontSize: number;
  text: string;
  shapeBorder: boolean;
  shapeBorderColor: string;
  shapeBorderSize: number;
  shapeBorderStyle: string;
}

export class PptImageElementModel extends PptElementModel {
  url: string;
  width: string;
  height: string;
}

export class LoadElementModel {
  isClear?: boolean;
  elementList: PptElementModel[];
  dontAddToSlide?: boolean = false;
}
