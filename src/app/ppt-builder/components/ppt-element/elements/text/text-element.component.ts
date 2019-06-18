import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel,
  PptTextElementModel,
  FormatTextInputModel,
  FormatNumberInputModel
} from '@app/ppt-builder/model';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'ppt-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElement implements OnInit, OnDestroy {
  @Input('element') element: PptTextElementModel;

  constructor() {}

  ngOnInit() {
    this.element.onFormatChange.subscribe((res: FormatTextInputModel) => {
      switch (res.inputId) {
        case PPtFormatInputsEnum.color:
          this.element.color = res.value;
          break;
        case PPtFormatInputsEnum.font:
          this.element.font = res.value;
          break;
        case PPtFormatInputsEnum.backgroundColor:
          this.element.backgroundColor = res.value;
          break;
        case PPtFormatInputsEnum.fontSize:
          this.element.fontSize = res.value + 'px';
          break;
        case PPtFormatInputsEnum.isItalic:
          if (res.value as any) {
            this.element.fontStyle = 'italic';
          } else {
            this.element.fontStyle = 'unset';
          }
          break;
        case PPtFormatInputsEnum.isBold:
          if (res.value as any) {
            this.element.fontWeigth = 600;
          } else {
            this.element.fontWeigth = 100;
          }
          break;
          break;
        default:
          break;
      }
    });
  }
  ngOnDestroy() {}
}
