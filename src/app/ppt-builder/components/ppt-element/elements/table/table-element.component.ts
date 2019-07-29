import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewChecked,
  Renderer
} from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel,
  FormatNumberInputModel,
  TableCellModel,
  FormatColorPickerInputModel,
  FormatChangeModel
} from '@app/ppt-builder/model';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'ppt-table-element',
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.scss']
})
export class TableElement implements OnInit, OnDestroy, AfterViewChecked {
  @Input('element') element: PptTableElementModel;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChildren('tableCell') tableCells: QueryList<ElementRef>;

  lastMouseDownEvent: MouseEvent;
  lastRowCol: any;
  mergeCellSub: Subscription;
  onFormatChangeSub: Subscription;

  oldWidth: number;
  oldHeight: number;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer) {}

  ngOnInit() {
    this.onFormatChangeSub = this.element.onFormatChange.subscribe(res => {
      res.forEach(item => {
        var formatInput = item.formatInput as FormatNumberInputModel;
        var colorFormatInput = item.formatInput as FormatColorPickerInputModel;

        if (formatInput.inputId == PPtFormatInputsEnum.width) {
          if (this.oldWidth) {
            let newWidth = formatInput.value;
            let ratio = newWidth / this.oldWidth;

            this.element.cells.forEach((piece, index) => {
              piece.width = piece.width * ratio;
              piece.left = piece.left * ratio;
            });
          }

          this.oldWidth = formatInput.value;
        } else if (formatInput.inputId == PPtFormatInputsEnum.height) {
          if (this.oldHeight) {
            let newHeight = formatInput.value;
            let ratio = newHeight / this.oldHeight;

            this.element.cells.forEach((piece, index) => {
              piece.height = piece.height * ratio;
              piece.top = piece.top * ratio;
            });
          }

          this.oldHeight = formatInput.value;
        } else if (colorFormatInput.inputId == PPtFormatInputsEnum.cellBackgroundColor) {
          this.element.cells.forEach(item => {
            if (item.isSelected) {
              item.bgColor = colorFormatInput.value;
            }
          });
        } else if (colorFormatInput.inputId == PPtFormatInputsEnum.cellFontColor) {
          this.element.cells.forEach(item => {
            if (item.isSelected) {
              item.fontColor = colorFormatInput.value;
            }
          });
        } else if (colorFormatInput.inputId == PPtFormatInputsEnum.cellFontSize) {
          this.element.cells.forEach(item => {
            if (item.isSelected) {
              item.fontSize = formatInput.value;
            }
          });
        }
      });
    });

    this.mergeCellSub = this.element.onMergeCells.subscribe(res => {
      this.mergeSelectedCells();
    });

    this.element.cells = new Array<TableCellModel>();

    let cellWidth = +(this.element.format.formatInputs.width.value / this.element.col).toFixed(2);
    let cellHeight = +(this.element.format.formatInputs.height.value / this.element.row).toFixed(2);
    cellHeight = 35;

    this.element.format.formatInputs.height.value = this.element.row * cellHeight;

    let cellX,
      cellY = 0;

    let headerBgColor = '#246E96';
    let oddBgColor = '#c3cde6';
    let evenBgColor = '#e1e6f2';

    for (let rIndex = 0; rIndex < this.element.row; rIndex++) {
      cellX = 0;

      for (let cIndex = 0; cIndex < this.element.col; cIndex++) {
        let newCell = new TableCellModel();
        newCell.isSelected = false;
        newCell.rowIndex = rIndex;
        newCell.colIndex = cIndex;
        newCell.width = cellWidth;
        newCell.height = cellHeight;
        newCell.left = cellX;
        newCell.top = cellY;
        newCell.isHeader = rIndex == 0;
        newCell.isMerged = false;
        newCell.isDragOver = false;
        newCell.id = +('1' + rIndex + cIndex);
        newCell.bgColor = rIndex % 2 == 0 ? oddBgColor : evenBgColor;
        newCell.fontColor = '#000000';
        newCell.fontSize = 14;

        if (newCell.isHeader) newCell.bgColor = headerBgColor;

        this.element.cells.push(newCell);

        cellX += cellWidth;
      }

      cellY += cellHeight;
    }
  }

  onTableMouseDown(ev: MouseEvent, rowIndex: number, colIndex: number) {
    if (ev.button == 0) {
      this.lastMouseDownEvent = ev;
      this.lastRowCol = { rowIndex, colIndex };

      this.calculateSelectedTablePiece(
        this.lastMouseDownEvent.clientX,
        this.lastMouseDownEvent.clientY,
        ev.clientX,
        ev.clientY
      );
      // this.calculteSelecteds(rowIndex, colIndex);
    }
  }

  onTableMouseMove(ev: MouseEvent, rowIndex: number, colIndex: number) {
    if (ev.button == 0) {
      if (this.lastMouseDownEvent) {
        console.log({ tpye: 'move', x: ev.clientX, y: ev.clientY });

        this.calculateSelectedTablePiece(
          this.lastMouseDownEvent.clientX,
          this.lastMouseDownEvent.clientY,
          ev.clientX,
          ev.clientY
        );
        // this.calculteSelecteds(rowIndex, colIndex);
      }
    }
  }

  onTableMouseUp(ev: MouseEvent, rowIndex: number, colIndex: number) {
    this.lastMouseDownEvent = undefined;
    this.lastRowCol = undefined;
  }

  mergeSelectedCells() {
    let selectedCells = this.element.cells.filter(item => item.isSelected);

    if (selectedCells.length > 1) {
      var selectedPieceCoordinates = Array<any>();

      var minX: number = selectedCells[0].left;
      var minY: number = selectedCells[0].top;

      var maxX: number = selectedCells[0].left;
      var maxY: number = selectedCells[0].top;

      selectedCells.forEach(piece => {
        selectedPieceCoordinates.push({ x: piece.left, y: piece.top });
        selectedPieceCoordinates.push({ x: piece.left + piece.width, y: piece.top });
        selectedPieceCoordinates.push({ x: piece.left, y: piece.top + piece.height });
        selectedPieceCoordinates.push({ x: piece.left + piece.width, y: piece.top + piece.height });

        if (piece.left < minX) minX = piece.left;

        if (piece.top < minY) minY = piece.top;
      });

      selectedPieceCoordinates.forEach(coor => {
        if (coor.x > maxX) maxX = coor.x;

        if (coor.y > maxY) maxY = coor.y;
      });

      var bottomLeftY = selectedPieceCoordinates
        .filter(item => item.x == minX)
        .map(item => item.y)
        .sort((a, b) => {
          return a - b;
        })
        .reverse()[0];
      var bottomRighX = selectedPieceCoordinates
        .filter(item => item.y == bottomLeftY)
        .map(item => item.x)
        .sort((a, b) => {
          return a - b;
        })
        .reverse()[0];
      var topRightY = selectedPieceCoordinates
        .filter(item => item.x == bottomRighX)
        .map(item => item.y)
        .sort((a, b) => {
          return a - b;
        })[0];

      if (
        maxX == bottomRighX &&
        maxY == bottomLeftY &&
        minY - bottomLeftY == topRightY - bottomLeftY &&
        minX - bottomRighX == minX - bottomRighX
      ) {
        let sortByTop = _.sortBy(selectedCells, item => item.top);

        let sortByLeft = _.sortBy(sortByTop, item => item.left);

        let firstCell = sortByLeft[0];

        let cellsInFirstCellRow = selectedCells
          .filter(item => item.rowIndex == firstCell.rowIndex)
          .map(item => item.width);
        let cellsInFirstCellCol = selectedCells
          .filter(item => item.colIndex == firstCell.colIndex)
          .map(item => item.height);

        let totalWidth = _.reduce(cellsInFirstCellRow, (a: any, b: any) => a + b);
        let totalHeight = _.reduce(cellsInFirstCellCol, (a: any, b: any) => a + b);

        this.element.cells = this.element.cells.filter(item => {
          let founded = selectedCells.find(cell => cell.rowIndex == item.rowIndex && cell.colIndex == item.colIndex);

          return founded == undefined;
        });

        let newCell = new TableCellModel();
        newCell.isSelected = false;
        newCell.rowIndex = firstCell.rowIndex;
        newCell.colIndex = firstCell.colIndex;
        newCell.width = totalWidth;
        newCell.height = totalHeight;
        newCell.left = firstCell.left;
        newCell.top = firstCell.top;
        newCell.isHeader = firstCell.isHeader;
        newCell.isMerged = true;
        newCell.isDragOver = false;
        newCell.id = firstCell.id;
        newCell.fontColor = firstCell.fontColor;
        newCell.fontSize = firstCell.fontSize;
        newCell.bgColor = firstCell.bgColor;
        newCell.headerData = firstCell.headerData;
        newCell.value = firstCell.value;

        this.element.cells.push(newCell);

        this.element.cells = this.element.cells;
      }
    }
  }

  // calculteSelecteds(rowIndex: number, colIndex: number) {
  //   // this.calculateSelectedTablePiece(this.lastMouseDownEvent.clientX, this.lastMouseDownEvent.clientY, ev.clientX, ev.clientY);
  //   let i = this.lastRowCol.rowIndex;
  //   let j = this.lastRowCol.colIndex;

  //   if (rowIndex < i) i = rowIndex;

  //   if (colIndex < j) j = colIndex;

  //   let h = i + Math.abs(this.lastRowCol.rowIndex - rowIndex);
  //   let w = j + Math.abs(this.lastRowCol.colIndex - colIndex);

  //   console.log({ i, j, w, h });

  //   this.element.cells.forEach(col => {
  //     col.isSelected = false;
  //   });

  //   for (let rIndex = i; rIndex <= h; rIndex++) {
  //     for (let cIndex = j; cIndex <= w; cIndex++) {
  //       console.log({ rIndex, colIndex });

  //       let item = this.element.cells.find(colItem => colItem.rowIndex == rIndex && colItem.colIndex == cIndex);

  //       if (item) item.isSelected = true;
  //     }
  //   }
  // }

  calculateSelectedTablePiece(startX: number, startY: number, endX: number, endY: number) {
    console.log({ startX, startY, endX, endY });

    let mouseEvCorners = Array<any>();
    mouseEvCorners.push({ x: startX, y: startY });
    mouseEvCorners.push({ x: endX, y: startY });
    mouseEvCorners.push({ x: startX, y: endY });
    mouseEvCorners.push({ x: endX, y: endY });

    this.element.cells.forEach(piece => {
      let selected: boolean = false;

      let pos = document.getElementById('cell-' + piece.id).getBoundingClientRect() as any;

      let pieceCorners = Array<any>();

      pieceCorners.push({ x: pos.x, y: pos.y });
      pieceCorners.push({ x: pos.x + pos.width, y: pos.y });
      pieceCorners.push({ x: pos.x + pos.width, y: pos.y + pos.height });
      pieceCorners.push({ x: pos.x, y: pos.y + pos.height });

      let pieceBottomLeft = pieceCorners[3];
      let pieceTopRight = pieceCorners[1];

      //table cell içinde kalan mouse koordinatlarına bakar
      mouseEvCorners.forEach(corner => {
        let inRecCorner = this.isDotInRectangle(
          pieceBottomLeft.x,
          pieceBottomLeft.y,
          pieceTopRight.x,
          pieceTopRight.y,
          corner.x,
          corner.y
        );

        if (inRecCorner) selected = true;
      });

      let mouseBottomLeft = { x: startX, y: endY };
      let mouseTopRight = { x: endX, y: startY };

      if (startX > endX) {
        mouseBottomLeft.x = endX;
        mouseTopRight.x = startX;
      }

      if (startY > endY) {
        mouseBottomLeft.y = startY;
        mouseTopRight.y = endY;
      }
      //
      pieceCorners.forEach(corner => {
        let inRecCorner = this.isDotInRectangle(
          mouseBottomLeft.x,
          mouseBottomLeft.y,
          mouseTopRight.x,
          mouseTopRight.y,
          corner.x,
          corner.y
        );

        if (inRecCorner) selected = true;
      });

      //
      pieceCorners.forEach(corner => {
        if (
          mouseBottomLeft.x >= pieceBottomLeft.x &&
          mouseTopRight.x <= pieceTopRight.x &&
          mouseTopRight.y <= pieceTopRight.y &&
          mouseBottomLeft.y >= pieceBottomLeft.y
        ) {
          selected = true;
        }

        if (
          mouseBottomLeft.x <= pieceBottomLeft.x &&
          mouseTopRight.x >= pieceTopRight.x &&
          mouseTopRight.y >= pieceTopRight.y &&
          mouseBottomLeft.y <= pieceBottomLeft.y
        ) {
          selected = true;
        }
      });

      piece.isSelected = selected;
    });

    this.element.selectedCells = this.element.cells.filter(item => item.isSelected);
  }

  isDotInRectangle(recX1: number, recY1: number, recX2: number, recY2: number, dotX: number, dotY: number): Boolean {
    if (dotX > recX1 && dotX < recX2 && dotY < recY1 && dotY > recY2) return true;

    return false;
  }

  onDragover(event: DragEvent, cell: TableCellModel) {
    console.log('dragover', JSON.stringify(event, null, 2) + '   ' + cell.rowIndex + ',' + cell.colIndex);
  }

  onDrop(event: DndDropEvent, cell: TableCellModel) {
    console.log('dropped', JSON.stringify(event, null, 2) + cell.rowIndex + ',' + cell.colIndex);

    this.element.cells.forEach(item => (item.isDragOver = item.id != cell.id ? false : true));
    cell.headerData = event.data;
  }

  ngAfterViewChecked() {}

  ngOnDestroy() {
    this.mergeCellSub.unsubscribe();
    this.onFormatChangeSub.unsubscribe();
  }
}
