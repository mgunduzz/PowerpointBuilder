import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatTextInputModel,
  FormatNumberInputModel,
  FormatMultiNumberInputModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';
import { PptNumberInput } from '../numberInput/number-input.component';

@Component({
  selector: 'ppt-multi-number-input',
  templateUrl: './multi-number-input.component.html',
  styleUrls: ['./multi-number-input.component.scss']
})
export class PptMultiNumberInput implements OnInit {
  @Input('input') formatInput: FormatMultiNumberInputModel;
  @Output() onValuechange: EventEmitter<any> = new EventEmitter<any>();

  generatedId = '';

  ngOnInit() {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.generatedId = random.toString();
  }

  onNumberInputValueChange(ev: any, inp: PptNumberInput) {
    this.onValuechange.emit(this.formatInput);
  }

  // onValueChange(ev: any) {
  //   this.formatInput.value = ev;
  //   this.onValuechange.emit(this.formatInput);
  // }
}
