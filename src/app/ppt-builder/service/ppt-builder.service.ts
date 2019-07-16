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
declare var $: any;

// import * as html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';

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
  public activeElement: PptElementModel;

  private isPreviewActive: boolean = true;

  setSlidePreview() {
    if (this.isPreviewActive) {
      this.isPreviewActive = false;
      let _this = this;

      let mainEl = document.getElementsByClassName('element-list-container')[0] as HTMLElement;

      html2canvas(mainEl).then((canvas: any) => {
        var imgData: string = canvas.toDataURL('image/png');

        this.activeSlide.previewImage = imgData;

        setTimeout(() => {
          _this.isPreviewActive = true;
        }, 100);
      });
    }
  }

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
    this.activeElement = item;
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

  squareShapeElementFormat(chartEl: PptShapeElementModel) {
    chartEl.isLineArrow = false;
    chartEl.shapeBorder = false;
    chartEl.shapeBorderColor = 'false';
    chartEl.shapeBorderSize = 1;
    chartEl.shapeBorderStyle = 'false';
    chartEl.shapeType = ShapeTypeEnum.square;
    return chartEl;
  }

  lineShapeElementFormat(chartEl: PptShapeElementModel) {
    chartEl.lineSize = 1;
    chartEl.isLineArrow = true;
    chartEl.lineStyle = 'solid';
    chartEl.shapeType = ShapeTypeEnum.line;

    return chartEl;
  }

  createShapeElement(el: PptElementModel, type: ShapeTypeEnum): PptElementModel {
    var chartEl = new PptShapeElementModel();
    chartEl.format = new ShapeFormatModel(el.format);
    chartEl.name = 'Shape';
    chartEl.type = PPtElementEnum.Shape;
    chartEl.onFormatChange = new Subject<BaseFormatInputModel>();
    chartEl.isActive = false;
    chartEl.rotate = 0;
    chartEl.radius = 0;
    chartEl.arrowDirection = 'none';
    chartEl.color = 'black';
    chartEl.isShowText = false;
    chartEl.textAlign = 'center';
    chartEl.textFontSize = 10;
    chartEl.text = 'Test Metin';

    if (type == ShapeTypeEnum.line) {
      chartEl = this.lineShapeElementFormat(chartEl);
    } else if (type == ShapeTypeEnum.square) {
      chartEl = this.squareShapeElementFormat(chartEl);
    }

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
