import { Injectable } from '@angular/core';
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
  ShapeTypeEnum
} from '../model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class PPtBuilderService {
  constructor() {}

  public pptElementsSubscription: BehaviorSubject<LoadElementModel> = new BehaviorSubject<LoadElementModel>(undefined);

  public activeElementSubscription = new BehaviorSubject<PptElementModel>(undefined);

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

    return chartEl;
  }

  createChartElement(x: string, y: string, type: ChartTypeEnum): PptElementModel {
    var chartEl = new PptChartElementModel();
    chartEl.format = new ChartFormatModel();
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
}
