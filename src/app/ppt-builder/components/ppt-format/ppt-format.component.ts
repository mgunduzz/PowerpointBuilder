import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatChangeModel
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

        Object.keys(el.format.formatInputs).forEach(function(key) {
          let input = el.format.formatInputs[key];
          if (input) {
            _this.onInputValuechange(input, true);
          }
        });
      }
    });
  }

  ngOnInit() {}

  onInputValuechange(formatInput: BaseFormatInputModel, isInit: boolean = false) {
    let changeModel = new FormatChangeModel();
    changeModel.formatInput = formatInput;
    changeModel.updateComponent = true;

    this.element.onFormatChange.next(changeModel);
    console.log('inputChange ' + changeModel.formatInput.name);

    if (!isInit) this.pPtBuilderService.setSlidePreview();
  }

  checkFormatType(formatType: string) {
    return this.element.format.constructor.name == formatType;
  }

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
  }
}
