import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import { PPtElementEnum, PptElementModel } from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-format',
  templateUrl: './ppt-format.component.html',
  styleUrls: ['./ppt-format.component.scss']
})
export class PptFormatCompontent implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  activeElSubscription: Subscription;

  constructor(private pPtBuilderService: PPtBuilderService) {
    this.activeElSubscription = this.pPtBuilderService.activeElementSubscription.subscribe(el => {
      this.element = el;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
  }
}
