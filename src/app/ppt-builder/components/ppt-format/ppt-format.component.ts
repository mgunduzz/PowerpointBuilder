import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
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
      this.element = el;
    });
  }

  ngOnInit() {}

  checkBoxValueSelectedChange(formatInput: FormatCheckboxInputModel) {
    this.element.onFormatChange.next(formatInput);
  }

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
  }
}
