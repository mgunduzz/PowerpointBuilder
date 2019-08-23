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
  PptBaseChartElementModel,
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
  FormatChangeInputModel,
  PptDefaultChartElementModel,
  AnalyseApiDataModel,
  LineChartFormatModel,
  PptScatterChartElementModel,
  PptAreaChartElementModel,
  TableCellModel,
  PptPieChartElementModel
} from '../model';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
declare var $: any;
import { saveAs } from 'file-saver';
// import * as html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';
var FileSaver = require('file-saver');
var stringify = require('json-stringify-safe');

@Injectable()
export class PPtBuilderService {
  constructor() {
    if (this.slideList.length == 0) {
      this.addSlide();

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

  public jsonTemplateList: any[] = [];

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
    let lastSlide = this.slideList[this.slideList.length - 1];

    let newSlide = new SlideModel();
    newSlide.isActive = true;
    newSlide.id = lastSlide ? lastSlide.id + 1 : 1;
    newSlide.elementList = [];
    newSlide.pageNumber = this.slideList.length + 1;

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

  private _setTimeoutHandler: any;
  private _setIntervalHandler: any;
  activeSlideNo: number = 1;

  startSlide() {
    this.setActiveSlide(this.activeSlide);
    $('.element-list-container').addClass('slide-active');

    this.activeSlide = this.slideList[0];
    this._setIntervalHandler = setInterval(() => {
      this.setActiveSlide(this.activeSlide);

      $('.element-list-container').addClass('slide-active');

      let index = this.slideList.findIndex(item => item.id == this.activeSlide.id);

      index += 1;

      if (index > this.slideList.length - 1) index = 0;

      this.activeSlide = this.slideList[index];
    }, 1000);
  }

  stopInterval() {
    $('.element-list-container').removeClass('slide-active');

    clearTimeout(this._setTimeoutHandler);
    clearInterval(this._setIntervalHandler);
  }

  setNextSlideActive(activeSlideId: number) {
    this.activeSlide = this.slideList.find(q => q.id == activeSlideId);
    if (this.activeSlide) {
      this.slideList.forEach(el => {
        if (el.id == this.activeSlide.id) {
          el.isActive = true;
          this.activeSlide.isActive = true;
        } else {
          el.isActive = false;
        }
      });

      this.activeSlideSubscription.next(this.activeSlide);
      this.updateSlideList();

      this.pptElementsSubscription.next({
        elementList: this.activeSlide.elementList,
        dontAddToSlide: true,
        isClear: true
      });
    } else {
      this.stopInterval();
      this.activeSlideNo = 1;
    }
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

    this.setActiveElement(el);

    return el;
  }

  squareShapeElementFormat(chartEl: PptShapeElementModel) {
    chartEl.isLineArrow = false;
    chartEl.shapeBorder = 'unset';
    chartEl.shapeBorderColor = 'red';
    chartEl.shapeBorderSize = 2;
    chartEl.shapeBorderStyle = 'dashed';
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
    chartEl.color = '#000000';
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

  ngOnDestroy() {
    clearTimeout(this._setTimeoutHandler);
    clearInterval(this._setIntervalHandler);
  }
  createChartElement(el: PptElementModel, type: ChartTypeEnum): PptElementModel {
    let chartEl = new PptBaseChartElementModel(el);
    chartEl.format = new ChartFormatModel();

    if (
      type == ChartTypeEnum.ClusteredColumn ||
      type == ChartTypeEnum.StackedColumn ||
      type == ChartTypeEnum.StackedColumn100
    ) {
      chartEl = new PptDefaultChartElementModel(el);
      chartEl.format = new ColumnChartFormatModel();
    } else if (
      type == ChartTypeEnum.ClusteredBar ||
      type == ChartTypeEnum.StackedBar ||
      type == ChartTypeEnum.StackedBar100
    ) {
      chartEl = new PptDefaultChartElementModel(el);
      chartEl.format = new BarChartFormatModel();
    } else if (
      type == ChartTypeEnum.Line ||
      type == ChartTypeEnum.StackedLine ||
      type == ChartTypeEnum.StackedLine100 ||
      type == ChartTypeEnum.MarkedLine ||
      type == ChartTypeEnum.StackedMarkedLine ||
      type == ChartTypeEnum.StackedMarkedLine100
    ) {
      chartEl = new PptDefaultChartElementModel(el);
      chartEl.format = new LineChartFormatModel();
    } else if (type == ChartTypeEnum.Pie || type == ChartTypeEnum.ExplodedPie) {
      chartEl = new PptPieChartElementModel(el);

      chartEl.format = new PieChartFormatModel();
    } else if (type == ChartTypeEnum.Doughnut || type == ChartTypeEnum.ExplodedDoughnut) {
      chartEl = new PptPieChartElementModel(el);
      chartEl.format = new DoughnutChartFormatModel();
    } else if (
      type == ChartTypeEnum.MarkedScatter ||
      type == ChartTypeEnum.SmoothMarkedScatter ||
      type == ChartTypeEnum.SmoothLinedScatter ||
      type == ChartTypeEnum.StraightMarkedScatter ||
      type == ChartTypeEnum.StraightLinedScatter
    ) {
      chartEl = new PptScatterChartElementModel(el);
      chartEl.format = new ChartFormatModel();
    } else if (
      type == ChartTypeEnum.Area ||
      type == ChartTypeEnum.StackedArea ||
      type == ChartTypeEnum.StackedArea100
    ) {
      chartEl = new PptAreaChartElementModel(el);
      chartEl.format = new LineChartFormatModel();
    }

    chartEl.name = 'Chart';
    chartEl.type = PPtElementEnum.Chart;
    chartEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
    chartEl.chartType = type;
    chartEl.isActive = false;

    return chartEl;
  }

  createTableElement(el: PptElementModel, row: number, col: number) {
    var tableEl = new PptTableElementModel(row, col);

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

    textEl.color = '#000000';
    textEl.font = 'sans-serif';
    textEl.fontSize = '11pt';
    textEl.fontWeigth = 100;
    textEl.backgroundColor = '00FFFFFF';
    textEl.fontStyle = 'unset';
    textEl.radius = '0';
    textEl.stroke = '';
    textEl.indent = '';
    textEl.firstLineIndent = '';
    textEl.listStyle = '';

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

      this.slideList.forEach((item, index) => (item.pageNumber = index + 1));

      this.updateSlideList();
      this.setActiveSlide(this.slideList[index]);
    }
  }

  export() {
    const PptxGenJS = require('pptxgenjs');

    const pptx = new PptxGenJS();

    this.slideList.forEach(slideItem => {
      let slide = pptx.addNewSlide({ bkgd: slideItem.format.formatInputs.slideBackgroundColor });
      let slidePageNumberInput = slideItem.format.formatInputs.slidePageNumber;

      if (slidePageNumberInput) {
        slide.slideNumber({
          x: slidePageNumberInput.numberInputs[0].value + '%',
          y: slidePageNumberInput.numberInputs[1].value + '%'
        });
      }

      slideItem.elementList.forEach(el => {
        el.generatePptxItem(pptx, slide);
      });
    });

    pptx.save('Sample Presentation');
  }

  getElementData(): Observable<Array<AnalyseApiDataModel>> {
    let data = Array<AnalyseApiDataModel>();

    let customerNames = ['Renault', 'Toyota', 'Mercedes', 'Volkswagen', 'Fiat', 'Tofaş', 'Ferrari', 'Lamborghini'];
    customerNames.splice(2, Math.floor(Math.random() * (customerNames.length - 1)));

    customerNames.forEach(custoName => {
      data.push({
        customerName: custoName,
        positive: Math.floor(Math.random() * 202) + 50,
        negative: Math.floor(Math.random() * 202) + 50
      });
    });

    return of(data);
  }

  jsonStr = '';

  saveAsTemplate() {
    let jsonModel: any[] = [];

    this.slideList.forEach(item => {
      let newItem = item.toJsonModel();

      jsonModel.push(newItem);
    });

    let jsonString = JSON.stringify(jsonModel);

    var blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });

    saveAs(blob, Math.random() + '.txt');
  }

  jsonStringConvert(rawData: string) {
    this.slideList = [];
    let slides = JSON.parse(rawData) as Array<SlideModel>;

    slides.forEach(slide => {
      let newSlide = new SlideModel();
      newSlide.import(slide);

      slide.elementList.forEach((el: PptElementModel) => {
        let newEl = new PptElementModel();

        switch (el.type) {
          case PPtElementEnum.Text:
            newEl = this.createTextElement(el, (el as PptTextElementModel).text);
            break;

          case PPtElementEnum.Image:
            newEl = this.createImageElement(el, (el as PptImageElementModel).url);
            break;

          case PPtElementEnum.Shape:
            newEl = this.createShapeElement(el, (el as PptShapeElementModel).shapeType);
            break;

          case PPtElementEnum.Table:
            newEl = this.createTableElement(el, (el as PptTableElementModel).row, (el as PptTableElementModel).col);
            break;

          case PPtElementEnum.Chart:
            newEl = this.createChartElement(el, (el as PptBaseChartElementModel).chartType);
            break;

          default:
            break;
        }

        for (const key in el) {
          if (el.hasOwnProperty(key)) {
            newEl[key] = el[key];
          }
        }

        newSlide.elementList.push(newEl);
      });

      this.slideList.push(newSlide);
    });

    if (this.slideList.length > 0) {
      this.setActiveSlide(this.slideList[0]);

      if (this.slideList[0].elementList.length > 0) {
        this.setActiveElement(this.slideList[0].elementList[0]);
      }
    }
  }
}
