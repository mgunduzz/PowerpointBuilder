import { BaseElementFormatModel } from '.';
import { EventEmitter } from 'events';
import {
  BaseFormatInputModel,
  ShapeTypeEnum,
  BarChartFormatModel,
  ColumnChartFormatModel,
  TextFormatModel,
  FormatColorPickerInputModel,
  PPtFormatInputsEnum,
  PPtElementFormatInputTypeEnum,
  FormatNumberInputModel,
  TableFormatModel,
  LineChartFormatModel
} from './element-format-model';
import { Subject } from 'rxjs';
import * as _ from 'underscore';

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
    this.onDataChange = new Subject<PptBaseChartDataModel>();

    if (el) {
      this.format = el.format;
    }
  }

  type: PPtElementEnum;
  name: string;
  format: BaseElementFormatModel;
  onDataChange: Subject<PptBaseChartDataModel>;
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

export class PptBaseChartElementModel extends PptElementModel {
  /**
   *
   */
  constructor(el: PptElementModel) {
    super(el);
  }

  chartType: ChartTypeEnum;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    this.options.showLegend = this.format.formatInputs.legend.value;
    this.options.showTitle = this.format.formatInputs.title.value;
    this.options.showValue = this.format.formatInputs.value.value;
    this.options.title = this.format.formatInputs.chartTitleText.value;
  }
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

export class PptPieChartDataSetModel {
  constructor() {
    this.data = new Array<number>();
    this.backgroundColors = Array<any>();
  }

  label: string;
  data: Array<number>;
  backgroundColors?: Array<any>;
}

export class PptBaseChartDataModel {
  constructor() {
    this.labels = new Array<string>();

    this.dataSource = {
      series: {},
      categories: []
    };
  }

  labels: Array<string>;
  dataSource?: any;
}

export class PptDefaultChartDataModel extends PptBaseChartDataModel {
  constructor() {
    super();

    this.dataSets = new Array<PptDefaultChartDataSetModel>();
  }

  dataSets: Array<PptDefaultChartDataSetModel>;
}

export class PptPieChartDataModel extends PptBaseChartDataModel {
  constructor() {
    super();
  }

  dataSet: PptPieChartDataSetModel;
}

export class PptPieChartElementModel extends PptBaseChartElementModel {
  constructor(el: PptElementModel) {
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

export class PptDefaultChartElementModel extends PptBaseChartElementModel {
  constructor(el: PptElementModel) {
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

export class PptAreaChartElementModel extends PptDefaultChartElementModel {
  constructor(el: PptElementModel) {
    super(el);

    this.dataModal.dataSets.forEach(item => (item.fill = true));
  }

  setData(data: Array<AnalyseApiDataModel>) {
    super.setData(data);

    this.dataModal.dataSets.forEach(item => (item.fill = true));
  }
}

export class PptScatterChartDataSetModel {
  constructor() {
    this.data = new Array<number>();
  }

  label: string;
  data: Array<any>;
  fill: boolean = false;
  backgroundColor: string;
}

export class PptScatterChartDataModel {
  constructor() {
    this.labels = new Array<string>();
    this.dataSets = new Array<PptScatterChartDataSetModel>();
  }

  labels: Array<string>;
  dataSets: Array<PptScatterChartDataSetModel>;
}

export class PptScatterChartElementModel extends PptBaseChartElementModel {
  constructor(el: PptElementModel) {
    super(el);

    this.dataModal = new PptScatterChartDataModel();
    this.dataModal.labels = ['Renault', 'Toyota', 'Mercedes', 'Volkswagen', 'Fiat'];
    this.dataModal.dataSets = [
      {
        label: 'Olumlu',
        fill: false,
        data: [
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
        ],
        backgroundColor: '#ffc94a'
      }
    ];
  }

  dataModal: PptScatterChartDataModel;

  setData(data: Array<AnalyseApiDataModel>) {
    this.dataModal.labels = [];
    this.dataModal.dataSets = [];

    let gorupedData = _.groupBy(data, 'customerName');
  }
}

export class TableCellModel extends PptElementModel {
  constructor(rIndex?: number, cIndex?: number, element?: PptTableElementModel, cellX?: number, cellY?: number) {
    super();
    this.borderSize = 1;
    this.border = '';
    this.borderPosition = '';
    this.borderColor = '#ffffff';
    this.rowSpan = 1;
    this.colSpan = 1;

    let headerBgColor = '#246E96';
    let oddBgColor = '#c3cde6';
    let evenBgColor = '#e1e6f2';

    this.isSelected = false;
    this.rowIndex = rIndex;
    this.colIndex = cIndex;
    this.width = element.defaultCellWidth;
    this.height = element.defaultCellHeight;
    this.left = cellX;
    this.top = cellY;
    this.isHeader = rIndex == 0;
    this.isMerged = false;
    this.isDragOver = false;
    this.id = +('1' + rIndex + cIndex);
    this.bgColor = rIndex % 2 == 0 ? oddBgColor : evenBgColor;
    this.fontColor = '#000000';
    this.fontSize = 10;

    if (this.isHeader) {
      this.bgColor = headerBgColor;
      this.fontSize = 13;
      this.fontColor = '#FFFFFF';
    }
  }

  isSelected: boolean;
  rowIndex: number;
  colIndex: number;
  width: number;
  height: number;
  left: number;
  top: number;
  isHeader: boolean;
  isMerged: boolean;
  isDragOver?: boolean;
  headerData?: any;
  value?: string;
  bgColor?: string;
  fontColor?: string;
  fontSize?: number;
  borderColor?: string;
  borderSize?: number;
  borderPosition?: string;
  border?: string;
  rowSpan: number;
  colSpan: number;
}

export class PptTableElementModel extends PptElementModel {
  row: number;
  col: number;
  cells: Array<TableCellModel>;
  defaultCellWidth?: number;
  defaultCellHeight?: number;
  onMergeCells = new Subject<any>();
  selectedCells: Array<TableCellModel>;

  constructor(row: number, col: number) {
    super();

    this.format = new TableFormatModel(this.format);

    this.row = row;
    this.col = col;

    this.onMergeCells = new Subject<any>();
    this.cells = Array<TableCellModel>();
    this.selectedCells = new Array<TableCellModel>();

    this.defaultCellWidth = +(this.format.formatInputs.width.value / this.col).toFixed(2);
    this.defaultCellHeight = +(this.format.formatInputs.height.value / this.row).toFixed(2);
    this.defaultCellHeight = 35;

    this.cells = new Array<TableCellModel>();

    let cellX,
      cellY = 0;

    for (let rIndex = 0; rIndex < this.row; rIndex++) {
      cellX = 0;

      for (let cIndex = 0; cIndex < this.col; cIndex++) {
        let newCell = new TableCellModel(rIndex, cIndex, this, cellX, cellY);

        this.cells.push(newCell);

        cellX += this.defaultCellWidth;
      }

      cellY += this.defaultCellHeight;
    }
  }

  setData(data: Array<AnalyseApiDataModel>) {
    let cellsHasAHeaderData = this.cells.filter(item => item.headerData);

    cellsHasAHeaderData.forEach(headerCell => {
      let rowDiff = data.length - this.row - 1;

      if (rowDiff > 0) {
        let cellX = 0;
        let cellY = this.cells[this.cells.length - 1].top + this.cells[this.cells.length - 1].height;

        let oddBgColor = '#c3cde6';
        let evenBgColor = '#e1e6f2';

        for (let i = 0; i < rowDiff; i++) {
          cellX = 0;

          for (let j = 0; j < this.col; j++) {
            let rIndex = this.row + i;
            let cIndex = j;

            let newCell = new TableCellModel();
            newCell.isSelected = false;
            newCell.rowIndex = rIndex;
            newCell.colIndex = cIndex;
            newCell.width = this.defaultCellWidth;
            newCell.height = this.defaultCellHeight;
            newCell.left = cellX;
            newCell.top = cellY;
            newCell.isHeader = rIndex == 0;
            newCell.isMerged = false;
            newCell.isDragOver = false;
            newCell.id = +('1' + rIndex + cIndex);
            newCell.bgColor = rIndex % 2 == 0 ? oddBgColor : evenBgColor;
            newCell.fontColor = '#000000';
            newCell.fontSize = 10;
            newCell.value = '';

            this.cells.push(newCell);

            cellX += this.defaultCellWidth;
          }

          cellY += this.defaultCellHeight;
          this.format.formatInputs.height.value += this.defaultCellHeight;
        }

        this.row += rowDiff;
      }

      let columnCells = this.cells.filter(
        item => item.colIndex == headerCell.colIndex && item.rowIndex != headerCell.rowIndex
      );

      data.forEach((dataItem, dataIndex) => {
        if (dataIndex < this.row - 1) {
          columnCells[dataIndex].value = dataItem[headerCell.headerData.name];
        }
      });

      let input = JSON.parse(JSON.stringify(this.format.formatInputs.height)) as FormatNumberInputModel;
      input.update = false;

      this.onFormatChange.next([{ formatInput: input }]);
    });
  }

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let options = this.options;
    options.color = '363636';

    let rows: any[] = [];
    let row: any[] = [];

    this.cells.forEach((cell, index, arr) => {
      console.log({ row: cell.rowSpan, col: cell.colSpan });

      let rowItem: any = {
        text: cell.value,
        options: {
          fontSize: cell.fontSize,
          fill: cell.bgColor,
          color: cell.fontColor.replace('#', ''),
          border: {
            pt: cell.borderSize,
            color: cell.borderColor.replace('#', '')
          }
        }
      };

      if (cell.rowSpan > 1) rowItem.options.rowspan = cell.rowSpan;

      if (cell.colSpan > 1) rowItem.options.colspan = cell.colSpan;

      row.push(rowItem);

      if (index + 1 < arr.length) {
        let nextCell = arr[index + 1];

        if (nextCell.colIndex == 0) {
          rows.push(row);
          row = [];
        }
      } else {
        rows.push(row);
        row = [];
      }
    });

    slide.addTable(rows, options);
  }
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
  listStyle: string;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxTextItem: any = {};
    let textFormat = this.format as TextFormatModel;

    pptxTextItem.text = this.text;
    pptxTextItem.options = this.options;
    pptxTextItem.options.color = this.color.replace('#', '');
    pptxTextItem.options.fill = this.backgroundColor.replace('#', '');
    pptxTextItem.options.fontSize = this.fontSize.replace('pt', '');
    pptxTextItem.options.rectRadius = this.radius;
    pptxTextItem.options.italic = this.fontStyle == 'italic';
    pptxTextItem.options.bold = this.fontWeigth == 600;
    pptxTextItem.options.stroke = this.stroke == 'unset !important';
    pptxTextItem.options.indent = this.indent == 'unset';
    pptxTextItem.options.firstLineIndent = this.firstLineIndent == 'unset';
    pptxTextItem.options.listStyle = this.listStyle == '';

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
  textVerticalAlign: string;
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
  shapeBorder: string;
  shapeBorderColor: string;
  shapeBorderSize: number;
  shapeBorderStyle: string;
  isDashed: boolean;
  arrowSize: number;
  lineWidth: number;
  fontColor: string;
  isShapeBorder: boolean;
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

export class AnalyseApiDataModel {
  customerName: string;
  positive: number;
  negative: number;
}
