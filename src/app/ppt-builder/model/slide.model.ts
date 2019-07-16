import { PptElementModel } from '.';

export class SlideModel {
  /**
   *
   */
  constructor() {
    this.elementList = new Array<PptElementModel>();
    this.formatChangeHistory = new Array<SlideFormatChangeHistory>();
  }

  id: number = -1;
  elementList: Array<PptElementModel>;
  isActive?: boolean;
  previewImage?: string;
  formatChangeHistory?: Array<SlideFormatChangeHistory>;
  historyActiveIndex?: number = 0;
}

export class SlideFormatChangeHistory {
  /**
   *
   */
  constructor() {
    this.inputs = new Array<FormatChangeInputModel>();
  }

  elementId: number;
  inputs: Array<FormatChangeInputModel>;
}

export class FormatChangeInputModel {
  inputId: number;
  value: any;
}
