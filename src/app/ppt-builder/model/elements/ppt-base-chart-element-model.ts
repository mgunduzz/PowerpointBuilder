import { PptBaseElementModel } from '..';

export class PptBaseChartElementModel extends PptBaseElementModel {
  /**
   *
   */
  constructor(el: PptBaseElementModel) {
    super(el);
    this.dataModal = new PptBaseChartDataModel();
  }

  chartType: ChartTypeEnum;
  dataModal: PptBaseChartDataModel;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);
    this.options.showLegend = this.format.formatInputs.legend.value;
    this.options.showTitle = this.format.formatInputs.title.value;
    this.options.showValue = this.format.formatInputs.value.value;
    this.options.title = this.format.formatInputs.chartTitleText.value;
  }
}

export class PptBaseChartDataModel {
  constructor() {
    this.labels = new Array<string>();

    this.dataSource = {
      series: {},
      categories: []
    };
  }

  selectedSource: any;
  labels: Array<string>;
  dataSource?: any;
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
