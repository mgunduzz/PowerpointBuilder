import { Subject } from 'rxjs';
import { TableFormatModel, FormatNumberInputModel, PptBaseElementModel, AnalyseApiDataModel } from '..';

export class PptTableElementModel extends PptBaseElementModel {
  row: number;
  col: number;
  cells: Array<TableCellModel>;
  defaultCellWidth?: number;
  defaultCellHeight?: number;
  onMergeCells = new Subject<any>();
  selectedCells: Array<TableCellModel>;
  dataModal: PptBaseTableDataModel;

  toJsonModel() {
    let jsonModel = super.toJsonModel();
    jsonModel.onMergeCells = undefined;
    return jsonModel;
  }

  constructor(row: number, col: number) {
    super();
    this.format = new TableFormatModel(this.format);
    this.dataModal = new PptBaseTableDataModel();
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
            let newCell = new TableCellModel(rIndex, cIndex, this, cellX, cellY);
            newCell.isSelected = false;
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

export class TableCellModel extends PptBaseElementModel {
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

export class PptBaseTableDataModel {
  constructor() {}
  selectedSource: any;
}
