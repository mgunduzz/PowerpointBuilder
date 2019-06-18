import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatTextInputModel,
  FormatNumberInputModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class PptNumberInput implements OnInit {
  @Input('input') formatInput: FormatNumberInputModel;
  @Output() onValuechange: EventEmitter<any> = new EventEmitter<any>();

  generatedId = '';

  ngOnInit() {
    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.generatedId = random.toString();
  }

  onValueChange() {
    this.onValuechange.emit(this.formatInput);
  }
}
