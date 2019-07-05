import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  ShapeTypeEnum
} from '@app/ppt-builder/model';
import { element } from '@angular/core/src/render3';
import { ContentEditableFormDirective } from '@app/ppt-builder/directives/content-editable-form.directive';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ppt-shape-element',
  templateUrl: './shape-element.component.html',
  styleUrls: ['./shape-element.component.scss'],
  providers: [ContentEditableFormDirective]
})
export class ShapeElement implements OnInit, OnDestroy {
  @Input('element') element: PptTextElementModel;

  shapeType: any = {};

  constructor(public contenteditable: ContentEditableFormDirective) {}

  ngOnInit() {
    this.shapeType.line = ShapeTypeEnum.line;
    this.shapeType.square = ShapeTypeEnum.square;

    this.element.onFormatChange.subscribe((res: any) => {
      let textInput = res as FormatTextInputModel;
      let dropdown = res as FormatDropdownInputModel;
      let checkbox = res as FormatCheckboxInputModel;
      let numberInput = res as FormatNumberInputModel;
      let colorPickerInput = res as FormatColorPickerInputModel;

      switch (res.inputId) {
        case PPtFormatInputsEnum.color:
          this.element.color = textInput.value;
          break;

        default:
          break;
      }
    });
  }
  ngOnDestroy() {}
}
