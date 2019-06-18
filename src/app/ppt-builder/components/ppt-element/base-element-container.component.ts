import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import { PPtElementEnum, PptElementModel } from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';

@Component({
  selector: 'ppt-base-element',
  templateUrl: './base-element-container.component.html',
  styleUrls: ['./base-element-container.component.scss']
})
export class BaseElementContainer implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  @Input('type') type: number;

  version: string = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  elementTypes: any = {};

  constructor() {
    this.elementTypes.TABLE = PPtElementEnum.Table;
    this.elementTypes.CHART = PPtElementEnum.Chart;
    this.elementTypes.TEXT = PPtElementEnum.Text;
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
