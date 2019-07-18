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
  PptDefaultChartDataModel,
  PptDefaultChartElementModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-data',
  templateUrl: './ppt-data.component.html',
  styleUrls: ['./ppt-data.component.scss']
})
export class PptDataCompontent implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  activeElSubscription: Subscription;

  constructor(private pPtBuilderService: PPtBuilderService) {
    this.activeElSubscription = this.pPtBuilderService.activeElementSubscription.subscribe(el => {
      if (el) {
        this.element = el;
      }
    });
  }

  onUpdateElementDataClick() {
    if (this.element) {
      this.pPtBuilderService.getElementData().subscribe(res => {
        let pptData = new PptDefaultChartDataModel();

        if (this.element instanceof PptDefaultChartElementModel) {
          (this.element as PptDefaultChartElementModel).setData(res);

          this.element.onDataChange.next();
        }
      });
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
  }
}
