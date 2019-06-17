import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel, PPtElementEnum, ChartFormatModel, BaseFormatInputModel } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ppt-element-container',
  templateUrl: './ppt-element-container.component.html',
  styleUrls: ['./ppt-element-container.component.scss']
})
export class PptElementContainer implements OnInit, OnDestroy {
  elementList: any[] = [];
  elementSub: Subscription;

  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {
    this.elementSub = this._pPtBuilderService.pptElementsSubscription.subscribe(res => {
      if (res) {
        if (res.isClear) this.elementList = [];
        this.elementList.push(...res.elementList);
      }
    });
  }

  onElementClick(item: PptElementModel) {
    this._pPtBuilderService.setActiveElement(item);
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
