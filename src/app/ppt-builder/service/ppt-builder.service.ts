import { Injectable, OnInit } from '@angular/core';
import {
  ChartFormatModel,
  BaseFormatInputModel,
  PptElementModel,
  PPtElementEnum,
  LoadElementModel,
  PptTableElementModel,
  TableFormatModel,
  PptTextElementModel,
  TextFormatModel,
  PptImageElementModel,
  ImageFormatModel,
  ChartTypeEnum,
  PptChartElementModel,
  SlideModel,
  ColumnChartFormatModel
} from '../model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class PPtBuilderService {
  constructor() {
    if (this.slideList.length == 0) {
      this.slideList.push({ elementList: [], isActive: true });

      this.updateSlideList();
    }
  }

  public pptElementsSubscription: BehaviorSubject<LoadElementModel> = new BehaviorSubject<LoadElementModel>(undefined);
  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);
  public slideListSubscription = new BehaviorSubject<SlideModel[]>(undefined);
  public slideList: SlideModel[] = [];

  addSlide() {
    this.slideList.push({ elementList: [], isActive: true });
    this.setActiveSlide(this.slideList[this.slideList.length - 1]);
  }

  setActiveSlide(slide: SlideModel) {
    this.slideList.forEach(item => (item.isActive = false));
    slide.isActive = true;
    this.pptElementsSubscription.next({
      elementList: slide.elementList,
      isClear: true,
      dontAddToSlide: true
    });
  }

  updateSlideList() {
    this.slideListSubscription.next(this.slideList);
  }

  setActiveElement(item: PptElementModel) {
    this.activeElementSubscription.next(item);
  }

  createChartElement(x: string, y: string, type: ChartTypeEnum): PptElementModel {
    var chartEl = new PptChartElementModel();
    chartEl.format = new ChartFormatModel();

    if (
      type == ChartTypeEnum.ClusteredColumn ||
      type == ChartTypeEnum.StackedColumn ||
      type == ChartTypeEnum.StackedColumn100
    )
      chartEl.format = new ColumnChartFormatModel();

    chartEl.name = 'Chart';
    chartEl.type = PPtElementEnum.Chart;
    chartEl.onFormatChange = new Subject<BaseFormatInputModel>();
    chartEl.x = x;
    chartEl.y = y;
    chartEl.chartType = type;

    return chartEl;
  }

  createTableElement(x: string, y: string, row: number, col: number) {
    var tableEl = new PptTableElementModel();
    tableEl.format = new TableFormatModel();
    tableEl.name = 'Table';
    tableEl.type = PPtElementEnum.Table;
    tableEl.onFormatChange = new Subject<BaseFormatInputModel>();
    tableEl.x = x;
    tableEl.y = y;
    tableEl.row = row;
    tableEl.col = col;

    return tableEl;
  }

  createImageElement(x: string, y: string, url: string) {
    var imageEl = new PptImageElementModel();
    imageEl.format = new ImageFormatModel();
    imageEl.name = 'Image';
    imageEl.type = PPtElementEnum.Image;
    imageEl.onFormatChange = new Subject<BaseFormatInputModel>();
    imageEl.x = x;
    imageEl.y = y;
    imageEl.url = url;

    return imageEl;
  }

  createTextElement(x: string, y: string, text: string) {
    var textEl = new PptTextElementModel();
    textEl.format = new TextFormatModel();

    textEl.color = 'black';
    textEl.font = 'sans-serif';
    textEl.fontSize = '12px';
    textEl.fontWeigth = 100;
    textEl.backgroundColor = 'transparent';
    textEl.fontStyle = 'unset';

    textEl.name = 'Text';
    textEl.type = PPtElementEnum.Text;
    textEl.onFormatChange = new Subject<BaseFormatInputModel>();
    textEl.x = x;
    textEl.y = y;
    textEl.text = text;

    return textEl;
  }

  export() {
    const PptxGenJS = require('pptxgenjs');

    const pptx = new PptxGenJS();

    this.slideList.forEach(slideItem => {
      let slide = pptx.addNewSlide();

      slideItem.elementList.forEach(el => {
        el.generatePptxItem(pptx, slide);
      });
    });

    pptx.save('Sample Presentation');
  }
}
