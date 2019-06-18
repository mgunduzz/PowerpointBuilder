import { BaseElementFormatModel } from '.';
import { EventEmitter } from 'events';
import { BaseFormatInputModel } from './element-format-model';
import { Subject } from 'rxjs';

export enum PPtElementEnum {
  Table = 1,
  Chart = 2,
  Text = 3
}

export class PptElementModel {
  constructor() {
    this.format = new BaseElementFormatModel();
    this.onFormatChange = new Subject<BaseFormatInputModel>();
  }

  type: PPtElementEnum;
  name: string;
  x?: string;
  y?: string;
  format: BaseElementFormatModel;
  onFormatChange: Subject<BaseFormatInputModel>;
  isActiveElement: boolean;
}

export class PptTableElementModel extends PptElementModel {
  row: number;
  col: number;
}

export class PptTextElementModel extends PptElementModel {
  text: string;
}

export class LoadElementModel {
  isClear?: boolean;
  elementList: PptElementModel[];
  dontAddToSlide?: boolean = false;
}
