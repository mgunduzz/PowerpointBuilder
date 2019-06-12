export enum PPtElementEnum {
  Table = 1,
  Chart
}

export class PptElementModel {
  type: PPtElementEnum;
  name: string;
  x?: string;
  y?: string;
}
