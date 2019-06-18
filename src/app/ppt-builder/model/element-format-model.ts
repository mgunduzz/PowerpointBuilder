export class KeyValueModel {
  key: number;
  value: string;
}

export enum PPtElementFormatInputTypeEnum {
  text = 1,
  number,
  list,
  checkbox
}

export enum PPtFormatInputsEnum {
  title = 1,
  legend = 2,
  backgroundColor = 3,
  fontSize = 4,
  font = 5,
  list = 6,
  isBold = 7,
  isItalic = 8,
  color = 9,
  fontList = 10,
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

export class FormatTextInputModel extends BaseFormatInputModel {
  value: string;
}

export class FormatNumberInputModel extends BaseFormatInputModel {
  value: number;
  min: number;
  max: number;
}

export class FormatListInputModel extends BaseFormatInputModel {
  value: Array<KeyValueModel>;
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

    let backgroundColor: FormatTextInputModel = {
      inputId: PPtFormatInputsEnum.backgroundColor,
      name: 'Background Color',
      inputType: PPtElementFormatInputTypeEnum.text,
      value: '#FFFFFF'
    };

    let color: FormatTextInputModel = {
      inputId: PPtFormatInputsEnum.color,
      name: 'Color',
      inputType: PPtElementFormatInputTypeEnum.text,
      value: 'black'
    };

    let isBold: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.isBold,
      name: 'Bold',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let fontSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.fontSize,
      name: 'Font Size',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 100,
      min: 0,
      value: 12
    };

    let fontList = new Array<KeyValueModel>();
    fontList.push({ key: 1, value: 'test' });
    fontList.push({ key: 2, value: 'test2' });
    fontList.push({ key: 3, value: 'test3' });

    let font: FormatListInputModel = {
      inputId: PPtFormatInputsEnum.fontList,
      name: 'Font',
      inputType: PPtElementFormatInputTypeEnum.list,
      value: fontList
    };

    let isItalic: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.isItalic,
      name: 'Italic',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    this.formatInputs.backgroundColor = backgroundColor;
    this.formatInputs.fontSize = fontSize;
    this.formatInputs.font = font;
    this.formatInputs.color = color;
    this.formatInputs.isBold = isBold;
    this.formatInputs.isItalic = isItalic;
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
