import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  BaseFormatInputModel,
  FormatCheckboxInputModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.scss']
})
export class PptCheckBoxInput implements OnInit {
  @Input('input') formatInput: FormatCheckboxInputModel;
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
