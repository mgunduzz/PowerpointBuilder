export class KeyValueModel {
  key: number;
  value: string;
}

export class RadioButtonInputSettings extends KeyValueModel {
  isText: boolean;
  icon: string;
  disabled: boolean;
  selected: boolean;
  tooltip: string;
}

export enum ShapeTypeEnum {
  line,
  square
}

export enum PPtElementFormatInputTypeEnum {
  text = 1,
  number,
  list,
  checkbox,
  colorPicker,
  dropdown,
  radio
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
  width,
  textAlign,
  rotate,
  lineSize,
  lineStyle,
  isLineArrow,
  arrowDirection,
  isShowText,
  text,
  shapeBorder,
  shapeBorderColor,
  shapeBorderSize
}

export class BaseFormatInputModel {
  name: string;
  inputId: PPtFormatInputsEnum;
  inputType: PPtElementFormatInputTypeEnum;
  note?: string;
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

export class FormatRadioButtonInputModel extends BaseFormatInputModel {
  value: Array<RadioButtonInputSettings>;
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

    let textAlignList = new Array<RadioButtonInputSettings>();

    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-left',
      isText: true,
      value: 'Sol',
      key: 1,
      selected: true,
      tooltip: 'Sola Yasla'
    });
    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-center',
      isText: true,
      value: 'Orta',
      key: 2,
      selected: false,
      tooltip: 'Ortala'
    });
    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-right',
      isText: false,
      value: 'Sağ',
      key: 3,
      selected: false,
      tooltip: 'Sağa Yasla'
    });

    let textAlign: FormatRadioButtonInputModel = {
      inputId: PPtFormatInputsEnum.textAlign,
      name: 'Text Align',
      inputType: PPtElementFormatInputTypeEnum.radio,
      selectedItemKey: 1,
      value: textAlignList
    };
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
      max: 2048,
      note: '0 değeri otomatik ayarlar'
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
    this.formatInputs.textAlign = textAlign;
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

export class ShapeFormatModel extends BaseElementFormatModel {
  constructor() {
    super();

    this.formatInputs = {};

    let shapeType: ShapeTypeEnum;

    let shapeBorderStyleList = new Array<KeyValueModel>();
    shapeBorderStyleList.push({ key: 1, value: 'Dashed' });
    shapeBorderStyleList.push({ key: 2, value: 'Solid' });

    let shapeBorderStyle: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.lineStyle,
      name: 'Line Style',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 1,
      value: shapeBorderStyleList,
      position: 'bottom',
      autoClose: true,
      container: 'body'
    };

    let shapeBorderSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.shapeBorderSize,
      name: 'Font Size',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 100,
      min: 0,
      value: 2
    };

    let shapeBorderColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.shapeBorderColor,
      name: 'Shape Border Color',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: 'black'
    };

    let shapeBorder: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.shapeBorder,
      name: 'Shape Border',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let text: FormatTextInputModel = {
      inputId: PPtFormatInputsEnum.text,
      name: 'Sekil İçeriği Metin',
      inputType: PPtElementFormatInputTypeEnum.text,
      value: 'Metin Giriniz'
    };

    let textFontSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.fontSize,
      name: 'Font Size',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 100,
      min: 0,
      value: 12
    };

    let textAlignList = new Array<RadioButtonInputSettings>();

    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-left',
      isText: true,
      value: 'Sol',
      key: 1,
      selected: true,
      tooltip: 'Sola Yasla'
    });
    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-center',
      isText: true,
      value: 'Orta',
      key: 2,
      selected: false,
      tooltip: 'Ortala'
    });
    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-right',
      isText: false,
      value: 'Sağ',
      key: 3,
      selected: false,
      tooltip: 'Sağa Yasla'
    });

    let textAlign: FormatRadioButtonInputModel = {
      inputId: PPtFormatInputsEnum.textAlign,
      name: 'Text Align',
      inputType: PPtElementFormatInputTypeEnum.radio,
      selectedItemKey: 1,
      value: textAlignList
    };

    let isShowText: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.isShowText,
      name: 'isLineArrow',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let color: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.color,
      name: 'Color',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: 'black'
    };

    let arrowDirectionList = new Array<KeyValueModel>();
    arrowDirectionList.push({ key: 1, value: 'Sol' });
    arrowDirectionList.push({ key: 2, value: 'Sağ' });
    arrowDirectionList.push({ key: 3, value: 'Sol-Sağ' });

    let arrowDirection: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.arrowDirection,
      name: 'Arrow Direction',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 1,
      value: arrowDirectionList,
      position: 'bottom',
      autoClose: true,
      container: 'body'
    };

    let lineStyleList = new Array<KeyValueModel>();
    lineStyleList.push({ key: 1, value: 'Dashed' });
    lineStyleList.push({ key: 2, value: 'Solid' });

    let lineStyle: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.lineStyle,
      name: 'Line Style',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 1,
      value: lineStyleList,
      position: 'bottom',
      autoClose: true,
      container: 'body'
    };

    let isLineArrow: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.isLineArrow,
      name: 'isLineArrow',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let rotate: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.rotate,
      name: 'Rotate',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      min: 0,
      max: 359
    };

    let lineSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.lineSize,
      name: 'lineSize',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      min: 0,
      max: 100
    };

    this.formatInputs.rotate = rotate;
    this.formatInputs.lineSize = lineSize;
    this.formatInputs.lineStyle = lineStyle;
    this.formatInputs.isLineArrow = isLineArrow;
    this.formatInputs.arrowDirection = arrowDirection;
    this.formatInputs.color = color;
    this.formatInputs.isShowText = isShowText;
    this.formatInputs.textAlign = textAlign;
    this.formatInputs.textFontSize = textFontSize;
    this.formatInputs.text = text;
    this.formatInputs.shapeBorder = shapeBorder;
    this.formatInputs.shapeBorderColor = shapeBorderColor;
    this.formatInputs.shapeBorderSize = shapeBorderSize;
    this.formatInputs.shapeBorderStyle = shapeBorderStyle;
  }
}
