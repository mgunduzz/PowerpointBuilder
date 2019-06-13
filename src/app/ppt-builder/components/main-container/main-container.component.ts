import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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

    this.activeElement = item;
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
