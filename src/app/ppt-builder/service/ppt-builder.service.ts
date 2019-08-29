import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import {
  AnalyseApiDataModel,
  BarChartFormatModel,
  BaseFormatInputModel,
  ChartFormatModel,
  ChartTypeEnum,
  ColumnChartFormatModel,
  DoughnutChartFormatModel,
  ElementExistenceChangeHistory,
  ElementFormatChangeHistory,
  FormatChangeInputModel,
  FormatChangeModel,
  ImageFormatModel,
  LineChartFormatModel,
  PieChartFormatModel,
  PptAreaChartElementModel,
  PptBaseChartElementModel,
  PptDefaultChartElementModel,
  PPtElementEnum,
  PptBaseElementModel,
  PPtFormatInputsEnum,
  PptImageElementModel,
  PptPieChartElementModel,
  PptScatterChartElementModel,
  PptShapeElementModel,
  PptTableElementModel,
  PptTextElementModel,
  ShapeFormatModel,
  ShapeTypeEnum,
  SlideBaseElementChangeHistory,
  SlideModel,
  TextFormatModel
} from '../model';

// import * as html2canvas from 'html2canvas';

declare var $: any;

var FileSaver = require('file-saver');
var stringify = require('json-stringify-safe');

/**
 * Only service for Powerpoint builder(creating elements, export etc)
 */
@Injectable()
export class PPtBuilderService {
  elementListAsync: BehaviorSubject<PptBaseElementModel[]> = new BehaviorSubject<Array<PptBaseElementModel>>(undefined);

  constructor() {
    this.activeSlide = new SlideModel();
    this.activeSlide.id = 0;

    if (this.slideList.length == 0) {
      this.addSlide();

      this.updateSlideList();
    }
  }

  public pptElementDeleteSubscription: BehaviorSubject<number> = new BehaviorSubject<number>(undefined);

  public activeElementSubscription = new BehaviorSubject<PptBaseElementModel>(undefined);
  public activeSlideSubscription = new BehaviorSubject<SlideModel>(undefined);
  public slideListSubscription = new BehaviorSubject<SlideModel[]>(undefined);
  public slideList: SlideModel[] = [];
  public activeSlide: SlideModel;
  public activeElement: PptBaseElementModel;

  private isPreviewActive: boolean = true;

  public jsonTemplateList: any[] = [];

  public activeElementTemplatesSubscription = new BehaviorSubject<Array<any>>(undefined);
  public undoRedoIndexSubscription = new BehaviorSubject<number>(undefined);

  /**
   * Updates elements preview image on active slide.
   */
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

  /**
   * sets element format changes to active slide format change history.
   * @param elementId changed element id
   * @param formatInputs changed element format inputs(width, height etc)
   */
  setFormatInputChangeToActiveSlideHistory(elementId: number, formatInputs: Array<BaseFormatInputModel>) {
    if (formatInputs.length == 0) return false;

    let historyFormatInputs = formatInputs.map(item => {
      return { inputId: item.inputId, value: (item as any).value } as FormatChangeInputModel;
    });

    let formatChangeHistory = new ElementFormatChangeHistory();
    formatChangeHistory.elementId = elementId;
    formatChangeHistory.inputs = historyFormatInputs;

    this.setElementChangeHistory(elementId, formatChangeHistory);
  }

  /**
   * when element deleted or created, existence status adds to active slide change history
   * @param el
   * @param isDeleted
   */
  setElementExistenceChangeHistory(el: PptBaseElementModel, isDeleted: boolean = false) {
    if (el) {
      let elExistenceChangeHistory = new ElementExistenceChangeHistory();
      elExistenceChangeHistory.element = el;
      elExistenceChangeHistory.elementId = el.id;
      elExistenceChangeHistory.isDeleted = isDeleted;

      this.setElementChangeHistory(el.id, elExistenceChangeHistory);
    }
  }

  /**
   * base method for 'setFormatInputChangeToActiveSlideHistory' and 'setElementExistenceChangeHistory'.
   * @param elementId
   * @param changeHistory
   */
  setElementChangeHistory(elementId: number, changeHistory: SlideBaseElementChangeHistory) {
    if (!this.activeSlide.formatChangeHistory) this.activeSlide.formatChangeHistory = [];

    // if (this.activeSlide.historyActiveIndex == undefined) this.activeSlide.historyActiveIndex = -1;

    this.activeSlide.historyActiveIndex++;

    //deletes changes after historyActiveIndex,cause cant redo when new changes added
    this.activeSlide.formatChangeHistory.splice(
      this.activeSlide.historyActiveIndex,
      this.activeSlide.formatChangeHistory.length
    );

    this.activeSlide.formatChangeHistory.push(changeHistory);
    this.undoRedoIndexSubscription.next(this.activeSlide.historyActiveIndex);
  }

  /**
   * undo last active slide changes
   */
  undoActiveSlideFormatChange() {
    if (this.activeSlide.formatChangeHistory.length > 0 && this.activeSlide.historyActiveIndex > 0) {
      /**
       * if last change is element existence change(create or delete) historyActiveIndex must not decrease.if element deleted must be created after undo or otherwise
       */
      if (this.activeSlide.historyActiveIndex == this.activeSlide.formatChangeHistory.length - 1) {
        if (
          this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex] instanceof
          ElementExistenceChangeHistory
        ) {
        } else this.activeSlide.historyActiveIndex--;
      } else this.activeSlide.historyActiveIndex--;

      let changeHistory = this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex];

      this.undoRedoUpdate(changeHistory, true);
    }
  }

  redoActiveSlideFormatChange() {
    if (
      this.activeSlide.formatChangeHistory.length > 0 &&
      this.activeSlide.historyActiveIndex < this.activeSlide.formatChangeHistory.length - 1
    ) {
      /**
       * if first change is element existence change(create or delete) historyActiveIndex must not increase.if element deleted must be created after undo or otherwise
       */
      if (this.activeSlide.historyActiveIndex == 0) {
        if (
          this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex] instanceof
          ElementExistenceChangeHistory
        ) {
        } else this.activeSlide.historyActiveIndex++;
      } else this.activeSlide.historyActiveIndex++;

      let changeHistory = this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex];

      this.undoRedoUpdate(changeHistory, false);
    }
  }

  /**
   * base method for undo , redo process
   * @param changeHistory changeHistory which applying
   * @param isUndo is pressed undo
   */
  undoRedoUpdate(changeHistory: SlideBaseElementChangeHistory, isUndo: boolean = true) {
    /**
     * if change is format change(width, height etc. changes)
     */
    if (changeHistory instanceof ElementFormatChangeHistory) {
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

        element.onFormatChange.next(changedFormats);
      }
    } else if (changeHistory instanceof ElementExistenceChangeHistory) {
    /**
     * if change is element existence change like create or delete
     */
      let el = changeHistory.element;

      if (changeHistory.isDeleted) {
        el.isCreatedByHistory = true;
        this.addElement(el, false);
      } else {
        this.deleteElement(el.id, false);
      }

      if (isUndo) {
        if (
          !(
            this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex - 1] instanceof
            ElementExistenceChangeHistory
          )
        )
          this.activeSlide.historyActiveIndex--;
      } else {
        if (
          !(
            this.activeSlide.formatChangeHistory[this.activeSlide.historyActiveIndex + 1] instanceof
            ElementExistenceChangeHistory
          )
        )
          this.activeSlide.historyActiveIndex++;
      }

      // this.activeSlide.historyActiveIndex += isUndo ? -1 : 1;

      changeHistory.isDeleted = !changeHistory.isDeleted;
    }

    this.undoRedoIndexSubscription.next(this.activeSlide.historyActiveIndex);
  }

  /**
   * adds empty new slide to slideList.
   */
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

  /**
   * sets passed slide to active slide
   * @param slide slide model from slideList
   */
  setActiveSlide(slide: SlideModel) {
    this.activeSlide = slide;

    this.slideList.forEach(el => {
      el.isActive = false;
      el.isHovered = false;
    });

    this.activeSlide.isActive = true;
    this.activeSlide.isHovered = true;

    this.activeSlideSubscription.next(slide);
    this.updateSlideList();
    this.elementListAsync.next(this.activeSlide.elementList);
  }

  private _setTimeoutHandler: any;
  private _setIntervalHandler: any;
  activeSlideNo: number = 1;

  /**
   * starts slide show
   */
  startSlide() {
    this.activeSlide = this.slideList[0];
    this.setActiveSlide(this.activeSlide);
    $('.element-list-container').addClass('slide-active');

    this._setIntervalHandler = setInterval(() => {
      this.setActiveSlide(this.activeSlide);

      $('.element-list-container').addClass('slide-active');

      let index = this.slideList.findIndex(item => item.id == this.activeSlide.id);

      index += 1;

      if (index > this.slideList.length - 1) {
        this.stopInterval();
      }

      this.activeSlide = this.slideList[index];
    }, 2000);
  }

  /**
   * stops slide show
   */
  stopInterval() {
    $('.element-list-container').removeClass('slide-active');

    clearTimeout(this._setTimeoutHandler);
    clearInterval(this._setIntervalHandler);
  }

  /**
   *
   * @param activeSlideId
   */
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

      // this.elementListAsync.next(this.activeSlide.elementList);
    } else {
      this.stopInterval();
      this.activeSlideNo = 1;
    }
  }

  /**
   * updates listed slides by slides on this service
   */
  updateSlideList() {
    this.slideListSubscription.next(this.slideList);
  }

  /**
   * sets active element by passed elementModel
   * @param item Base element model
   */
  setActiveElement(item: PptBaseElementModel) {
    let elId = 0;

    if (item) {
      this.activeSlide.isHovered = false;
      elId = item.id;
    }

    this.activeElement = item;
    this.activeElementSubscription.next(item);
    this.elementListAsync.value.forEach(el => (el.isActive = el.id == elId));
  }

  /**
   * generates element model by using element types(table, chart).
   * @param elType enum using for element types
   * @param options bootstrap element options
   */
  generateElement(elType: PPtElementEnum, options: any): PptBaseElementModel {
    let el: PptBaseElementModel = new PptBaseElementModel();
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

    this.addElement(el);

    return el;
  }

  /**
   * adding element to element list and sets active.
   * @param el element model
   * @param addHistory if true it sets active slide change history.for undo redo
   */
  addElement(el: PptBaseElementModel, addHistory: boolean = true) {
    el.id = 1;

    if (this.activeSlide.elementList.length > 0)
      el.id = this.activeSlide.elementList[this.activeSlide.elementList.length - 1].id + 1;

    this.activeSlide.elementList.push(el);
    let activeSlideEls = this.activeSlide.elementList;

    this.elementListAsync.next(activeSlideEls);
    this.setActiveElement(el);

    if (addHistory) this.setElementExistenceChangeHistory(el, false);
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

  createShapeElement(el: PptBaseElementModel, type: ShapeTypeEnum): PptBaseElementModel {
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
  createChartElement(el: PptBaseElementModel, type: ChartTypeEnum): PptBaseElementModel {
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

  createTableElement(el: PptBaseElementModel, row: number, col: number): PptTableElementModel {
    var tableEl = new PptTableElementModel(row, col);

    tableEl.name = 'Table';
    tableEl.type = PPtElementEnum.Table;
    tableEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
    tableEl.row = row;
    tableEl.col = col;
    tableEl.isActive = false;

    return tableEl;
  }

  createImageElement(el: PptBaseElementModel, url: string) {
    var imageEl = new PptImageElementModel();
    imageEl.format = new ImageFormatModel(el.format);
    imageEl.name = 'Image';
    imageEl.type = PPtElementEnum.Image;
    imageEl.onFormatChange = new Subject<Array<FormatChangeModel>>();
    imageEl.url = url;
    imageEl.isActive = false;

    return imageEl;
  }

  createTextElement(el: PptBaseElementModel, text: string) {
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

  /**
   * delete element from element list and activeSlide element list.
   * @param id element id
   * @param addHistory if true deleted element adds to activeSlide change history for undo redo.
   */
  deleteElement(id: number, addHistory: boolean = true) {
    let el = this.activeSlide.elementList.find(o => o.id == id);

    if (el) {
      if (addHistory) this.setElementExistenceChangeHistory(el, true);

      this.pptElementDeleteSubscription.next(id);
      this.elementListAsync.next(this.elementListAsync.value.filter(item => item.id !== id));
      this.activeSlide.elementList = this.activeSlide.elementList.filter(item => item.id !== id);

      this.setActiveElement(undefined);
    }
  }

  /**
   * delets passed slide by slide.id
   * @param slide slide model
   */
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

  /**
   * using for PptxGenjs Export
   */
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
        /**
         * using for elements export for PptxGenjs
         */
        el.generatePptxItem(pptx, slide);
      });
    });

    pptx.save('Sample Presentation');
  }

  /**
   * stores active elements as json string at localStorage
   * @param templateName
   */
  saveActiveElementAsTemplate(templateName: string) {
    let activeEl = this.activeElement;
    let name = activeEl.constructor.name + '-' + templateName;

    let elJson = JSON.stringify(activeEl.toJsonModel());

    localStorage.setItem(name, elJson);

    this.updateActiveElementTemplates();
  }

  /**
   * updates active element template list
   */
  updateActiveElementTemplates() {
    let allKeys = Object.keys(localStorage);
    let activeElName = this.activeElement.constructor.name;

    allKeys = allKeys.filter(item => item.includes(activeElName));

    let templates: any[] = [];

    allKeys.forEach(key => {
      let data = localStorage.getItem(key);

      if (data) {
        templates.push({ name: key.split('-')[1], data: data });
      }
    });

    this.activeElementTemplatesSubscription.next(templates);
  }

  /**
   * fake data for elements has dataModal(table, charts).
   */
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

  /**
   * stores all slide and its elements as a jsonString on text file
   */
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

  /**
   * apply selected templates for active element.
   * @param template stores template jsonString.
   */
  setActiveElementTemplate(template: any) {
    let templateElJsonData = template.data;

    let templateEl = JSON.parse(templateElJsonData) as PptBaseElementModel;

    let newEl = this.generateElementByElementModel(templateEl, true);

    let changeModels: FormatChangeModel[] = [];
    let currentEl = this.elementListAsync.value.find(item => item.id == this.activeElement.id);

    templateEl.format.formatInputs.x.value = currentEl.format.formatInputs.x.value;
    templateEl.format.formatInputs.y.value = currentEl.format.formatInputs.y.value;

    for (const key in templateEl.format.formatInputs) {
      if (templateEl.format.formatInputs.hasOwnProperty(key)) {
        if (key) {
          const formatInput = templateEl.format.formatInputs[key];
          const activeFormatInput = currentEl.format.formatInputs[key];

          this.activeSlide.elementList.find(item => item.id == currentEl.id).format.formatInputs[key] = formatInput;

          let changeModel = new FormatChangeModel();
          changeModel.formatInput = formatInput;
          changeModel.addToHistory = false;
          changeModel.updateComponent = true;

          if (formatInput.inputId != PPtFormatInputsEnum.x && formatInput.inputId != PPtFormatInputsEnum.y)
            changeModels.push(changeModel);
        }
      }
    }

    currentEl.onFormatChange.next(changeModels);

    if (newEl instanceof PptImageElementModel) {
      (currentEl as PptImageElementModel).url = newEl.url;
    } else if (newEl instanceof PptBaseChartElementModel) {
      (currentEl as PptBaseChartElementModel).dataModal = newEl.dataModal;
      (currentEl as PptBaseChartElementModel).onDataChange.next();
    } else if (newEl instanceof PptTableElementModel) {
      (currentEl as PptTableElementModel).dataModal = newEl.dataModal;
      (currentEl as PptTableElementModel).cells = newEl.cells;
      (currentEl as PptTableElementModel).cells.forEach(cell => (cell.value = cell.isHeader ? cell.value : ''));
      (currentEl as PptTableElementModel).defaultCellHeight = newEl.defaultCellHeight;
      (currentEl as PptTableElementModel).defaultCellWidth = newEl.defaultCellWidth;
      (currentEl as PptTableElementModel).onDataChange.next();
    }

    this.setActiveElement(currentEl);
  }

  /**
   * generates element by element model.
   * @param el element model
   * @param updateFormatInput sets passed elements format inputs to generated element.
   */
  generateElementByElementModel(el: PptBaseElementModel, updateFormatInput: boolean = false) {
    let newEl = new PptBaseElementModel();

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
        (newEl as PptTableElementModel).defaultCellHeight = (el as PptTableElementModel).defaultCellHeight;
        (newEl as PptTableElementModel).defaultCellWidth = (el as PptTableElementModel).defaultCellWidth;
        (newEl as PptTableElementModel).cells = (el as PptTableElementModel).cells;
        (newEl as PptTableElementModel).dataModal = (el as PptTableElementModel).dataModal;
        break;

      case PPtElementEnum.Chart:
        newEl = this.createChartElement(el, (el as PptBaseChartElementModel).chartType);
        (newEl as PptBaseChartElementModel).dataModal = (el as PptBaseChartElementModel).dataModal;
        break;

      default:
        break;
    }

    if (updateFormatInput) {
      for (const key in newEl.format.formatInputs) {
        if (newEl.format.formatInputs.hasOwnProperty(key)) {
          let val = el.format.formatInputs[key];

          if (val) newEl.format.formatInputs[key] = val;
        }
      }
    }

    return newEl;
  }

  /**
   * json string to powerpoint builder.parse all slide and its elements.and adds to mainContainer for listing.
   * @param rawData
   */
  jsonStringConvert(rawData: string) {
    this.slideList = [];
    let slides = JSON.parse(rawData) as Array<SlideModel>;

    slides.forEach(slide => {
      let newSlide = new SlideModel();
      newSlide.import(slide);

      slide.elementList.forEach((el: PptBaseElementModel) => {
        let newEl = this.generateElementByElementModel(el);

        for (const key in el) {
          if (el.hasOwnProperty(key)) {
            newEl[key] = el[key];
          }
        }

        newSlide.elementList.push(newEl);
      });

      this.slideList.push(newSlide);
    });

    if (this.activeSlide) this.activeSlide.id = 0;

    if (this.slideList.length > 0) {
      this.setActiveSlide(this.slideList[0]);

      if (this.slideList[0].elementList.length > 0) {
        this.setActiveElement(this.slideList[0].elementList[0]);
      }
    }
  }
}
