import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel, PPtElementEnum, ChartFormatModel, BaseFormatInputModel } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';

@Component({
  selector: 'ppt-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainer implements OnInit, OnDestroy {
  constructor(private _pPtBuilderService: PPtBuilderService) {}

  pptElementList = this._pPtBuilderService.pptElements;
  done: any[] = [];
  activeElement: PptElementModel = undefined;

  drop(event: CdkDragDrop<string[]>) {
    var item = event.item.data;
    item.x = '50%';
    item.y = '50%';

    console.log(item);

    this.done.push(item);

    this._pPtBuilderService.activeElementSubscription.next(item);
  }

  onElementClick(item: PptElementModel) {
    this._pPtBuilderService.setActiveElement(item);
  }

  onAddBarChart() {
    let chartEl: PptElementModel = this._pPtBuilderService.createChartElement('35%', '35%');

    this.done.push(chartEl);
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
