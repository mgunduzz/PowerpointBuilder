import { Component, OnInit, OnDestroy, Input, AfterViewInit, HostListener, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import { PPtElementEnum, PptElementModel, FormatNumberInputModel, PPtFormatInputsEnum } from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

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
  version: string = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  dragDropStatus: boolean = true;
  newPositionXTemp: string = '0px';
  newPositionYTemp: string = '0px';
  newPositionX: string = '0px';
  newPositionY: string = '0px';
  elementTypes: any = {};
  elementId: number;
  elHighlight: boolean = false;

  @Input('isItemActive') isItemActive: boolean;

  constructor() {
    this.elementTypes.TABLE = PPtElementEnum.Table;
    this.elementTypes.CHART = PPtElementEnum.Chart;
    this.elementTypes.TEXT = PPtElementEnum.Text;
    this.elementTypes.IMAGE = PPtElementEnum.Image;
  }

  dragEnded(event: CdkDragEnd) {
    this.newPositionX = this.newPositionXTemp;
    this.newPositionY = this.newPositionYTemp;
  }

  dragMoved(event: CdkDragMove) {
    let x = (event.event as any).layerX - (event.event as any).offsetX;
    let y = (event.event as any).layerY - (event.event as any).offsetY;

    this.element.format.formatInputs.x.value = x;
    this.element.format.formatInputs.y.value = y;

    this.newPositionXTemp = x + 'px';
    this.newPositionYTemp = y + 'px';
  }

  ngOnInit() {
    this.element.onFormatChange.subscribe(res => {
      let numberInput = res as FormatNumberInputModel;

      switch (res.inputId) {
        case PPtFormatInputsEnum.width:
          break;

        default:
          break;
      }
    });
  }

  ngAfterViewInit() {
    $('#box-' + this.element.id).resizable({ handles: 'all' });
  }

  dragDropStatusChange() {
    this.dragDropStatus = false;
  }
  dragDropStatusChange1() {
    this.dragDropStatus = true;
  }

  highlightElement(id: number) {
    this.element.z = 999;
    this.highlightChange.emit(id);
  }

  ngOnDestroy() {}
}
