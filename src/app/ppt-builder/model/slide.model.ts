import { PptElementModel, BaseElementFormatModel, SlideFormatModel } from '.';

export class SlideModel extends PptElementModel {
  /**
   *
   */
  constructor() {
    super();

    this.elementList = new Array<PptElementModel>();
    this.formatChangeHistory = new Array<SlideFormatChangeHistory>();
    this.format = new SlideFormatModel();
  }

  id: number = -1;
  elementList: Array<PptElementModel>;
  previewImage?: string;
  formatChangeHistory?: Array<SlideFormatChangeHistory>;
  historyActiveIndex?: number = 0;
  format: SlideFormatModel;
  pageNumber: number;
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
