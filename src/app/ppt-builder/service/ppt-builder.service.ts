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
  PptShapeElementModel,
  ShapeFormatModel,
  ShapeTypeEnum,
  SlideModel,
  ColumnChartFormatModel,
  BarChartFormatModel,
  PieChartFormatModel,
  DoughnutChartFormatModel
} from '../model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class PPtBuilderService {
  constructor() {
    if (this.slideList.length == 0) {
      this.slideList.push({ elementList: [], isActive: true });
      this.activeSlide = this.slideList[0];
      this.updateSlideList();
    }
  }

  public pptElementsSubscription: BehaviorSubject<LoadElementModel> = new BehaviorSubject<LoadElementModel>(undefined);
  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);
  public slideListSubscription = new BehaviorSubject<SlideModel[]>(undefined);
  public slideList: SlideModel[] = [];
  public activeSlide: SlideModel;

  addSlide() {
    this.slideList.push({ elementList: [], isActive: true });
    this.setActiveSlide(this.slideList[this.slideList.length - 1]);
  }

  setActiveSlide(slide: SlideModel) {
    this.slideList.forEach(item => (item.isActive = false));
    this.activeSlide = slide;
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

  createElement(elType: PPtElementEnum, options: any): PptElementModel {
    let el: PptElementModel = new PptElementModel();
    el.format.formatInputs.x.value = options.x;
    el.format.formatInputs.y.value = options.y;

    switch (elType) {
      case PPtElementEnum.Table:
        el = this.createTableElement(el, options.row, options.col);
        break;
      case PPtElementEnum.Shape:
        el = this.createShapeElement(el, options.type);
        break;
      case PPtElementEnum.Chart:
        el = this.createChartElement(el, options.type);
        break;
      case PPtElementEnum.Text:
        el = this.createTextElement(el, options.text);
        break;
      case PPtElementEnum.Image:
        el = this.createImageElement(el, options.url);
        break;

      default:
        break;
    }

    this.pptElementsSubscription.next({ elementList: [el], dontAddToSlide: false });

    this.activeElementSubscription.next(el);

    return el;
  }

  createShapeElement(el: PptElementModel, type: ShapeTypeEnum): PptElementModel {
    var chartEl = new PptShapeElementModel();
    chartEl.format = new ShapeFormatModel(el.format);
    chartEl.name = 'Shape';
    chartEl.type = PPtElementEnum.Shape;
    chartEl.onFormatChange = new Subject<BaseFormatInputModel>();
    chartEl.shapeType = type;
    chartEl.isActive = false;

    return chartEl;
  }

  createChartElement(el: PptElementModel, type: ChartTypeEnum): PptElementModel {
    var chartEl = new PptChartElementModel(el);
    chartEl.format = new ChartFormatModel();

    if (
      type == ChartTypeEnum.ClusteredColumn ||
      type == ChartTypeEnum.StackedColumn ||
      type == ChartTypeEnum.StackedColumn100
    )
      chartEl.format = new ColumnChartFormatModel();
    else if (
      type == ChartTypeEnum.ClusteredBar ||
      type == ChartTypeEnum.StackedBar ||
      type == ChartTypeEnum.StackedBar100
    )
      chartEl.format = new BarChartFormatModel();
    else if (type == ChartTypeEnum.Pie || type == ChartTypeEnum.ExplodedPie) chartEl.format = new PieChartFormatModel();
    else if (type == ChartTypeEnum.Doughnut || type == ChartTypeEnum.ExplodedDoughnut)
      chartEl.format = new DoughnutChartFormatModel();

    chartEl.name = 'Chart';
    chartEl.type = PPtElementEnum.Chart;
    chartEl.onFormatChange = new Subject<BaseFormatInputModel>();
    chartEl.chartType = type;
    chartEl.isActive = false;

    return chartEl;
  }

  createTableElement(el: PptElementModel, row: number, col: number) {
    var tableEl = new PptTableElementModel();
    tableEl.format = new TableFormatModel(el.format);

    tableEl.name = 'Table';
    tableEl.type = PPtElementEnum.Table;
    tableEl.onFormatChange = new Subject<BaseFormatInputModel>();
    tableEl.row = row;
    tableEl.col = col;
    tableEl.isActive = false;

    return tableEl;
  }

  createImageElement(el: PptElementModel, url: string) {
    var imageEl = new PptImageElementModel();
    imageEl.format = new ImageFormatModel(el.format);
    imageEl.name = 'Image';
    imageEl.type = PPtElementEnum.Image;
    imageEl.onFormatChange = new Subject<BaseFormatInputModel>();
    imageEl.url = url;
    imageEl.isActive = false;

    return imageEl;
  }

  createTextElement(el: PptElementModel, text: string) {
    var textEl = new PptTextElementModel();
    textEl.format = new TextFormatModel(el.format);

    textEl.color = 'black';
    textEl.font = 'sans-serif';
    textEl.fontSize = '12px';
    textEl.fontWeigth = 100;
    textEl.backgroundColor = 'transparent';
    textEl.fontStyle = 'unset';

    textEl.name = 'Text';
    textEl.type = PPtElementEnum.Text;
    textEl.onFormatChange = new Subject<BaseFormatInputModel>();
    textEl.text = text;
    textEl.isActive = false;

    return textEl;
  }

  deleteElement(id: number) {
    this.pptElementsSubscription.value.elementList.splice(id, 1);
    this.activeSlide.elementList = this.activeSlide.elementList.filter(item => item.id !== id);
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
