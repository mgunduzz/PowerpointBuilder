import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
  HostListener,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  FormatNumberInputModel,
  PPtFormatInputsEnum,
  BaseFormatInputModel,
  FormatChangeModel,
  FormatColorPickerInputModel,
  FormatCheckboxInputModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

declare var $: any;

@Component({
  selector: 'ppt-base-element',
  templateUrl: './base-element-container.component.html',
  styleUrls: ['./base-element-container.component.scss']
})
export class BaseElementContainer implements OnInit, OnDestroy, AfterViewInit {
  @Input('element') element: PptElementModel;
  @Input('type') type: number;
  @Output() highlightChange = new EventEmitter();

  @ViewChild('baseElementCont') elementContainer: ElementRef;

  version: string = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  dragDropStatus: boolean = false;
  newPositionXTemp: string = '0px';
  newPositionYTemp: string = '0px';
  newPositionX: string = '0px';
  newPositionY: string = '0px';
  elementTypes: any = {};
  elementId: number;
  elHighlight: boolean = false;
  isContainerActive: boolean = false;
  rotateStatus: boolean = false;
  elementBox: any;
  dotted: any;
  offset: any;

  changeElementpPriority(isLevelUp: boolean) {
    let data: { isLevelUp: boolean; id: number; zIndex: number } = { isLevelUp: false, id: 0, zIndex: 0 };

    data.isLevelUp = isLevelUp;
    data.id = this.element.id;
    data.zIndex = this.element.z;

    this.changeElementpPriorityEmitter.next(data);
  }

  @Output('onItemActiveChanged') onItemActiveChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output('changeElementpPriorityEmitter') changeElementpPriorityEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private pPtBuilderService: PPtBuilderService) {
    this.elementTypes.TABLE = PPtElementEnum.Table;
    this.elementTypes.CHART = PPtElementEnum.Chart;
    this.elementTypes.TEXT = PPtElementEnum.Text;
    this.elementTypes.IMAGE = PPtElementEnum.Image;
    this.elementTypes.SHAPE = PPtElementEnum.Shape;
  }

  ngOnInit() {
    if (this.pPtBuilderService.activeElement)
      if (this.element.id == this.pPtBuilderService.activeElement.id) {
        this.highlightElement(this.element.id);
        this.changeItemActive(true);
      }

    this.element.onFormatChange.subscribe(res => {
      let historyInputs = Array<BaseFormatInputModel>();

      if (res)
        res.forEach(item => {
          if (item.updateComponent) {
            this.updateFormats(item.formatInput);
          }

          if (item.addToHistory) historyInputs.push(item.formatInput);

          // console.log('elementFormatChange ' + res.formatInput.name + ' : ' + (res.formatInput as any).value);
        });

      if (historyInputs.length > 0)
        this.pPtBuilderService.setFormatInputChangeToActiveSlideHistory(this.element.id, historyInputs);
    });

    let _this = this;
  }

  changeItemActive(active: boolean) {
    this.element.isActive = active;

    this.onItemActiveChanged.emit({ id: this.element.id, isActive: active });
  }

  updateContainerPosition(x: number, y: number) {}

  getElementTransform(el: string) {
    let result = $(el).css('transform');

    if (result) return result.replace(/[^0-9\-.,]/g, '').split(',');

    return false;
  }

  updateFormats(formatInput: BaseFormatInputModel) {
    let numberInput = formatInput as FormatNumberInputModel;
    let colorPickerInput = formatInput as FormatColorPickerInputModel;
    let checkboxInput = formatInput as FormatCheckboxInputModel;
    var results = this.getElementTransform('#box-' + this.element.id);

    var x = this.element.format.formatInputs.x.value,
      y = this.element.format.formatInputs.y.value;

    if (results) {
      if (results.length > 1) {
        x = results[12] || results[4];
        y = results[13] || results[5];
      }
    }

    switch (formatInput.inputId) {
      case PPtFormatInputsEnum.x:
        this.element.format.formatInputs.x.value = numberInput.value;

        $('#box-' + this.element.id).css(
          'transform',
          `translate3d(${numberInput.value}px, ${y}px, 0px) rotate(${this.element.format.formatInputs.rotate.value}deg)`
        );

        break;
      case PPtFormatInputsEnum.y:
        this.element.format.formatInputs.y.value = numberInput.value;

        $('#box-' + this.element.id).css(
          'transform',
          `translate3d(${x}px, ${numberInput.value}px, 0px) rotate(${this.element.format.formatInputs.rotate.value}deg)`
        );
        break;
      case PPtFormatInputsEnum.strokeColor:
        if (colorPickerInput.value) {
          this.elementContainer.nativeElement.style.border = `3px solid ${colorPickerInput.value}`;
          // this.element.stroke = '3px solid' + colorPickerInput.value;
        } else this.element.stroke = '3px solid transparent';
        break;
      case PPtFormatInputsEnum.isStroke:
        if (checkboxInput.value) {
          this.element.stroke = '3px solid #000000';
          this.elementContainer.nativeElement.style.border = `${this.element.stroke}`;
          colorPickerInput.value = 'black';
        }

        break;
      case PPtFormatInputsEnum.width:
        this.elementContainer.nativeElement.style.width = `${numberInput.value}px`;
        break;
      case PPtFormatInputsEnum.rotate:
        this.element.format.formatInputs.rotate.value = numberInput.value;

        $('#box-' + this.element.id).css(
          'transform',
          `translate3d(${this.element.format.formatInputs.x.value}px, ${this.element.format.formatInputs.y.value}px, 0px) rotate(${numberInput.value}deg)`
        );
        break;
      case PPtFormatInputsEnum.height:
        this.elementContainer.nativeElement.style.height = `${numberInput.value}px`;
        break;

      default:
        break;
    }
  }

  setElementNaturalSize() {
    this.element.format.formatInputs.width.value = this.element.format.formatInputs.naturalWidth as any;
    this.element.format.formatInputs.height.value = this.element.format.formatInputs.naturalHeight as any;

    this.updateFormats(this.element.format.formatInputs.width);
    this.updateFormats(this.element.format.formatInputs.height);
  }
  //İptal Edildi
  // rotate(rotate: number) {
  //   let container = $('#box-' + this.element.id);
  //   // For webkit browsers: e.g. Chrome
  //   container.css({ WebkitTransform: 'rotate(-' + rotate + 'deg)' });
  //   // For Mozilla browser: e.g. Firefox
  //   container.css({ '-moz-transform': 'rotate(-' + rotate + 'deg)' });
  // }

  ngAfterViewInit() {
    let _this = this;

    $('#box-' + this.element.id).resizable({
      handles: 'all',
      resize: function(e: any, ui: any) {
        this.dragDropStatus = false;
      },
      stop: function(e: any, ui: any) {
        let width = ui.size.width;
        let height = ui.size.height;

        _this.element.format.formatInputs.width.value = width;
        if (typeof _this.element.format.formatInputs.height == 'string') {
          _this.element.format.formatInputs.height = new FormatNumberInputModel();
        }
        _this.element.format.formatInputs.height.value = height;

        _this.element.format.formatInputs.width.update = true;
        _this.element.format.formatInputs.height.update = true;

        _this.element.onFormatChange.next([
          {
            formatInput: _this.element.format.formatInputs.width,
            updateComponent: false,
            addToHistory: true
          },
          {
            formatInput: _this.element.format.formatInputs.height,
            updateComponent: false,
            addToHistory: true
          }
        ]);

        _this.pPtBuilderService.setSlidePreview();
      }
    });

    setTimeout(() => {
      this.pPtBuilderService.setSlidePreview();
    }, 1000);

    $('.ui-icon-gripsmall-diagonal-se').remove();

    this.elementBox = $('#box-' + this.element.id);

    this.offset = this.elementBox.offset();

    this.updateFormats(this.element.format.formatInputs.x);
    this.updateFormats(this.element.format.formatInputs.y);
    this.updateFormats(this.element.format.formatInputs.width);
    this.updateFormats(this.element.format.formatInputs.height);

    $('#box-' + this.element.id).css(
      'transform',
      `translate3d(${this.element.format.formatInputs.x.value}px, ${this.element.format.formatInputs.y.value}px, 0px) rotate(${this.element.format.formatInputs.rotate.value}deg)`
    );
  }

  elementMouseDown(e: MouseEvent) {
    let el = $('.base-element-container');
    let borderWidth = parseInt(el.css('borderLeftWidth'));
    let elWidth = el.width();
    let elHeight = el.height();

    let status = false;

    if (e.offsetX <= borderWidth) {
      status = true;
    } else if (e.offsetX >= elWidth - borderWidth) {
      status = true;
    } else if (e.offsetY <= borderWidth) {
      status = true;
    } else if (e.offsetY >= elHeight - borderWidth) {
      status = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.rotateMouseMove(e);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e: MouseEvent) {
    this.rotateStatus = false;
  }

  rotateMouseDown(e: MouseEvent) {
    let _this = this;
    _this.rotateStatus = true;
  }

  rotateMouseMove(e: MouseEvent) {
    let _this = this;
    if (_this.rotateStatus) {
      _this.dotted = $('.dotted');

      // $('#box-' + _this.element.id).css('transform', `translate3d(${_this.element.format.formatInputs.x.value}px, ${_this.element.format.formatInputs.y.value}px, 0px) rotate(${_this.element.format.formatInputs.rotate.value}deg)`);

      var center_x = _this.offset.left + _this.element.format.formatInputs.x.value + _this.elementBox.width() / 2;
      var center_y = _this.offset.top + _this.element.format.formatInputs.y.value + _this.elementBox.height() / 2;
      var mouse_x = e.pageX;
      var mouse_y = e.pageY;
      var radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);

      var degree = radians * (180 / Math.PI) * -1 + 180;
      _this.elementBox.css('-moz-transform', 'rotate(' + degree + 'deg)');
      _this.elementBox.css('-webkit-transform', 'rotate(' + degree + 'deg)');
      _this.elementBox.css('-o-transform', 'rotate(' + degree + 'deg)');
      _this.elementBox.css('-ms-transform', 'rotate(' + degree + 'deg)');

      $('#box-' + _this.element.id).css(
        'transform',
        `translate3d(${_this.element.format.formatInputs.x.value}px, ${_this.element.format.formatInputs.y.value}px, 0px) rotate(${_this.element.format.formatInputs.rotate.value}deg)`
      );

      _this.element.format.formatInputs.rotate.value = degree;
    }
  }

  updateDragDropStatus(status: boolean = false) {
    this.dragDropStatus = status;
  }

  dragEnded(event: CdkDragEnd) {
    this.newPositionX = this.newPositionXTemp;
    this.newPositionY = this.newPositionYTemp;

    var childPos = $('#box-' + this.element.id).offset();
    var parentPos = $('#box-' + this.element.id)
      .closest('.element-list-container')
      .offset();

    if (childPos && parentPos) {
      let x = +(childPos.left - parentPos.left).toFixed(0);
      let y = +(childPos.top - parentPos.top).toFixed(0);

      this.element.format.formatInputs.x.value = x;
      this.element.format.formatInputs.y.value = y;

      this.element.onFormatChange.next([
        {
          formatInput: this.element.format.formatInputs.x,
          updateComponent: false,
          addToHistory: true
        },
        {
          formatInput: this.element.format.formatInputs.y,
          updateComponent: false,
          addToHistory: true
        }
      ]);
    }

    this.pPtBuilderService.setSlidePreview();
    $('#box-' + this.element.id).css(
      'transform',
      `translate3d(${this.element.format.formatInputs.x.value}px, ${this.element.format.formatInputs.y.value}px, 0px) rotate(${this.element.format.formatInputs.rotate.value}deg)`
    );
  }

  dragMoved(event: CdkDragMove) {
    this.newPositionX = this.newPositionXTemp;
    this.newPositionY = this.newPositionYTemp;

    var childPos = $('#box-' + this.element.id).offset();
    var parentPos = $('#box-' + this.element.id)
      .closest('.element-list-container')
      .offset();

    if (childPos && parentPos) {
      let x = +(childPos.left - parentPos.left).toFixed(0);
      let y = +(childPos.top - parentPos.top).toFixed(0);

      var matrix = $('#box-' + this.element.id)
        .css('transform')
        .replace(/[^0-9\-.,]/g, '')
        .split(',');
      var a = matrix[12] || matrix[4];
      var b = matrix[13] || matrix[5];

      if (a && b) {
        $('#box-' + this.element.id).css(
          'transform',
          `translate3d(${a}px, ${b}px, 0px) rotate(${this.element.format.formatInputs.rotate.value}deg)`
        );
      }
    }
  }

  dragStart(event: CdkDragStart) {
    console.log(this.element.format.formatInputs.rotate.value);
  }

  elementResized() {}

  dragDropStatusChange() {
    this.dragDropStatus = false;
  }

  highlightElement(id: number) {
    // this.element.z = 999;
    this.highlightChange.emit(id);
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.pPtBuilderService.setSlidePreview();
    }, 1000);
  }
}
