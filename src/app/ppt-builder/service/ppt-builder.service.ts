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
  DoughnutChartFormatModel,
  FormatChangeModel,
  SlideFormatChangeHistory,
  FormatChangeInputModel
} from '../model';
import { BehaviorSubject, Subject } from 'rxjs';
declare var $: any;

// import * as html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';

@Injectable()
export class PPtBuilderService {
  constructor() {
    if (this.slideList.length == 0) {
      this.slideList.push({ elementList: [], isActive: true, id: -1 });
      this.activeSlide = this.slideList[0];
      this.setActiveSlide(this.activeSlide);
      this.updateSlideList();
    }
  }

  public pptElementsSubscription: BehaviorSubject<LoadElementModel> = new BehaviorSubject<LoadElementModel>(undefined);
  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);
  public activeSlideSubscription = new BehaviorSubject<SlideModel>(undefined);
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

  setFormatInputChangeToActiveSlideHistory(elementId: number, formatInputs: Array<BaseFormatInputModel>) {
    if (formatInputs.length == 0) return false;

    if (!this.activeSlide.formatChangeHistory) this.activeSlide.formatChangeHistory = [];

    if (this.activeSlide.historyActiveIndex == undefined) this.activeSlide.historyActiveIndex = -1;

    this.activeSlide.historyActiveIndex++;

    this.activeSlide.formatChangeHistory.splice(
      this.activeSlide.historyActiveIndex,
      this.activeSlide.formatChangeHistory.length
    );

    let historyFormatInputs = formatInputs.map(item => {
      return { inputId: item.inputId, value: (item as any).value } as FormatChangeInputModel;
    });

    this.activeSlide.formatChangeHistory.push({ elementId: elementId, inputs: historyFormatInputs });

    console.log({ addIndex: this.activeSlide.historyActiveIndex });
    console.log(
      formatInputs
        .map(item => {
          return item.name + ' : ' + (item as any).value;
        })
        .join(',  ')
    );
    console.log('----');
  }

  undoActiveSlideFormatChange() {
    if (this.activeSlide.formatChangeHistory.length > 0 && this.activeSlide.historyActiveIndex > 0) {
      this.activeSlide.historyActiveIndex--;
      let changeHistory = this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex];

      this.undoRedoUpdate(changeHistory);
    }
  }

  redoActiveSlideFormatChange() {
    if (
      this.activeSlide.formatChangeHistory.length > 0 &&
      this.activeSlide.historyActiveIndex < this.activeSlide.formatChangeHistory.length - 1
    ) {
      this.activeSlide.historyActiveIndex++;

      let changeHistory = this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex];

      this.undoRedoUpdate(changeHistory);
    }
  }

  undoRedoUpdate(changeHistory: SlideFormatChangeHistory) {
    let element = this.activeSlide.elementList.find(item => item.id == changeHistory.elementId);

    if (element) {
      let changedFormats = Array<FormatChangeModel>();

      changeHistory.inputs.forEach(input => {
        let elFormatInput = Object.values(element.format.formatInputs).find(
          item => item.inputId == input.inputId
        ) as BaseFormatInputModel;
        (elFormatInput as any).value = input.value;

        changedFormats.push({ updateComponent: true, formatInput: elFormatInput, addToHistory: false });
      });

      console.log({ index: this.activeSlide.historyActiveIndex });
      console.log(
        changedFormats
          .map(item => {
            return item.formatInput.name + ' : ' + (item.formatInput as any).value;
          })
          .join(',  ')
      );

      element.onFormatChange.next(changedFormats);
    }
  }

  addSlide() {
    let newSlide = new SlideModel();
    newSlide.isActive = true;
    newSlide.id = -1;
    newSlide.elementList = [];

    this.slideList.push(newSlide);
    this.setActiveSlide(newSlide);
  }

  setActiveSlide(slide: SlideModel) {
    this.activeSlide = slide;

    this.slideList.forEach(el => {
      el.isActive = false;
    });

    this.activeSlide.isActive = true;
    this.activeSlideSubscription.next(slide);
    this.updateSlideList();

    this.pptElementsSubscription.next({
      elementList: this.activeSlide.elementList,
      dontAddToSlide: true,
      isClear: true
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
    chartEl.lineSize = 4;
    chartEl.isLineArrow = true;
    chartEl.lineStyle = 'solid';
    chartEl.shapeType = ShapeTypeEnum.line;
    chartEl.arrowDirection = 0;
    chartEl.isDashed = false;
    chartEl.arrowSize = 0;

    return chartEl;
  }

  createShapeElement(el: PptElementModel, type: ShapeTypeEnum): PptElementModel {
    var chartEl = new PptShapeElementModel();
    chartEl.format = new ShapeFormatModel(el.format);
    chartEl.name = 'Shape';
    chartEl.type = PPtElementEnum.Shape;
    chartEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
    chartEl.isActive = false;
    chartEl.rotate = 0;
    chartEl.radius = 0;
    chartEl.color = 'black';
    chartEl.isShowText = false;
    chartEl.textAlign = 'left';
    chartEl.textFontSize = 10;
    chartEl.text = 'Test Metin';
    chartEl.lineWidth = 400;
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
    chartEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
    chartEl.chartType = type;
    chartEl.isActive = false;

    return chartEl;
  }

  createTableElement(el: PptElementModel, row: number, col: number) {
    var tableEl = new PptTableElementModel();
    tableEl.format = new TableFormatModel(el.format);

    tableEl.name = 'Table';
    tableEl.type = PPtElementEnum.Table;
    tableEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
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
    imageEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
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
    textEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
    textEl.text = text;
    textEl.isActive = false;

    return textEl;
  }

  deleteElement(id: number) {
    this.pptElementsSubscription.value.elementList.splice(id, 1);
    this.activeSlide.elementList = this.activeSlide.elementList.filter(item => item.id !== id);
  }

  deleteSlide(slide: SlideModel) {
    if (this.slideList.length > 1) {
      let index = this.slideList.findIndex(item => item.id == slide.id);

      this.slideList.splice(index, 1);

      if (index > 0) index--;

      this.updateSlideList();
      this.setActiveSlide(this.slideList[index]);
    }
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
