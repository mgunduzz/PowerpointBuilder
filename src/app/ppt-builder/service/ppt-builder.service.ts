import { Injectable } from '@angular/core';
import { PptElementModel, PPtElementEnum } from '../model/ppt-components.enum';
import { ChartFormatModel, BaseFormatInputModel } from '../model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class PPtBuilderService {
  constructor() {
    this.pptElements.push({
      name: 'Chart',
      type: PPtElementEnum.Chart,
      format: new ChartFormatModel(),
      onFormatChange: new Subject<BaseFormatInputModel>()
    });
  }

  public pptElements: PptElementModel[] = [];
  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);
}
