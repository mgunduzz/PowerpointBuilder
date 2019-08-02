import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatTextInputModel,
  FormatDropdownInputModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss']
})
export class PptDropdownInput implements OnInit {
  @Input('input') formatInput: FormatDropdownInputModel;
  @Output() onValuechange: EventEmitter<any> = new EventEmitter<any>();

  generatedId = '';
  selectedItem: string;
  inputName: string;
  isDisableListStyle: boolean;
  ngOnInit() {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.generatedId = random.toString();
    this.getSelectedItemName();
  }

  clickItem(itemId: number) {
    this.formatInput.selectedItemKey = itemId;
    this.getSelectedItemName();
    this.onValuechange.emit(this.formatInput);
  }

  getSelectedItemName() {
    this.inputName = this.formatInput.name;
    if (this.formatInput.selectedItemKey > 0) {
      let index = this.formatInput.value.findIndex(o => {
        return o.key == this.formatInput.selectedItemKey;
      });

      if (index > -1) {
        this.selectedItem = this.formatInput.value[index].value;
      } else {
        this.selectedItem = 'Font Seçiniz';
      }
    } else {
      this.selectedItem = 'Font Seçiniz';
    }
  }
}
