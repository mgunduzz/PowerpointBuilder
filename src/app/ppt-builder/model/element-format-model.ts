export class KeyValueModel {
  key: number;
  value: string;
}

export enum PPtElementFormatInputTypeEnum {
  text = 1,
  number,
  list,
  checkbox,
  colorPicker,
  dropdown
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
  value,
  radius,
  width
}

export class BaseFormatInputModel {
  name: string;
  inputId: PPtFormatInputsEnum;
  inputType: PPtElementFormatInputTypeEnum;
}

export class FormatCheckboxInputModel extends BaseFormatInputModel {
  value: boolean;
}

export class FormatColorPickerInputModel extends BaseFormatInputModel {
  value: string;
}

export class FormatTextInputModel extends BaseFormatInputModel {
  value: string;
}

export class FormatNumberInputModel extends BaseFormatInputModel {
  value: number;
  min: number;
  max: number;
}

export class FormatDropdownInputModel extends BaseFormatInputModel {
  value: Array<KeyValueModel>;
  position: string;
  autoClose: boolean;
  container: string;
  selectedItemKey: number;
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

export class ImageFormatModel extends BaseElementFormatModel {
  constructor() {
    super();

    this.formatInputs = {};
  }
}

export class TextFormatModel extends BaseElementFormatModel {
  constructor() {
    super();

    let radius: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.radius,
      name: 'Radius',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      max: 100,
      min: 0
    };

    let width: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.width,
      name: 'Genişlik',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      min: 0,
      max: 2048
    };

    let backgroundColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.backgroundColor,
      name: 'Background Color',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#FFFFFF'
    };

    let color: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.color,
      name: 'Color',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
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
    fontList.push({ key: 1, value: 'Tahoma' });
    fontList.push({ key: 2, value: 'Impact' });
    fontList.push({ key: 3, value: 'Arial' });

    let font: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.font,
      name: 'Font',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      value: fontList,
      position: 'bottom',
      autoClose: true,
      container: 'body',
      selectedItemKey: 0
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
    this.formatInputs.radius = radius;
    this.formatInputs.width = width;
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
