import { BaseElementFormatModel } from '.';
import { EventEmitter } from 'events';
import {
  BaseFormatInputModel,
  ShapeTypeEnum,
  BarChartFormatModel,
  ColumnChartFormatModel,
  TextFormatModel
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

    this.options = { x: xRate, y: yRate, w: wRate, h: hRate };
    return;
  }

  constructor(el?: PptElementModel) {
    this.format = new BaseElementFormatModel();
    this.onFormatChange = new Subject<Array<FormatChangeModel>>();

    if (el) {
      this.format = el.format;
    }
  }

  type: PPtElementEnum;
  name: string;
  format: BaseElementFormatModel;
  onFormatChange: Subject<Array<FormatChangeModel>>;
  isActiveElement: boolean;
  id: number;
  isActive: boolean;
  z: number = 0;
  options?: any;
}

export class FormatChangeModel {
  formatInput: BaseFormatInputModel;
  updateComponent?: boolean = false;
  addToHistory?: boolean = false;
}

export class PptChartElementModel extends PptElementModel {
  /**
   *
   */
  constructor(el: PptElementModel) {
    super(el);
  }

  chartType: ChartTypeEnum;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxChartItem: any = {};
    pptxChartItem.options = this.options;

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

    pptxChartItem.data = dataChartAreaLine;

    let columnChartFormatModel: ColumnChartFormatModel = this.format as ColumnChartFormatModel;
    let barChartFormatModel: BarChartFormatModel = this.format as BarChartFormatModel;

    switch (this.chartType) {
      //column bar
      case ChartTypeEnum.ClusteredColumn:
        pptxChartItem.type = pptx.charts.BAR;
        pptxChartItem.options.barGrouping = 'clustered';
        pptxChartItem.options.barGapWidthPct =
          columnChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedColumn:
        pptxChartItem.type = pptx.charts.BAR;
        pptxChartItem.options.barGrouping = 'stacked';
        pptxChartItem.options.barGapWidthPct =
          columnChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedColumn100:
        pptxChartItem.type = pptx.charts.BAR;
        pptxChartItem.options.barGrouping = 'percentStacked';
        pptxChartItem.options.barGapWidthPct =
          columnChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      //horizontal bar
      case ChartTypeEnum.ClusteredBar:
        pptxChartItem.type = pptx.charts.BAR;
        pptxChartItem.options.barGrouping = 'clustered';
        pptxChartItem.options.barDir = 'bar';
        pptxChartItem.options.barGapWidthPct = barChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedBar:
        pptxChartItem.type = pptx.charts.BAR;
        pptxChartItem.options.barGrouping = 'stacked';
        pptxChartItem.options.barDir = 'bar';
        pptxChartItem.options.barGapWidthPct = barChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      case ChartTypeEnum.StackedBar100:
        pptxChartItem.type = pptx.charts.BAR;
        pptxChartItem.options.barGrouping = 'percentStacked';
        pptxChartItem.options.barDir = 'bar';
        pptxChartItem.options.barGapWidthPct = barChartFormatModel.formatInputs.chartSpaceBetweenCategory.value * 100;
        break;
      //line
      case ChartTypeEnum.Line:
        pptxChartItem.type = pptx.charts.LINE;
        break;
      case ChartTypeEnum.StackedLine:
        pptxChartItem.type = pptx.charts.LINE;
        pptxChartItem.options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedLine100:
        pptxChartItem.type = pptx.charts.LINE;
        pptxChartItem.options.barGrouping = 'percentStacked';
        break;
      case ChartTypeEnum.MarkedLine:
        pptxChartItem.type = pptx.charts.LINE;
        break;
      case ChartTypeEnum.StackedMarkedLine:
        pptxChartItem.type = pptx.charts.LINE;
        pptxChartItem.options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedMarkedLine100:
        pptxChartItem.type = pptx.charts.LINE;
        pptxChartItem.options.barGrouping = 'percentStacked';
        break;
      //Scatter
      case ChartTypeEnum.MarkedScatter:
        pptxChartItem.type = pptx.charts.SCATTER;
        pptxChartItem.data = scatterData;
        pptxChartItem.options.lineSize = 0;
        pptxChartItem.options.lineDataSymbolSize = 15;
        break;
      case ChartTypeEnum.SmoothMarkedScatter:
        pptxChartItem.type = pptx.charts.SCATTER;
        pptxChartItem.data = scatterData;
        pptxChartItem.options.lineSize = 2;
        pptxChartItem.options.lineSmooth = true;
        break;
      case ChartTypeEnum.SmoothMarkedScatter:
        pptxChartItem.type = pptx.charts.SCATTER;
        pptxChartItem.data = scatterData;
        pptxChartItem.options.lineSize = 2;
        pptxChartItem.options.lineSmooth = true;
        pptxChartItem.options.lineDataSymbolSize = 0;
        break;
      case ChartTypeEnum.StraightMarkedScatter:
        pptxChartItem.type = pptx.charts.SCATTER;
        pptxChartItem.data = scatterData;
        pptxChartItem.options.lineSize = 2;
        pptxChartItem.options.lineSmooth = false;
        break;
      case ChartTypeEnum.StraightLinedScatter:
        pptxChartItem.type = pptx.charts.SCATTER;
        pptxChartItem.data = scatterData;
        pptxChartItem.options.lineSize = 2;
        pptxChartItem.options.lineSmooth = false;
        pptxChartItem.options.lineDataSymbolSize = 0;
        break;
      //PIE
      case ChartTypeEnum.Pie:
        pptxChartItem.type = pptx.charts.PIE;
        pptxChartItem.data = pieData;
        break;
      case ChartTypeEnum.ExplodedPie:
        pptxChartItem.type = pptx.charts.PIE;
        pptxChartItem.data = pieData;
        break;
      //AREA
      case ChartTypeEnum.Area:
        pptxChartItem.type = pptx.charts.AREA;
        pptxChartItem.data = dataChartAreaLine;
        break;
      case ChartTypeEnum.StackedArea:
        pptxChartItem.type = pptx.charts.AREA;
        pptxChartItem.data = dataChartAreaLine;
        pptxChartItem.options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedArea100:
        pptxChartItem.type = pptx.charts.AREA;
        pptxChartItem.data = dataChartAreaLine;
        pptxChartItem.options.barGrouping = 'percentStacked';
        break;
      //Doughnut
      case ChartTypeEnum.Doughnut:
        pptxChartItem.type = pptx.charts.DOUGHNUT;
        pptxChartItem.data = dataChartAreaLine;
        break;
      case ChartTypeEnum.ExplodedDoughnut:
        pptxChartItem.type = pptx.charts.DOUGHNUT;
        pptxChartItem.data = dataChartAreaLine;
        break;
      case ChartTypeEnum.Bubble:
        pptxChartItem.type = pptx.charts.BUBBLE;
        pptxChartItem.data = bubbleData;
        break;
      default:
        break;
    }

    slide.addChart(pptxChartItem.type, pptxChartItem.data, pptxChartItem.options);
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
  textAlign: string;
  stroke: string;
  indent: string;
  firstLineIndent: string;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxTextItem: any = {};
    let textFormat = this.format as TextFormatModel;

    pptxTextItem.text = this.text;
    pptxTextItem.options = this.options;
    pptxTextItem.options.color = this.color.replace('#', '');
    pptxTextItem.options.fill = this.backgroundColor.replace('#', '');
    pptxTextItem.options.fontSize = this.fontSize.replace('px', '');
    pptxTextItem.options.rectRadius = this.radius;
    pptxTextItem.options.italic = this.fontStyle == 'italic';
    pptxTextItem.options.bold = this.fontWeigth == 600;
    pptxTextItem.options.stroke = this.stroke == 'unset !important';
    pptxTextItem.options.indent = this.indent == 'unset';
    pptxTextItem.options.firstLineIndent = this.firstLineIndent == 'unset';

    let align = textFormat.formatInputs.textAlign.value.find(item => item.selected).key;

    switch (align) {
      case 1:
        pptxTextItem.options.align = 'left';
        break;
      case 2:
        pptxTextItem.options.align = 'center';
        break;
      case 3:
        pptxTextItem.options.align = 'right';
        break;

      default:
        break;
    }

    slide.addText(pptxTextItem.text, pptxTextItem.options);
  }
}

export class PptShapeElementModel extends PptElementModel {
  shapeType: ShapeTypeEnum;
  rotate: number;
  radius: number;
  lineSize: number;
  lineStyle: string;
  isLineArrow: boolean;
  arrowDirection: number; //2sağ 1sol 3 sağsol 0 yok
  color: string;
  isShowText: boolean;
  textAlign: string;
  textFontSize: number;
  text: string;
  shapeBorder: boolean;
  shapeBorderColor: string;
  shapeBorderSize: number;
  shapeBorderStyle: string;
  isDashed: boolean;
}

export class PptImageElementModel extends PptElementModel {
  url: string;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxImageItem: any = {};
    pptxImageItem.Options = this.options;
    pptxImageItem.Options.data = this.url;

    slide.addImage(pptxImageItem.Options);
  }
}

export class LoadElementModel {
  isClear?: boolean;
  elementList: PptElementModel[];
  dontAddToSlide?: boolean = false;
}
