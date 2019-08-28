import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatTextInputModel,
  FormatRadioButtonInputModel,
  RadioButtonInputSettings
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-radio-button-input',
  templateUrl: './radio-button-input.component.html',
  styleUrls: ['./radio-button-input.component.scss']
})
export class PptRadioButtonInput implements OnInit {
  @Input('input') formatInput: FormatRadioButtonInputModel;
  @Output() onValuechange: EventEmitter<any> = new EventEmitter<any>();
  selectedItem: any = '';
  generatedId = '';
  ngOnInit() {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.generatedId = random.toString();
    this.getSelectedItemName(this.formatInput.selectedItemKey);
  }

  setselectedItem(item: RadioButtonInputSettings) {
    item.selected = true;
    this.formatInput.selectedItemKey = item.key;

    this.formatInput.value.forEach(o => {
      if (o.key != item.key) o.selected = false;
    });
    this.getSelectedItemName(item.key);
    this.onValueChange();
  }

  getSelectedItemName(key: number) {
    if (key > 0) {
      let index = this.formatInput.value.findIndex(o => {
        return o.selected;
      });
      if (index > -1) {
        this.selectedItem = this.formatInput.value[index].value;
      }
    }
  }

  onValueChange() {
    this.onValuechange.emit(this.formatInput);
  }
}
