import * as _ from 'underscore';
import {
  FormatColorPickerInputModel,
  PPtFormatInputsEnum,
  PPtElementFormatInputTypeEnum,
  PptBaseChartElementModel,
  PptBaseElementModel,
  AnalyseApiDataModel,
  ChartTypeEnum,
  PptBaseChartDataModel
} from '..';

export class PptPieChartElementModel extends PptBaseChartElementModel {
  constructor(el: PptBaseElementModel) {
    super(el);
    this.dataModal = new PptPieChartDataModel();
    this.dataModal.labels = ['Renault', 'Toyota', 'Mercedes'];
    this.dataModal.dataSet = { label: 'Olumlu', data: [80, 50, 23], backgroundColors: [] };
    let colors = ['#ffc94a', '#42c3c9', '#c94266'];
    this.dataModal.dataSet.data.forEach((item, index) => {
      let color = colors[index];
      let categoryBgColor: FormatColorPickerInputModel = {
        inputId: PPtFormatInputsEnum.chartCategoryBgColor,
        name: '',
        inputType: PPtElementFormatInputTypeEnum.colorPicker,
        value: color
      };
      this.dataModal.dataSet.backgroundColors.push({
        color: color,
        formatInput: categoryBgColor
      });
    });
  }

  dataModal: PptPieChartDataModel;

  toJsonModel() {
    let jsonModel = super.toJsonModel();
    return jsonModel;
  }

  setData(data: Array<AnalyseApiDataModel>) {
    let oldDateSets = this.dataModal.dataSet;
    this.dataModal.labels = [];
    this.dataModal.dataSet = new PptPieChartDataSetModel();
    let dataSource = this.dataModal.dataSource;
    let categories = dataSource.categories[0];
    let gorupedData = _.groupBy(data, dataSource.series.name);

    Object.keys(gorupedData).forEach(key => {
      this.dataModal.labels.push(key);
      let custoDatas = gorupedData[key];
      let data = custoDatas[0][categories.selectedProp.name];
      this.dataModal.dataSet.data.push(data);

      if (oldDateSets.backgroundColors[this.dataModal.dataSet.data.length - 1]) {
        this.dataModal.dataSet.backgroundColors.push(
          oldDateSets.backgroundColors[this.dataModal.dataSet.data.length - 1]
        );
      } else {
        let rndBgColor = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
        let categoryBgColor: FormatColorPickerInputModel = {
          inputId: PPtFormatInputsEnum.chartCategoryBgColor,
          name: '',
          inputType: PPtElementFormatInputTypeEnum.colorPicker,
          value: rndBgColor
        };
        this.dataModal.dataSet.backgroundColors.push({
          color: rndBgColor,
          formatInput: categoryBgColor
        });
      }
    });
  }

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxChartItem: any = {};
    pptxChartItem.options = this.options;

    let defChartData: any = [];
    pptxChartItem.options.chartColors = [];

    let newData: any = {};
    newData.name = this.dataModal.dataSet.label;
    newData.labels = this.dataModal.labels;
    newData.values = this.dataModal.dataSet.data;
    defChartData.push(newData);

    pptxChartItem.options.chartColors = this.dataModal.dataSet.backgroundColors.map(item =>
      item.color.replace('#', '')
    );
    pptxChartItem.data = defChartData;

    switch (this.chartType) {
      //Pie
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

    slide.addChart(pptxChartItem.type, pptxChartItem.data, pptxChartItem.options);
  }
}

export class PptPieChartDataModel extends PptBaseChartDataModel {
  constructor() {
    super();
  }

  dataSet: PptPieChartDataSetModel;
}

export class PptPieChartDataSetModel {
  constructor() {
    this.data = new Array<number>();
    this.backgroundColors = Array<any>();
  }

  label: string;
  data: Array<number>;
  backgroundColors?: Array<any>;
}
