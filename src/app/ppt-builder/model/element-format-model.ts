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
  listStyle = 10,
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
  shapeBorderSize,
  x,
  y,
  height,
  chartSpaceBetweenCategory,
  chartSpaceBetweenBar,
  pieCutoutPercentage,
  pieRotation,
  naturalWidth,
  naturalHeight,
  isStroke,
  strokeColor,
  textIndent,
  firstLineIndent,
  shapeBorderStyle,
  fontColor,
  textVerticalAlign,
  cellFontColor,
  cellBackgroundColor,
  cellFontSize,
  chartCategoryBgColor,
  cellBorderType,
  cellBorderSize,
  cellBorderColor,
  chartLabelsFont,
  chartlabelsFontSize,
  chartLabelsFontColor,
  smoothLine,
  chartTitleText
}

export class BaseFormatInputModel {
  name: string;
  inputId: PPtFormatInputsEnum;
  inputType: PPtElementFormatInputTypeEnum;
  note?: string;
  update?: boolean;
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

export class FormatMultiNumberInputModel extends BaseFormatInputModel {
  constructor() {
    super();
    this.numberInputs = new Array<FormatNumberInputModel>();
  }

  numberInputs: Array<FormatNumberInputModel>;
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
  smoothLine: FormatCheckboxInputModel;
  value: FormatCheckboxInputModel;
  textAlign: FormatRadioButtonInputModel;
  chartSpaceBetweenCategory: FormatNumberInputModel;
  chartSpaceBetweenBar: FormatNumberInputModel;
  pieCutoutPercentage: FormatNumberInputModel;
  pieRotation: FormatNumberInputModel;
  rotate: FormatNumberInputModel;
  lineSize: FormatNumberInputModel;
  lineStyle: FormatDropdownInputModel;
  isLineArrow: FormatCheckboxInputModel;
  arrowDirection: FormatDropdownInputModel;
  isShowText: FormatCheckboxInputModel;
  text: FormatTextInputModel;
  shapeBorder: FormatCheckboxInputModel;
  shapeBorderColor: FormatColorPickerInputModel;
  shapeBorderSize: FormatNumberInputModel;
  shapeBorderStyle: FormatDropdownInputModel;
  textFontSize: FormatNumberInputModel;
  naturalWidth: FormatNumberInputModel;
  naturalHeight: FormatNumberInputModel;
  isStroke: FormatCheckboxInputModel;
  strokeColor: FormatColorPickerInputModel;
  textIndent: FormatNumberInputModel;
  firstLineIndent: FormatNumberInputModel;
  fontColor: FormatColorPickerInputModel;
  textVerticalAlign: FormatRadioButtonInputModel;
  cellFontColor: FormatColorPickerInputModel;
  cellBackgroundColor: FormatColorPickerInputModel;
  cellFontSize: FormatNumberInputModel;
  categoryBgColor: FormatColorPickerInputModel;
  cellBorderType: FormatDropdownInputModel;
  cellBorderSize: FormatNumberInputModel;
  cellBorderColor: FormatColorPickerInputModel;
  chartLabelsFont: FormatDropdownInputModel;
  chartLabelsFontSize: FormatNumberInputModel;
  chartLabelsFontColor: FormatColorPickerInputModel;
  chartTitleText: FormatTextInputModel;
  slidePageNumber: FormatMultiNumberInputModel;
}

export class FormatRadioButtonInputModel extends BaseFormatInputModel {
  value: Array<RadioButtonInputSettings>;
  selectedItemKey: number;
}

export class BaseElementFormatModel {
  /**
   *
   */
  constructor(format?: BaseElementFormatModel) {
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

    let strokeColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.strokeColor,
      name: '',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: 'trapsparent'
    };

    let isStroke: FormatCheckboxInputModel = {
      name: 'Stroke',
      inputId: PPtFormatInputsEnum.isStroke,
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    this.formatInputs.isStroke = isStroke;
    this.formatInputs.strokeColor = strokeColor;
    this.formatInputs.x = x;
    this.formatInputs.y = y;
    this.formatInputs.width = width;
    this.formatInputs.height = height;

    if (format) {
      this.formatInputs.x = format.formatInputs.x;
      this.formatInputs.y = format.formatInputs.y;
    }
  }

  formatInputs?: FormatInputsModel;
}

export class TableFormatModel extends BaseElementFormatModel {
  constructor(format?: BaseElementFormatModel) {
    super(format);

    this.formatInputs.width.value = 900;
    this.formatInputs.height.value = 400;

    let cellFontColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.cellFontColor,
      name: 'CellFontColor',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#000000'
    };

    let cellBackgroundColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.cellBackgroundColor,
      name: 'CellBackgroundColor',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#42c3c9'
    };

    let cellFontSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.cellFontSize,
      name: 'CellFontSize',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 100,
      min: 0,
      value: 13
    };

    let borderTypes = new Array<KeyValueModel>();
    borderTypes.push({ key: 1, value: 'All' });
    borderTypes.push({ key: 2, value: 'Left' });
    borderTypes.push({ key: 3, value: 'Top' });
    borderTypes.push({ key: 4, value: 'Right' });
    borderTypes.push({ key: 5, value: 'Bottom' });

    let cellBorderType: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.cellBorderType,
      name: 'Border Type',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 1,
      value: borderTypes,
      position: 'bottom',
      autoClose: true,
      container: 'body'
    };

    let cellBorderSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.cellBorderSize,
      name: 'CellBorderSize',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 100,
      min: 0,
      value: 0
    };

    let cellBorderColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.cellBorderColor,
      name: 'CellBorderColor',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#ffffff'
    };

    this.formatInputs.cellFontColor = cellFontColor;
    this.formatInputs.cellBackgroundColor = cellBackgroundColor;
    this.formatInputs.cellFontSize = cellFontSize;
    this.formatInputs.cellBorderType = cellBorderType;
    this.formatInputs.cellBorderSize = cellBorderSize;
    this.formatInputs.cellBorderColor = cellBorderColor;
  }
}

export class SlideFormatModel extends BaseElementFormatModel {
  constructor(format?: BaseElementFormatModel) {
    super(format);

    let pageNumber = new FormatMultiNumberInputModel();

    let pageNumberX: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.x,
      name: 'X',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 50,
      min: 0,
      max: 100
    };

    let pageNumberY: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.x,
      name: 'Y',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 90,
      min: 0,
      max: 100
    };

    pageNumber.numberInputs.push(pageNumberX);
    pageNumber.numberInputs.push(pageNumberY);
    pageNumber.name = 'pageNumber';

    this.formatInputs.slidePageNumber = pageNumber;
  }
}

export class ImageFormatModel extends BaseElementFormatModel {
  constructor(format?: BaseElementFormatModel) {
    super(format);

    let naturalWidth: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.naturalWidth,
      name: 'naturalWidth',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      min: 0,
      max: 9999
    };

    let naturalHeight: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.naturalHeight,
      name: 'naturalHeight',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      min: 0,
      max: 9999
    };

    this.formatInputs.naturalWidth = naturalWidth;
    this.formatInputs.naturalHeight = naturalHeight;
  }
}

export class TextFormatModel extends BaseElementFormatModel {
  constructor(format?: BaseElementFormatModel) {
    super(format);

    let textAlignList = new Array<RadioButtonInputSettings>();

    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-left',
      isText: false,
      value: 'Sol',
      key: 1,
      selected: true,
      tooltip: 'Sola Yasla'
    });
    textAlignList.push({
      disabled: false,
      icon: 'fas fa-align-center',
      isText: false,
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
    let listStyleList = new Array<KeyValueModel>();
    listStyleList.push({ key: 1, value: 'None' });
    listStyleList.push({ key: 2, value: 'Bullets' });
    listStyleList.push({ key: 3, value: 'Numbers' });

    let listStyle: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.listStyle,
      name: 'List Style',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      value: listStyleList,
      position: 'bottom',
      autoClose: true,
      container: 'body',
      selectedItemKey: 1
    };

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
      value: '#000000'
    };

    let textIndent: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.textIndent,
      name: 'Text Indent',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      max: 32,
      min: 0
    };
    let firstLineIndent: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.firstLineIndent,
      name: 'First Line Indent',
      inputType: PPtElementFormatInputTypeEnum.number,
      value: 0,
      max: 100,
      min: 0
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
      value: 10
    };

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

    this.formatInputs.width.value = 200;

    this.formatInputs.backgroundColor = backgroundColor;
    this.formatInputs.fontSize = fontSize;
    this.formatInputs.font = font;
    this.formatInputs.color = color;
    this.formatInputs.isBold = isBold;
    this.formatInputs.isItalic = isItalic;
    this.formatInputs.radius = radius;
    this.formatInputs.textAlign = textAlign;
    this.formatInputs.textIndent = textIndent;
    this.formatInputs.firstLineIndent = firstLineIndent;
    this.formatInputs.lineStyle = listStyle;
  }
}

export class ChartFormatModel extends BaseElementFormatModel {
  constructor(format?: BaseElementFormatModel) {
    super(format);

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

    let chartTitleText: FormatTextInputModel = {
      inputId: PPtFormatInputsEnum.chartTitleText,
      name: 'TitleText',
      inputType: PPtElementFormatInputTypeEnum.text,
      value: 'Chart title'
    };

    let chartLabelsFontSize: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartlabelsFontSize,
      name: 'LabelFontSize',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 100,
      min: 0,
      value: 11
    };

    let value: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.value,
      name: 'Value',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let categoryBgColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.chartCategoryBgColor,
      name: '',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#000000'
    };

    let chartLabelsFont: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.chartLabelsFont,
      name: 'Labels Font',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      value: fontList,
      position: 'bottom',
      autoClose: true,
      container: 'body',
      selectedItemKey: 0
    };

    let chartLabelFontColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.chartLabelsFontColor,
      name: 'ChartLabelsFontColor',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#000000'
    };

    this.formatInputs.title = title;
    this.formatInputs.legend = legend;
    this.formatInputs.value = value;
    this.formatInputs.categoryBgColor = categoryBgColor;
    this.formatInputs.chartLabelsFont = chartLabelsFont;
    this.formatInputs.chartLabelsFontSize = chartLabelsFontSize;
    this.formatInputs.chartLabelsFontColor = chartLabelFontColor;
    this.formatInputs.chartTitleText = chartTitleText;
  }
}

export class ShapeFormatModel extends BaseElementFormatModel {
  constructor(format: BaseElementFormatModel) {
    super(format);

    let shapeType: ShapeTypeEnum;

    let shapeBorderStyleList = new Array<KeyValueModel>();
    shapeBorderStyleList.push({ key: 1, value: 'Dashed' });
    shapeBorderStyleList.push({ key: 2, value: 'Solid' });

    let shapeBorderStyle: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.shapeBorderStyle,
      name: 'Line Style',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 1,
      value: shapeBorderStyleList,
      position: 'bottom',
      autoClose: true,
      container: 'body'
    };

    let lineStyleList = new Array<KeyValueModel>();
    lineStyleList.push({ key: 2, value: 'Solid' });
    lineStyleList.push({ key: 1, value: 'Dashed' });

    let lineStyle: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.lineStyle,
      name: 'Line Style',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 2,
      value: lineStyleList,
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
      value: '#000000'
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
      max: 17,
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
    let textVerticalAlignList = new Array<RadioButtonInputSettings>();

    textVerticalAlignList.push({
      disabled: false,
      icon: 'fas fa-align-left',
      isText: true,
      value: 'Yukarıda',
      key: 1,
      selected: true,
      tooltip: 'Sola Yasla'
    });
    textVerticalAlignList.push({
      disabled: false,
      icon: 'fas fa-align-center',
      isText: true,
      value: 'Ortada',
      key: 2,
      selected: false,
      tooltip: 'Ortala'
    });
    textVerticalAlignList.push({
      disabled: false,
      icon: 'fas fa-align-right',
      isText: true,
      value: 'Aşağıda',
      key: 3,
      selected: false,
      tooltip: 'Sağa Yasla'
    });

    let textVerticalAlign: FormatRadioButtonInputModel = {
      inputId: PPtFormatInputsEnum.textVerticalAlign,
      name: 'textVerticalAlign',
      inputType: PPtElementFormatInputTypeEnum.radio,
      selectedItemKey: 1,
      value: textVerticalAlignList
    };
    let isShowText: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.isShowText,
      name: 'isShowText',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    let color: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.color,
      name: 'Color',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#000000'
    };

    let fontColor: FormatColorPickerInputModel = {
      inputId: PPtFormatInputsEnum.fontColor,
      name: 'FontColor',
      inputType: PPtElementFormatInputTypeEnum.colorPicker,
      value: '#000000'
    };

    let arrowDirectionList = new Array<KeyValueModel>();
    arrowDirectionList.push({ key: 1, value: 'Sol' });
    arrowDirectionList.push({ key: 2, value: 'Sağ' });
    arrowDirectionList.push({ key: 3, value: 'Sol-Sağ' });
    arrowDirectionList.push({ key: 4, value: 'Yok' });

    let arrowDirection: FormatDropdownInputModel = {
      inputId: PPtFormatInputsEnum.arrowDirection,
      name: 'Arrow Direction',
      inputType: PPtElementFormatInputTypeEnum.dropdown,
      selectedItemKey: 3,
      value: arrowDirectionList,
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
      value: 4,
      min: 0,
      max: 20
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
    this.formatInputs.fontColor = fontColor;
    this.formatInputs.textVerticalAlign = textVerticalAlign;
  }
}

export class ColumnChartFormatModel extends ChartFormatModel {
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
      value: 0.3,
      step: 0.1
    };

    let chartOverlap: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartSpaceBetweenBar,
      name: 'SpaceBetweenBar',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 1,
      min: 0,
      value: 0.3,
      step: 0.1
    };

    this.formatInputs.chartSpaceBetweenCategory = chartGapWidth;
    this.formatInputs.chartSpaceBetweenBar = chartOverlap;
  }
}

export class BarChartFormatModel extends ChartFormatModel {
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
      value: 0.3,
      step: 0.1
    };

    let chartOverlap: FormatNumberInputModel = {
      inputId: PPtFormatInputsEnum.chartSpaceBetweenBar,
      name: 'SpaceBetweenBar',
      inputType: PPtElementFormatInputTypeEnum.number,
      max: 1,
      min: 0,
      value: 0.3,
      step: 0.1
    };

    this.formatInputs.chartSpaceBetweenCategory = chartGapWidth;
    this.formatInputs.chartSpaceBetweenBar = chartOverlap;
  }
}

export class LineChartFormatModel extends ChartFormatModel {
  /**
   *
   */
  constructor() {
    super();

    let smoothLine: FormatCheckboxInputModel = {
      inputId: PPtFormatInputsEnum.smoothLine,
      name: 'SmoothLine',
      inputType: PPtElementFormatInputTypeEnum.checkbox,
      value: false
    };

    this.formatInputs.smoothLine = smoothLine;
  }
}

export class PieChartFormatModel extends ChartFormatModel {
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

export class DoughnutChartFormatModel extends ChartFormatModel {
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

let fontList = new Array<KeyValueModel>();
fontList.push({ key: 1, value: 'Helvetica' });
fontList.push({ key: 2, value: 'Times New Roman' });
fontList.push({ key: 3, value: 'Times' });
fontList.push({ key: 4, value: 'Courier New' });
fontList.push({ key: 5, value: 'Courier' });
fontList.push({ key: 6, value: 'Verdana' });
fontList.push({ key: 7, value: 'Georgia' });
fontList.push({ key: 8, value: 'Palatino' });
fontList.push({ key: 9, value: 'Garamond' });
fontList.push({ key: 10, value: 'Bookman' });
fontList.push({ key: 11, value: 'Comic Sans MS' });
fontList.push({ key: 12, value: 'Trebuchet MS' });
fontList.push({ key: 13, value: 'Arial Black' });
fontList.push({ key: 14, value: 'Arial' });
fontList.push({ key: 15, value: 'Impact' });
fontList.push({ key: 16, value: 'Tahoma' });
fontList.push({ key: 17, value: 'Geneva' });
fontList.push({ key: 18, value: 'Lucida Console' });
fontList.push({ key: 19, value: 'Webdings' });
fontList.push({ key: 20, value: 'Century Gothic' });
// FA: Daha sonra bakılacak
// export class ListKeyValueModel {
//   key: number;
//   value: string;
// }

// export enum PptTextListNumberTypeEnum{
//   decimal,
//   decimalLeadingZero,
//   lowerLatin,
//   lowerRoman,
//   upperLatin,

// }

// export enum PptTextListBulletTypeEnum{
//   unset=1,
//   disc,
//   squere,
//   circle,
// }
