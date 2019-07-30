import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatChangeModel,
  FormatInputsModel,
  PptTableElementModel,
  PptDefaultChartElementModel,
  PptDefaultChartDataSetModel,
  FormatColorPickerInputModel,
  PPtFormatInputsEnum,
  PPtElementFormatInputTypeEnum,
  TableCellModel,
  FormatNumberInputModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-format',
  templateUrl: './ppt-format.component.html',
  styleUrls: ['./ppt-format.component.scss']
})
export class PptFormatCompontent implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  footerMessageChecked: boolean = false;
  footerDateChecked: boolean = false;
  chartTitleChecked: boolean = false;
  model: {} = {};
  activeElSubscription: Subscription;

  constructor(private pPtBuilderService: PPtBuilderService) {
    this.activeElSubscription = this.pPtBuilderService.activeElementSubscription.subscribe(el => {
      if (el) {
        this.pPtBuilderService.setSlidePreview();

        this.element = el;
        let _this = this;

        let inputs = Array<BaseFormatInputModel>();

        Object.keys(el.format.formatInputs).forEach(function(key) {
          let input = el.format.formatInputs[key];
          if (input) {
            inputs.push(input);
          }
        });

        this.onInputsValuechange(inputs);
      }
    });
  }

  ngOnInit() {}

  onInputValuechange(formatInput: BaseFormatInputModel, isInit: boolean = false) {
    let changeModel = new FormatChangeModel();
    changeModel.formatInput = formatInput;
    changeModel.updateComponent = true;
    changeModel.addToHistory = !isInit;

    this.element.onFormatChange.next([changeModel]);
    // console.log('inputChange ' + changeModel.formatInput.name);

    if (!isInit) this.pPtBuilderService.setSlidePreview();
  }

  onInputsValuechange(formatInputs: Array<BaseFormatInputModel>, isInit: boolean = false) {
    let formatChanges = Array<FormatChangeModel>();

    formatInputs.forEach(formatInput => {
      let changeModel = new FormatChangeModel();
      changeModel.formatInput = formatInput;
      changeModel.updateComponent = true;
      changeModel.addToHistory = !isInit;

      // console.log('inputChange ' + changeModel.formatInput.name);
      formatChanges.push(changeModel);

      if (!isInit) this.pPtBuilderService.setSlidePreview();
    });

    this.element.onFormatChange.next(formatChanges);
  }

  checkFormatType(formatType: string) {
    return this.element.format.constructor.name == formatType;
  }

  isDefaultChart() {
    return this.element instanceof PptDefaultChartElementModel;
  }

  onCategoryBgColorChanged(ev: FormatColorPickerInputModel, cat: PptDefaultChartDataSetModel) {
    if (ev.value != cat.backgroundColor) {
      cat.backgroundColor = ev.value;
      this.element.onDataChange.next();
    }
  }

  onMergeTableCells() {
    (this.element as PptTableElementModel).onMergeCells.next();
  }

  onAddTableRow() {
    let tableEl = this.element as PptTableElementModel;
    let latestCell = tableEl.cells[tableEl.cells.length - 1];

    let cellX = 0;

    for (let i = 0; i < tableEl.col; i++) {
      let newCell = this.pPtBuilderService.createDefaultTableCell(
        latestCell.rowIndex + 1,
        i,
        tableEl,
        cellX,
        latestCell.top + latestCell.height
      );

      cellX += newCell.width;

      tableEl.cells.push(newCell);
    }

    tableEl.row += 1;
    tableEl.format.formatInputs.height.value += tableEl.defaultCellHeight;

    let input = JSON.parse(JSON.stringify(tableEl.format.formatInputs.height)) as FormatNumberInputModel;
    input.update = false;

    tableEl.onFormatChange.next([{ formatInput: input }]);
  }

  onAddTableColumn() {
    let tableEl = this.element as PptTableElementModel;
    let latestCell = tableEl.cells[tableEl.cells.length - 1];
    let currentWidth = tableEl.format.formatInputs.width.value;

    let cellY = 0;

    for (let i = 0; i < tableEl.row; i++) {
      let newCell = this.pPtBuilderService.createDefaultTableCell(
        i,
        latestCell.colIndex + 1,
        tableEl,
        latestCell.left + latestCell.width,
        cellY
      );

      cellY += newCell.height;

      tableEl.cells.push(newCell);
    }

    tableEl.col += 1;
    tableEl.format.formatInputs.width.value += tableEl.defaultCellWidth;

    let input = JSON.parse(JSON.stringify(tableEl.format.formatInputs.width)) as FormatNumberInputModel;
    input.update = false;

    tableEl.onFormatChange.next([{ formatInput: input }]);

    input.value = currentWidth;
    input.update = true;

    this.element.onFormatChange.next([{ formatInput: input }]);

    this.element.format.formatInputs.width.value = currentWidth;
  }

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
  }
}
