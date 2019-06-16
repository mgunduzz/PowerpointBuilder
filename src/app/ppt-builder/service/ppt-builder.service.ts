import { Injectable } from '@angular/core';
import { ChartFormatModel, BaseFormatInputModel, PptElementModel, PPtElementEnum, LoadElementModel } from '../model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class PPtBuilderService {
  constructor() {}

  public pptElementsSubscription: BehaviorSubject<LoadElementModel> = new BehaviorSubject<LoadElementModel>(undefined);

  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);

  setActiveElement(item: PptElementModel) {
    this.activeElementSubscription.next(item);
  }

  createChartElement(x: string, y: string): PptElementModel {
    var chartEl = new PptElementModel();
    chartEl.format = new ChartFormatModel();
    chartEl.name = 'Chart';
    chartEl.type = PPtElementEnum.Chart;
    chartEl.onFormatChange = new Subject<BaseFormatInputModel>();
    chartEl.x = x;
    chartEl.y = y;

    return chartEl;
  }
}
