import { PptBaseElementModel } from '..';

export class PptImageElementModel extends PptBaseElementModel {
  url: string;

  generatePptxItem(pptx: any, slide: any) {
    super.generatePptxItem(pptx, slide);

    let pptxImageItem: any = {};
    pptxImageItem.Options = this.options;
    pptxImageItem.Options.data = this.url;

    slide.addImage(pptxImageItem.Options);
  }
}
