import { Subject } from 'rxjs';
import { BaseElementFormatModel, BaseFormatInputModel } from '../element-format-model';
import { PptBaseChartDataModel } from './ppt-base-chart-element-model';

export enum PPtElementEnum {
  Table = 1,
  Chart = 2,
  Text = 3,
  Image = 4,
  Shape
}

interface PptxGenerator {
  generatePptxItem(pptx: any, slide: any): any;
}

interface IElement extends PptxGenerator {
  toJsonModel(): any;
}

export class PptBaseElementModel implements IElement {
  toJsonModel() {
    let jsonModel: any = { ...this };

    jsonModel.onDataChange = undefined;
    jsonModel.onFormatChange = undefined;

    return jsonModel;
  }

  generatePptxItem(pptx: any, slide: any) {
    let elX = this.format.formatInputs.x.value;
    let elY = this.format.formatInputs.y.value;
    let boardEl: any = document.getElementsByClassName('board');
    let boardW = boardEl[0].offsetWidth;
    let boardY = boardEl[0].offsetHeight;

    elX = elX < 0 ? 0 : elX;
    elY = elY < 0 ? 0 : elY;

    let xRate = ((elX * 100) / boardW / 10).toFixed(2);
    let yRate = ((elY * 100) / boardY / 20).toFixed(2);

    let elW = this.format.formatInputs.width.value;
    let elH = this.format.formatInputs.height.value;
    elW = elW < 0 ? 0 : elW;
    elH = elH < 0 ? 0 : elH;

    let wRate = ((elW * 100) / boardW / 10).toFixed(2);
    let hRate = ((elH * 100) / boardY / 20).toFixed(2);

    this.options = { x: xRate, y: yRate, w: wRate, h: hRate };
    return;
  }

  constructor(el?: PptBaseElementModel) {
    this.format = new BaseElementFormatModel();
    this.onFormatChange = new Subject<Array<FormatChangeModel>>();
    this.onDataChange = new Subject<PptBaseChartDataModel>();

    if (el) {
      this.format = el.format;
    }
  }

  type: PPtElementEnum;
  name: string;
  format: BaseElementFormatModel;
  onDataChange: Subject<PptBaseChartDataModel>;
  onFormatChange: Subject<Array<FormatChangeModel>>;
  isActiveElement: boolean;
  id: number;
  isActive: boolean;
  z: number = 0;
  options?: any;
  stroke: string;
  tempZ: number = 0;
  isHovered?: boolean = false;
  isCreatedByHistory?: boolean = false;
}

export class FormatChangeModel {
  formatInput: BaseFormatInputModel;
  updateComponent?: boolean = false;
  addToHistory?: boolean = false;
}

export class LoadElementModel {
  isClear?: boolean;
  elementList: PptBaseElementModel[];
  dontAddToSlide?: boolean = false;
}

export class AnalyseApiDataModel {
  customerName: string;
  positive: number;
  negative: number;
}
