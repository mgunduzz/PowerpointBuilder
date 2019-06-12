export enum PPtElementFormatInputTypeEnum {
  text = 1,
  number,
  list,
  checkbox
}

export class BaseFormatInputModel {
  name: string;
  inputType: PPtElementFormatInputTypeEnum;
}

export class FormatCheckboxInputModel extends BaseFormatInputModel {
  value: boolean;
}

export class BaseElementFormatModel {
  formatInputs?: BaseFormatInputModel[];
}

export class ChartFormatModel extends BaseElementFormatModel {
  constructor() {
    super();

    this.formatInputs = [];

    let title: FormatCheckboxInputModel = {
      name: 'Title',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    this.formatInputs.push(title);
  }
}
