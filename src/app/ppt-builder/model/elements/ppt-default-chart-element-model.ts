import {
  FormatColorPickerInputModel,
  PPtFormatInputsEnum,
  PPtElementFormatInputTypeEnum,
  ColumnChartFormatModel,
  BarChartFormatModel,
  LineChartFormatModel,
  PptBaseChartElementModel,
  PptBaseElementModel,
  AnalyseApiDataModel,
  ChartTypeEnum,
  PptBaseChartDataModel
} from '..';

import * as _ from 'underscore';

export class PptDefaultChartElementModel extends PptBaseChartElementModel {
  constructor(el: PptBaseElementModel) {
    super(el);
    this.dataModal = new PptDefaultChartDataModel();
    this.dataModal.labels = ['Renault', 'Toyota', 'Mercedes', 'Volkswagen', 'Fiat'];
    this.dataModal.dataSets = [
      { label: 'Olumlu', fill: false, data: [80, 50, 23, 56, 43], backgroundColor: '#ffc94a' },
      { label: 'Olumsuz', fill: false, data: [90, 45, 26, 64, 37], backgroundColor: '#42c3c9' }
    ];
    this.dataModal.dataSets.forEach(item => {
      let categoryBgColor: FormatColorPickerInputModel = {
        inputId: PPtFormatInputsEnum.chartCategoryBgColor,
        name: '',
        inputType: PPtElementFormatInputTypeEnum.colorPicker,
        value: item.backgroundColor
      };
      item.formatInput = categoryBgColor;
    });
  }

  dataModal: PptDefaultChartDataModel;

  toJsonModel() {
    let jsonModel = super.toJsonModel();
    (jsonModel.dataModal as PptDefaultChartDataModel).dataSets.forEach(dataset => {
      (dataset as any)._meta = undefined;
    });
    return jsonModel;
  }

  setData(data: Array<AnalyseApiDataModel>) {
    let oldDateSets = this.dataModal.dataSets;
    this.dataModal.labels = [];
    this.dataModal.dataSets = [];
    let dataSource = this.dataModal.dataSource;
    let gorupedData = _.groupBy(data, dataSource.series.name);

    Object.keys(gorupedData).forEach(key => {
      this.dataModal.labels.push(key);
      let custoDatas = gorupedData[key];

      custoDatas.forEach(custoData => {
        dataSource.categories.forEach((cat: any) => {
          let selectedCat = cat.selectedProp;
          let dataSetModel = new PptDefaultChartDataSetModel();
          dataSetModel.label = selectedCat.friendlyName;
          dataSetModel.data = [];
          dataSetModel.backgroundColor = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
          let categoryBgColor: FormatColorPickerInputModel = {
            inputId: PPtFormatInputsEnum.chartCategoryBgColor,
            name: '',
            inputType: PPtElementFormatInputTypeEnum.colorPicker,
            value: dataSetModel.backgroundColor
          };
          dataSetModel.formatInput = categoryBgColor;
          let foundedDataSetIndex = this.dataModal.dataSets.findIndex(item => item.label == selectedCat.friendlyName);
          if (foundedDataSetIndex >= 0) {
            this.dataModal.dataSets[foundedDataSetIndex].data.push(custoData[selectedCat.name]);
          } else {
            dataSetModel.data.push(custoData[selectedCat.name]);
            if (this.dataModal.dataSets.length < oldDateSets.length) {
              let oldDataSet = oldDateSets[this.dataModal.dataSets.length];
              dataSetModel.backgroundColor = oldDataSet.backgroundColor;
            }
            this.dataModal.dataSets.push(dataSetModel);
          }
        });
      });
    });
  }

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxChartItem: any = {};
    pptxChartItem.options = this.options;

    let defChartData: any = [];
    pptxChartItem.options.chartColors = [];

    this.dataModal.dataSets.forEach(item => {
      let newData: any = {};
      newData.name = item.label;
      newData.labels = this.dataModal.labels;
      newData.values = item.data;
      pptxChartItem.options.chartColors.push(item.backgroundColor.replace('#', ''));
      defChartData.push(newData);
    });

    pptxChartItem.data = defChartData;
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
        pptxChartItem.options.lineDataSymbol = 'none';
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
      //AREA
      case ChartTypeEnum.Area:
        pptxChartItem.type = pptx.charts.AREA;
        break;
      case ChartTypeEnum.StackedArea:
        pptxChartItem.type = pptx.charts.AREA;
        pptxChartItem.options.barGrouping = 'stacked';
        break;
      case ChartTypeEnum.StackedArea100:
        pptxChartItem.type = pptx.charts.AREA;
        pptxChartItem.options.barGrouping = 'percentStacked';
        break;
      //Doughnut
      case ChartTypeEnum.Doughnut:
        pptxChartItem.type = pptx.charts.DOUGHNUT;
        break;
      case ChartTypeEnum.ExplodedDoughnut:
        pptxChartItem.type = pptx.charts.DOUGHNUT;
        break;
      case ChartTypeEnum.Pie:
        pptxChartItem.type = pptx.charts.PIE;
        break;
      case ChartTypeEnum.ExplodedPie:
        pptxChartItem.type = pptx.charts.ExplodedPie;
        break;
      default:
        break;
    }

    if (this.format instanceof LineChartFormatModel) {
      pptxChartItem.options.lineSmooth = this.format.formatInputs.smoothLine.value;
    }

    slide.addChart(pptxChartItem.type, pptxChartItem.data, pptxChartItem.options);
  }
}

export class PptDefaultChartDataModel extends PptBaseChartDataModel {
  constructor() {
    super();

    this.dataSets = new Array<PptDefaultChartDataSetModel>();
  }

  dataSets: Array<PptDefaultChartDataSetModel>;
}

export class PptDefaultChartDataSetModel {
  constructor() {
    this.data = new Array<number>();
    this.backgroundColorArray = Array<string>();
  }

  label: string;
  data: Array<number>;
  fill: boolean = false;
  backgroundColor: string;
  backgroundColorArray?: Array<string>;
  formatInput?: FormatColorPickerInputModel;
}
