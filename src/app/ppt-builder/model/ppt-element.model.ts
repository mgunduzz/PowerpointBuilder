import { BaseElementFormatModel } from '.';
import { EventEmitter } from 'events';
import { BaseFormatInputModel } from './element-format-model';
import { Subject } from 'rxjs';

export enum PPtElementEnum {
  Table = 1,
  Chart = 2,
  Text = 3
}

export enum ChartTypeEnum {
  ClusteredColumn = 1,
  StackedColumn
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

export class PptChartElementModel extends PptElementModel {
  chartType: ChartTypeEnum;
}

export class PptTableElementModel extends PptElementModel {
  row: number;
  col: number;
  isActive?: boolean = false;
}

export class PptTextElementModel extends PptElementModel {
  text: string;
  backgroundColor: string;
  fontSize: string;
  font: string;
  fontWeigth: number;
  fontStyle: string;
  color: string;
}

export class LoadElementModel {
  isClear?: boolean;
  elementList: PptElementModel[];
  dontAddToSlide?: boolean = false;
}
