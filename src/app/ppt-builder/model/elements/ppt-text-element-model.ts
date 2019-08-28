import { TextFormatModel, PptBaseElementModel } from '..';

export class PptTextElementModel extends PptBaseElementModel {
  text: string;
  backgroundColor: string;
  fontSize: string;
  font: string;
  fontWeigth: number;
  fontStyle: string;
  color: string;
  radius: string;
  width: string;
  textAlign: string;
  stroke: string;
  indent: string;
  firstLineIndent: string;
  listStyle: string;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);
    let pptxTextItem: any = {};
    let textFormat = this.format as TextFormatModel;
    pptxTextItem.text = this.text;
    pptxTextItem.options = this.options;
    pptxTextItem.options.color = this.color.replace('#', '');
    pptxTextItem.options.fill = this.backgroundColor.replace('#', '');
    pptxTextItem.options.fontSize = this.fontSize.replace('pt', '');
    pptxTextItem.options.rectRadius = this.radius;
    pptxTextItem.options.italic = this.fontStyle == 'italic';
    pptxTextItem.options.bold = this.fontWeigth == 600;
    pptxTextItem.options.stroke = this.stroke == 'unset !important';
    pptxTextItem.options.indent = this.indent == 'unset';
    pptxTextItem.options.firstLineIndent = this.firstLineIndent == 'unset';
    pptxTextItem.options.listStyle = this.listStyle == '';
    pptxTextItem.options.indentLevel = this.format.formatInputs.textIndent.value;
    let align = textFormat.formatInputs.textAlign.value.find(item => item.selected).key;

    switch (align) {
      case 1:
        pptxTextItem.options.align = 'left';
        break;
      case 2:
        pptxTextItem.options.align = 'center';
        break;
      case 3:
        pptxTextItem.options.align = 'right';
        break;
      default:
        break;
    }

    let selectedFont = textFormat.formatInputs.font.value.find(
      item => item.key == textFormat.formatInputs.font.selectedItemKey
    );

    if (selectedFont) {
      pptxTextItem.options.fontFace = selectedFont.value;
    }

    let selectedLineStyle = textFormat.formatInputs.lineStyle.value.find(
      item => item.key == textFormat.formatInputs.lineStyle.selectedItemKey
    );

    if (selectedLineStyle) {
      switch (selectedLineStyle.key) {
        case 1:
          pptxTextItem.options.bullet = false;
          break;
        case 2:
          pptxTextItem.options.bullet = { code: '2022' };
          break;
        case 3:
          pptxTextItem.options.bullet = { type: 'number' };
          break;
        default:
          break;
      }
    }

    slide.addText(pptxTextItem.text, pptxTextItem.options);
  }
}
