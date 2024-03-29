import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import { BaseFormatInputModel, FormatCheckboxInputModel, FormatTextInputModel } from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-color-picker-input',
  templateUrl: './color-picker-input.component.html',
  styleUrls: ['./color-picker-input.component.scss']
})
export class PptColorPickerInput implements OnInit {
  @Input('input') formatInput: FormatTextInputModel;
  @Output() onValuechange: EventEmitter<any> = new EventEmitter<any>();

  generatedId = '';

  ngOnInit() {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.generatedId = random.toString();
  }

  onValueChange(ev: any) {
    this.formatInput.value = ev;
    this.onValuechange.emit(this.formatInput);
  }
}
