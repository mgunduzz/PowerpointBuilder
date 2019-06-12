import { Injectable } from '@angular/core';
import { PptElementModel, PPtElementEnum } from '../model/ppt-components.enum';

@Injectable()
export class PPtBuilderService {
  constructor() {}

  public pptElements: PptElementModel[] = [
    { type: PPtElementEnum.Table, name: 'Table' },
    { type: PPtElementEnum.Chart, name: 'Chart' }
  ];
}
