import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import { PPtElementEnum, PptElementModel } from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';

@Component({
  selector: 'ppt-format',
  templateUrl: './ppt-format.component.html',
  styleUrls: ['./ppt-format.component.scss']
})
export class PptFormatCompontent implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  footerMessageChecked: boolean = false;
  footerDateChecked: boolean = false;
  chartTitleChecked: boolean = false;
  model: {} = {};

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
