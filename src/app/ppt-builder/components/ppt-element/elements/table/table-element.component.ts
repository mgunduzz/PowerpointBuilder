import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewChecked
} from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel
} from '@app/ppt-builder/model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ppt-table-element',
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.scss']
})
export class TableElement implements OnInit, OnDestroy, AfterViewChecked {
  @Input('element') element: PptTableElementModel;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChildren('tableElement') TableElements: QueryList<ElementRef>;

  tableBox: Array<any>;

  constructor(private sanitizer: DomSanitizer) {
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

  ngAfterViewChecked() {}

  ngOnDestroy() {}
}
