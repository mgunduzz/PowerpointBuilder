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
  PptTableElementModel
} from '@app/ppt-builder/model';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';

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
  tableBox: Array<any>;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer) {
    // this.element.onFormatChange.subscribe(res => {
    //
    // });
  }

  ngOnInit() {
    this.mergeCellSub = this.element.onMergeCells.subscribe(res => {
      this.mergeSelectedCells();
    });

    this.tableBox = [];
    let cellWidth = +(this.element.format.formatInputs.width.value / this.element.col).toFixed(2);
    let cellHeight = +(this.element.format.formatInputs.height.value / this.element.row).toFixed(2);
    let cellX,
      cellY = 0;

    for (let rIndex = 0; rIndex < this.element.row; rIndex++) {
      cellX = 0;

      for (let cIndex = 0; cIndex < this.element.col; cIndex++) {
        this.tableBox.push({
          isSelected: false,
          rowIndex: rIndex,
          colIndex: cIndex,
          width: cellWidth,
          height: cellHeight,
          left: cellX,
          top: cellY
        });

        cellX += cellWidth;
      }

      cellY += cellHeight;
    }

    /* 
    
    Array fill kullanıldığında bir propertyde oluşan değişiklik hepsinde oluşuyor.

    */

    // this.tableBox = new Array(this.element.row)
    //   .fill({})
    //   .map((rowItem, rIndex) => {
    //     let rowCols = new Array(this.element.col)
    //       .fill({ isSelected: false })
    //       .map((item, cIndex) => {
    //         item.rowIndex = rIndex;
    //         item.colIndex = cIndex;
    //         return item;
    //       });

    //     rowItem.cols = rowCols;
    //     rowItem.index = rIndex;

    //     return rowItem;
    //   });
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
    let selectedCells = this.tableBox.filter(item => item.isSelected);

    selectedCells.forEach(item => {
      console.log({ left: item.left, top: item.top });
    });

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

      debugger;

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

        this.tableBox = this.tableBox.filter(item => {
          let founded = selectedCells.find(cell => cell.rowIndex == item.rowIndex && cell.colIndex == item.colIndex);

          return founded == undefined;
        });

        this.tableBox.push({
          isMerged: true,
          isSelected: false,
          rowIndex: firstCell.rowIndex,
          colIndex: firstCell.colIndex,
          width: totalWidth,
          height: totalHeight,
          left: firstCell.left,
          top: firstCell.top
        });

        this.tableBox = this.tableBox;
      }
    }
  }

  calculteSelecteds(rowIndex: number, colIndex: number) {
    // this.calculateSelectedTablePiece(this.lastMouseDownEvent.clientX, this.lastMouseDownEvent.clientY, ev.clientX, ev.clientY);
    let i = this.lastRowCol.rowIndex;
    let j = this.lastRowCol.colIndex;

    if (rowIndex < i) i = rowIndex;

    if (colIndex < j) j = colIndex;

    let h = i + Math.abs(this.lastRowCol.rowIndex - rowIndex);
    let w = j + Math.abs(this.lastRowCol.colIndex - colIndex);

    console.log({ i, j, w, h });

    this.tableBox.forEach(col => {
      col.isSelected = false;
    });

    for (let rIndex = i; rIndex <= h; rIndex++) {
      for (let cIndex = j; cIndex <= w; cIndex++) {
        console.log({ rIndex, colIndex });

        let item = this.tableBox.find(colItem => colItem.rowIndex == rIndex && colItem.colIndex == cIndex);

        if (item) item.isSelected = true;
      }
    }
  }

  calculateSelectedTablePiece(startX: number, startY: number, endX: number, endY: number) {
    console.log({ startX, startY, endX, endY });

    let mouseEvCorners = Array<any>();
    mouseEvCorners.push({ x: startX, y: startY });
    mouseEvCorners.push({ x: endX, y: startY });
    mouseEvCorners.push({ x: startX, y: endY });
    mouseEvCorners.push({ x: endX, y: endY });

    this.tableBox.forEach(piece => {
      let selected: boolean = false;

      let pos = document.getElementById('cell-' + piece.rowIndex + '-' + piece.colIndex).getBoundingClientRect() as any;

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
  }

  isDotInRectangle(recX1: number, recY1: number, recX2: number, recY2: number, dotX: number, dotY: number): Boolean {
    if (dotX > recX1 && dotX < recX2 && dotY < recY1 && dotY > recY2) return true;

    return false;
  }

  ngAfterViewChecked() {}

  ngOnDestroy() {
    this.mergeCellSub.unsubscribe();
  }
}
