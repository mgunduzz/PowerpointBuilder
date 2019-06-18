export enum PPtElementFormatInputTypeEnum {
  text = 1,
  number,
  list,
  checkbox
}

export enum PPtFormatInputsEnum {
  title = 1,
  legend,
  value
}

export class BaseFormatInputModel {
  name: string;
  inputId: PPtFormatInputsEnum;
  inputType: PPtElementFormatInputTypeEnum;
}

export class FormatCheckboxInputModel extends BaseFormatInputModel {
  value: boolean;
}

export class BaseElementFormatModel {
  formatInputs?: any = {};
}

export class TableFormatModel extends BaseElementFormatModel {
  constructor() {
    super();

    this.formatInputs = {};
  }
}

export class TextFormatModel extends BaseElementFormatModel {
  constructor() {
    super();
  }
}

export class ChartFormatModel extends BaseElementFormatModel {
  constructor() {
    super();

    this.formatInputs = {};

    let title: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.title,
      name: 'Title',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let legend: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.legend,
      name: 'Legend',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let value: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.value,
      name: 'Value',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    this.formatInputs.title = title;
    this.formatInputs.legend = legend;
    this.formatInputs.value = value;
  }
}
