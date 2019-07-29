import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel,
  PptTextElementModel,
  FormatTextInputModel,
  FormatNumberInputModel,
  FormatDropdownInputModel,
  FormatColorPickerInputModel,
  ShapeTypeEnum,
  PptShapeElementModel,
  FormatRadioButtonInputModel
} from '@app/ppt-builder/model';
import { element } from '@angular/core/src/render3';
import { ContentEditableFormDirective } from '@app/ppt-builder/directives/content-editable-form.directive';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { PptFormatCompontent } from '@app/ppt-builder/components/ppt-format/ppt-format.component';
declare var $: any;

@Component({
  selector: 'ppt-shape-element',
  templateUrl: './shape-element.component.html',
  styleUrls: ['./shape-element.component.scss'],
  providers: [ContentEditableFormDirective]
})
export class ShapeElement implements OnInit, OnDestroy, AfterViewInit {
  @Input('element') element: PptShapeElementModel;

  shapeType: any = {};
  borderSettings: string;
  isDashed: boolean = false;
  myCanvas: any = {};
  ctx: any;
  constructor() {}

  crateArrow() {
    this.drawArrow(
      this.ctx,
      0,
      30,
      this.element.lineWidth,
      30,
      1,
      this.element.arrowDirection,
      20,
      this.element.arrowSize,
      this.element.color,
      this.element.lineSize,
      true,
      this.element.isDashed
    );
  }

  createBorder() {
    if (this.element.isShapeBorder) {
      this.element.shapeBorder =
        this.element.shapeBorderSize + 'pt ' + this.element.shapeBorderStyle + ' ' + this.element.shapeBorderColor;
    } else {
      this.element.shapeBorder = 'unset';
    }
  }

  ngOnInit() {
    this.shapeType.line = ShapeTypeEnum.line;
    this.shapeType.square = ShapeTypeEnum.square;

    this.element.onFormatChange.subscribe(response => {
      let selectedItem: any = {};
      response.forEach((resItem: any) => {
        let res = resItem.formatInput;
        let textInput = res as FormatTextInputModel;
        let dropdown = res as FormatDropdownInputModel;
        let checkbox = res as FormatCheckboxInputModel;
        let numberInput = res as FormatNumberInputModel;
        let colorPickerInput = res as FormatColorPickerInputModel;
        let radioButtonInput = res as FormatRadioButtonInputModel;

        switch (res.inputId) {
          case PPtFormatInputsEnum.shapeBorder:
            this.element.isShapeBorder = checkbox.value;
            this.createBorder();
            break;
          case PPtFormatInputsEnum.shapeBorderColor:
            this.element.shapeBorderColor = colorPickerInput.value;
            this.createBorder();
            break;

          case PPtFormatInputsEnum.shapeBorderSize:
            this.element.shapeBorderSize = numberInput.value;
            this.createBorder();
            break;

          case PPtFormatInputsEnum.width:
            this.element.lineWidth = res.value;

            if (this.element.shapeType == ShapeTypeEnum.line) {
              $('#' + this.element.id).attr('width', res.value);
              this.crateArrow();
            }
            break;
          case PPtFormatInputsEnum.color:
            this.element.color = colorPickerInput.value;
            if (this.element.shapeType == ShapeTypeEnum.line) {
              this.crateArrow();
            }
            break;
          case PPtFormatInputsEnum.lineSize:
            this.element.lineSize = numberInput.value;
            this.element.arrowSize = numberInput.value / 2 + 5;
            if (this.element.shapeType == ShapeTypeEnum.line) {
              this.crateArrow();
            }
            break;
          case PPtFormatInputsEnum.isLineArrow:
            this.element.isLineArrow = checkbox.value;
            if (this.element.isLineArrow) this.element.arrowDirection = 3;
            else this.element.arrowDirection = 0;
            if (this.element.shapeType == ShapeTypeEnum.line) {
              this.crateArrow();
            }

            break;
          case PPtFormatInputsEnum.arrowDirection:
            if (this.element.isLineArrow) {
              selectedItem = dropdown.value.find(o => o.key == dropdown.selectedItemKey);
              if (selectedItem.key == 1) {
                this.element.arrowDirection = 2;
              } else if (selectedItem.key == 2) {
                this.element.arrowDirection = 1;
              } else if (selectedItem.key == 3) {
                this.element.arrowDirection = 3;
              } else {
                this.element.arrowDirection = 0;
              }
              if (this.element.shapeType == ShapeTypeEnum.line) {
                this.crateArrow();
              }
            }
            break;
          case PPtFormatInputsEnum.lineStyle:
            selectedItem = dropdown.value.find(o => o.key == dropdown.selectedItemKey);
            if (selectedItem.key == 1) {
              this.element.isDashed = true;
            } else {
              this.element.isDashed = false;
            }

            if (this.element.shapeType == ShapeTypeEnum.line) {
              this.crateArrow();
            }

            break;
          case PPtFormatInputsEnum.rotate:
            this.element.rotate = numberInput.value;
            break;
          case PPtFormatInputsEnum.textAlign:
            selectedItem = radioButtonInput.value.find(o => o.key == radioButtonInput.selectedItemKey);
            if (selectedItem.key == 1) {
              this.element.textAlign = 'left';
            } else if (selectedItem.key == 2) {
              this.element.textAlign = 'center';
            } else {
              if (this.element.shapeType == ShapeTypeEnum.line) this.element.textAlign = 'end';
              else this.element.textAlign = 'flex-end';
            }
            break;
          case PPtFormatInputsEnum.textVerticalAlign:
            selectedItem = radioButtonInput.value.find(o => o.key == radioButtonInput.selectedItemKey);
            if (selectedItem.key == 1) {
              this.element.textVerticalAlign = 'normal';
            } else if (selectedItem.key == 2) {
              this.element.textVerticalAlign = 'center';
            } else {
              this.element.textVerticalAlign = 'flex-end';
            }
            break;
          case PPtFormatInputsEnum.isShowText:
            this.element.isShowText = checkbox.value;
            break;
          case PPtFormatInputsEnum.fontSize:
            this.element.textFontSize = numberInput.value;
            break;
          case PPtFormatInputsEnum.fontColor:
            this.element.fontColor = colorPickerInput.value;
            break;
          default:
            break;
        }
      });
    });
  }

  clearCanvas(context: any, canvas: any) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  }

  drawScreen() {
    // this.drawGrid(this.ctx, this.myCanvas.width, this.myCanvas.height, '#eee', 10);
    this.drawArrow(this.ctx, 100, 50, 250, 50, 1, 3, 20, 10, '#f36', 4);
    // this.drawArrow(this.ctx, 100, 100, 250, 100, 1, 2, 20, 10, '#f36', 4);
  }

  drawArrow(
    ctx: any,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    style: number,
    which: number,
    angle: number,
    d: number,
    color: string,
    width: number,
    clear: boolean = true,
    isDashed: boolean = false
  ) {
    if (clear) this.clearCanvas(ctx, this.myCanvas);
    if (typeof x1 == 'string') {
      x1 = parseInt(x1);
    }
    if (typeof y1 == 'string') {
      y1 = parseInt(y1);
    }
    if (typeof x2 == 'string') {
      x2 = parseInt(x2);
    }
    if (typeof y2 == 'string') {
      y2 = parseInt(y2);
    }
    style = typeof style != 'undefined' ? style : 3;
    which = typeof which != 'undefined' ? which : 1;
    angle = typeof angle != 'undefined' ? angle : Math.PI / 9;
    d = typeof d != 'undefined' ? d : 10;
    color = typeof color != 'undefined' ? color : '#000';
    width = typeof width != 'undefined' ? width : 1;
    var toDrawHead = typeof style != 'function' ? style : style;
    var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;
    if (which & 1) {
      tox = Math.round(x1 + (x2 - x1) * ratio);
      toy = Math.round(y1 + (y2 - y1) * ratio);
    } else {
      tox = x2;
      toy = y2;
    }

    if (which & 2) {
      fromx = x1 + (x2 - x1) * (1 - ratio);
      fromy = y1 + (y2 - y1) * (1 - ratio);
    } else {
      fromx = x1;
      fromy = y1;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (isDashed) ctx.setLineDash([10, 10]);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    var lineangle = Math.atan2(y2 - y1, x2 - x1);
    var h = Math.abs(d / Math.cos(angle));
    if (which & 1) {
      var angle1 = lineangle + Math.PI + angle;
      var topx = x2 + Math.cos(angle1) * h;
      var topy = y2 + Math.sin(angle1) * h;
      var angle2 = lineangle + Math.PI - angle;
      var botx = x2 + Math.cos(angle2) * h;
      var boty = y2 + Math.sin(angle2) * h;
      this.drawHead(ctx, topx, topy, x2, y2, botx, boty, style, color, width);
    }

    if (which & 2) {
      var angle1 = lineangle + angle;
      var topx = x1 + Math.cos(angle1) * h;
      var topy = y1 + Math.sin(angle1) * h;
      var angle2 = lineangle - angle;
      var botx = x1 + Math.cos(angle2) * h;
      var boty = y1 + Math.sin(angle2) * h;
      this.drawHead(ctx, topx, topy, x1, y1, botx, boty, style, color, width);
    }
  }

  drawHead(ctx: any, x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, style: any, color: any, width: any) {
    if (typeof x0 == 'string') {
      x0 = parseInt(x0);
    }
    if (typeof y0 == 'string') {
      y0 = parseInt(y0);
    }
    if (typeof x1 == 'string') {
      x1 = parseInt(x1);
    }
    if (typeof y1 == 'string') {
      y1 = parseInt(y1);
    }
    if (typeof x2 == 'string') {
      x2 = parseInt(x2);
    }
    if (typeof y2 == 'string') {
      y2 = parseInt(y2);
    }

    var radius = 3,
      twoPI = 2 * Math.PI;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    let backdist: number;
    switch (style) {
      case 0:
        backdist = Math.sqrt((x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0));
        ctx.arcTo(x1, y1, x0, y0, 0.55 * backdist);
        ctx.fill();
        break;
      case 1:
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x0, y0);
        ctx.fill();
        break;
      case 2:
        ctx.stroke();
        break;
      case 3:
        var cpx = (x0 + x1 + x2) / 3;
        var cpy = (y0 + y1 + y2) / 3;
        ctx.quadraticCurveTo(cpx, cpy, x0, y0);
        ctx.fill();
        break;
      case 4:
        var cp1x, cp1y, cp2x, cp2y;
        var shiftamt = 5;
        if (x2 == x0) {
          backdist = y2 - y0;
          cp1x = (x1 + x0) / 2;
          cp2x = (x1 + x0) / 2;
          cp1y = y1 + backdist / shiftamt;
          cp2y = y1 - backdist / shiftamt;
        } else {
          backdist = Math.sqrt((x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0));
          var xback = (x0 + x2) / 2;
          var yback = (y0 + y2) / 2;
          var xmid = (xback + x1) / 2;
          var ymid = (yback + y1) / 2;
          var m = (y2 - y0) / (x2 - x0);
          var dx = backdist / (2 * Math.sqrt(m * m + 1)) / shiftamt;
          var dy = m * dx;
          cp1x = xmid - dx;
          cp1y = ymid - dy;
          cp2x = xmid + dx;
          cp2y = ymid + dy;
        }
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
        ctx.fill();
        break;
    }
    ctx.restore();
  }

  ngAfterViewInit() {
    if (this.element.shapeType == ShapeTypeEnum.line) {
      this.myCanvas = document.getElementById(this.element.id.toString());
      this.ctx = this.myCanvas.getContext('2d');
      this.myCanvas.width = this.element.format.formatInputs.width.value;
      this.myCanvas.height = this.element.format.formatInputs.height.value;
      this.crateArrow();
    }
  }
  ngOnDestroy() {}
}
