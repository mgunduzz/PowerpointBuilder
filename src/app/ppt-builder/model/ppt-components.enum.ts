import { BaseElementFormatModel } from '.';

export enum PPtElementEnum {
  Table = 1,
  Chart
}

export class PptElementModel {
  constructor() {
    this.format = new BaseElementFormatModel();
  }

  type: PPtElementEnum;
  name: string;
  x?: string;
  y?: string;
  format: BaseElementFormatModel;
}
