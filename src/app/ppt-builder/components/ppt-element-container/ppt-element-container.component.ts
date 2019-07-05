import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
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
  activeElementSub: Subscription;
  activeElement: PptElementModel;
  elementId: number = 1;
  elId: number;

  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {
    this.activeElementSub = this._pPtBuilderService.activeElementSubscription.subscribe(res => {
      this.activeElement = res;
    });

    this.elementSub = this._pPtBuilderService.pptElementsSubscription.subscribe(res => {
      if (res) {
        res.elementList.forEach(item => {
          item.id = this.elementId;
          this.elementId++;
        });

        if (res.isClear) this.elementList = [];
        this.elementList.push(...res.elementList);
      }
    });
  }

  onElementClick(item: PptElementModel) {
    // this.elementList.forEach(o => {
    //   item.isActive = false;
    // })
    this.elementList.forEach(element => {
      if (element.id == item.id) {
        element.isActive = true;
      } else {
        element.isActive = false;
      }
    });

    this._pPtBuilderService.setActiveElement(item);

    this.elId = item.id;
  }
  onNoneActiveElement() {
    this.elementList.forEach(element => {
      element.isActive = false;
    });
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteElement(this.activeElement.id);
    }
  }
  deleteElement(id: number) {
    this.elementList = this.elementList.filter(item => item.id !== id);
    this._pPtBuilderService.deleteElement(id);
  }

  changeHighlight(elId: PptElementModel) {
    this.elementList.forEach(element => {
      if (elId == element.id) {
        element.z = 999;
      } else {
        element.z = 0;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.elementSub.unsubscribe();
    this.activeElementSub.unsubscribe();
  }
}
