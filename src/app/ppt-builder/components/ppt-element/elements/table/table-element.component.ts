import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel
} from '@app/ppt-builder/model';

@Component({
  selector: 'ppt-table-element',
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.scss']
})
export class TableElement implements OnInit, OnDestroy {
  @Input('element') element: PptTableElementModel;
  tableBox: Array<any>;

  constructor() {
    // this.element.onFormatChange.subscribe(res => {
    //   debugger;
    // });
  }

  ngOnInit() {
    this.tableBox = Array(this.element.row)
      .fill({})
      .map(rowItem => {
        let rowCols = Array(this.element.col).fill({});

        rowItem.cols = rowCols;

        return rowItem;
      });
  }

  ngOnDestroy() {}
}
