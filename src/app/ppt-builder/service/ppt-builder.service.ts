import { Injectable } from '@angular/core';
import { PptElementModel, PPtElementEnum } from '../model/ppt-components.enum';
import { ChartFormatModel } from '../model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PPtBuilderService {
  constructor() {
    this.pptElements.push({
      name: 'Chart',
      type: PPtElementEnum.Chart,
      format: new ChartFormatModel()
    });
  }

  public pptElements: PptElementModel[] = [];
  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);
}
