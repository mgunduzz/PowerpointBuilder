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
  previewImage?: string;
  historyActiveIndex?: number = 0;
  pageNumber: number;

  elementList: Array<PptElementModel>;
  formatChangeHistory?: Array<SlideFormatChangeHistory>;
  format: SlideFormatModel;
  backgroundColor: string;

  import(slide: SlideModel) {
    this.historyActiveIndex = slide.historyActiveIndex;
    this.pageNumber = slide.pageNumber;
    this.format = slide.format;
    this.id = slide.id;
  }

  toJsonModel(): SlideModel {
    let newItem: any = {};

    newItem.id = this.id;
    newItem.historyActiveIndex = this.historyActiveIndex;
    newItem.pageNumber = this.pageNumber;
    newItem.format = this.format;
    newItem.elementList = [];

    this.elementList.forEach(el => {
      let jsonElModel = el.toJsonModel();

      newItem.elementList.push(jsonElModel);
    });

    return newItem;
  }
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
