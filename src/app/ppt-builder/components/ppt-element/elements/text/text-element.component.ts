import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel,
  PptTextElementModel
} from '@app/ppt-builder/model';

@Component({
  selector: 'ppt-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElement implements OnInit, OnDestroy {
  @Input('element') element: PptTextElementModel;

  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}
