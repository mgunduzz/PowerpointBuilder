import { ShapeTypeEnum, ShapeFormatModel, PptBaseElementModel } from '..';

export class PptShapeElementModel extends PptBaseElementModel {
  textVerticalAlign: string;
  shapeType: ShapeTypeEnum;
  rotate: number;
  radius: number;
  lineSize: number;
  lineStyle: string;
  isLineArrow: boolean;
  arrowDirection: number; //2sağ 1sol 3 sağsol 0 yok
  color: string;
  isShowText: boolean;
  textAlign: string;
  textFontSize: number;
  text: string;
  shapeBorder: string;
  shapeBorderColor: string;
  shapeBorderSize: number;
  shapeBorderStyle: string;
  isDashed: boolean;
  arrowSize: number;
  lineWidth: number;
  fontColor: string;
  isShapeBorder: boolean;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxShapeItem: any = {};
    pptxShapeItem.Options = this.options;

    let shapeFormat = (this.format as ShapeFormatModel).formatInputs;
    pptxShapeItem.Options.line = shapeFormat.color.value.replace('#', '');

    let selectedLineStyleId = shapeFormat.lineStyle.selectedItemKey;
    let selectedlineStyle = shapeFormat.lineStyle.value.find(o => o.key == selectedLineStyleId);

    if (selectedlineStyle.value == 'Dashed') {
      pptxShapeItem.Options.lineDash = 'sysDash';
    }

    pptxShapeItem.Options.lineSize = shapeFormat.lineSize.value;
    pptxShapeItem.Options.rotate = shapeFormat.rotate.value;

    if (this.shapeType == ShapeTypeEnum.line) {
      pptxShapeItem.Options;
      slide.addShape(pptx.shapes.LINE, pptxShapeItem.Options);
    } else if (this.shapeType == ShapeTypeEnum.square) {
      slide.addShape(pptx.shapes.RECTANGLE, pptxShapeItem.Options);
    }

    let selectedArrowDirection = shapeFormat.arrowDirection.value.find(
      o => o.key == shapeFormat.arrowDirection.selectedItemKey
    );

    switch (selectedArrowDirection.key) {
      case 1:
        pptxShapeItem.Options.lineHead = 'arrow';
        break;
      case 2:
        pptxShapeItem.Options.lineTail = 'arrow';
        break;
      case 3:
        pptxShapeItem.Options.lineHead = 'arrow';
        pptxShapeItem.Options.lineTail = 'arrow';
        break;
      case 4:
        pptxShapeItem.Options.lineHead = 'none';
        pptxShapeItem.Options.lineTail = 'none';
        break;
    }
  }
}
