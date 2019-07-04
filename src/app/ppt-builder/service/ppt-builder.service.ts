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

  createShapeElement(x: string, y: string, type: ShapeTypeEnum): PptElementModel {
    var chartEl = new PptShapeElementModel();
    chartEl.format = new ShapeFormatModel();
    chartEl.name = 'Shape';
    chartEl.type = PPtElementEnum.Shape;
    chartEl.onFormatChange = new Subject<BaseFormatInputModel>();
    chartEl.x = x;
    chartEl.y = y;
    chartEl.shapeType = type;
    chartEl.isActive = false;

    return chartEl;
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
    chartEl.x = x;
    chartEl.y = y;
    chartEl.chartType = type;
    chartEl.isActive = false;

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
    tableEl.isActive = false;

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
    imageEl.isActive = false;

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
