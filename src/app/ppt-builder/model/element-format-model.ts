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
  x,
  y,
  height,
  textAlign,
  chartSpaceBetweenCategory,
  chartSpaceBetweenBar,
  pieCutoutPercentage,
  pieRotation
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
  step?: number = 1;
}

export class FormatDropdownInputModel extends BaseFormatInputModel {
  value: Array<KeyValueModel>;
  position: string;
  autoClose: boolean;
  container: string;
  selectedItemKey: number;
}

export class FormatInputsModel {
  x: FormatNumberInputModel;
  y: FormatNumberInputModel;
  width: FormatNumberInputModel;
  height: FormatNumberInputModel;
  backgroundColor: FormatColorPickerInputModel;
  fontSize: FormatNumberInputModel;
  font: FormatDropdownInputModel;
  color: FormatColorPickerInputModel;
  isBold: FormatCheckboxInputModel;
  isItalic: FormatCheckboxInputModel;
  radius: FormatNumberInputModel;
  title: FormatCheckboxInputModel;
  legend: FormatCheckboxInputModel;
  value: FormatCheckboxInputModel;
  textAlign: FormatRadioButtonInputModel;
  chartSpaceBetweenCategory: FormatNumberInputModel;
  chartSpaceBetweenBar: FormatNumberInputModel;
  pieCutoutPercentage: FormatNumberInputModel;
  pieRotation: FormatNumberInputModel;
}

export class FormatRadioButtonInputModel extends BaseFormatInputModel {
  value: Array<RadioButtonInputSettings>;
  selectedItemKey: number;
}

export class BaseElementFormatModel {
  /**
   *
   */
  constructor() {
    this.formatInputs = new FormatInputsModel();

    let x: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.x,
      name: 'X',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      max: 9999,
      min: 0
    };

    let y: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.y,
      name: 'Y',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      max: 9999,
      min: 0
    };

    let width: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.width,
      name: 'Width',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 400,
      max: 9999,
      min: 0
    };

    let height: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.height,
      name: 'Height',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 200,
      max: 9999,
      min: 0
    };

    this.formatInputs.x = x;
    this.formatInputs.y = y;
    this.formatInputs.width = width;
    this.formatInputs.height = height;
  }

  formatInputs?: FormatInputsModel;
}

export class TableFormatModel extends BaseElementFormatModel {
  constructor() {
    super();
  }
}

export class ImageFormatModel extends BaseElementFormatModel {
  constructor() {
    super();
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

export class ColumnChartFormatModel extends BaseElementFormatModel {
  /**
   *
   */
  constructor() {
    super();

    let chartGapWidth: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartSpaceBetweenCategory,
      name: 'SpaceBetweenCategory',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 1,
      min: 0,
      value: 1,
      step: 0.1
    };

    let chartOverlap: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartSpaceBetweenBar,
      name: 'SpaceBetweenBar',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 1,
      min: 0,
      value: 1,
      step: 0.1
    };

    this.formatInputs.chartSpaceBetweenCategory = chartGapWidth;
    this.formatInputs.chartSpaceBetweenBar = chartOverlap;
  }
}

export class BarChartFormatModel extends BaseElementFormatModel {
  /**
   *
   */
  constructor() {
    super();

    let chartGapWidth: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartSpaceBetweenCategory,
      name: 'SpaceBetweenCategory',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 1,
      min: 0,
      value: 1,
      step: 0.1
    };

    let chartOverlap: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartSpaceBetweenBar,
      name: 'SpaceBetweenBar',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 1,
      min: 0,
      value: 1,
      step: 0.1
    };

    this.formatInputs.chartSpaceBetweenCategory = chartGapWidth;
    this.formatInputs.chartSpaceBetweenBar = chartOverlap;
  }
}

export class PieChartFormatModel extends BaseElementFormatModel {
  /**
   *
   */
  constructor() {
    super();

    let pieCutoutPercentage: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.pieCutoutPercentage,
      name: 'CutoutPercentage',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 405,
      min: 0,
      value: 0
    };

    let pieRotation: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.pieRotation,
      name: 'Rotation',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 60,
      min: 0,
      value: 0,
      step: 0.1
    };

    this.formatInputs.pieRotation = pieRotation;
  }
}

export class DoughnutChartFormatModel extends BaseElementFormatModel {
  /**
   *
   */
  constructor() {
    super();

    let pieRotation: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.pieRotation,
      name: 'Angle of first slice',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 60,
      min: 0,
      value: 0,
      step: 0.1
    };

    let pieCutoutPercentage: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.pieCutoutPercentage,
      name: 'Doughnut hole size',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 90,
      min: 10,
      value: 50
    };

    this.formatInputs.pieRotation = pieRotation;
    this.formatInputs.pieCutoutPercentage = pieCutoutPercentage;
  }
}
