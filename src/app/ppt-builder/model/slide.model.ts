import { PptBaseElementModel } from './elements/ppt-base-element.model';

import { SlideFormatModel } from './element-format-model';

export class SlideModel extends PptBaseElementModel {
  /**
   *
   */
  constructor() {
    super();

    this.elementList = new Array<PptBaseElementModel>();
    this.formatChangeHistory = new Array<SlideBaseElementChangeHistory>();
    this.format = new SlideFormatModel();
  }

  id: number = -1;
  previewImage?: string;
  historyActiveIndex?: number = -1;
  pageNumber: number;

  elementList: Array<PptBaseElementModel>;
  formatChangeHistory?: Array<SlideBaseElementChangeHistory>;
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

export class SlideBaseElementChangeHistory {
  constructor() {}

  elementId: number;
}

export class ElementExistenceChangeHistory extends SlideBaseElementChangeHistory {
  constructor() {
    super();
  }

  element: PptBaseElementModel;
  isDeleted: boolean = false;
}

export class ElementFormatChangeHistory extends SlideBaseElementChangeHistory {
  constructor() {
    super();
    this.inputs = new Array<FormatChangeInputModel>();
  }

  inputs: Array<FormatChangeInputModel>;
}

export class FormatChangeInputModel {
  inputId: number;
  value: any;
}
