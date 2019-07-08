import { Component, OnInit, OnDestroy, Input, HostListener, OnChanges, AfterViewInit } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel, PPtElementEnum, ChartFormatModel, BaseFormatInputModel } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'ppt-element-container',
  templateUrl: './ppt-element-container.component.html',
  styleUrls: ['./ppt-element-container.component.scss']
})
export class PptElementContainer implements OnInit, OnDestroy, OnChanges {
  elementList: any[] = [];
  elementSub: Subscription;
  activeElementSub: Subscription;
  activeElement: PptElementModel;
  elementId: number = 1;
  elId: number;
  isMoving: boolean = false;

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    let item = this.elementList.find(o => o.isActive);

    if (item != null)
      if (item.isActive == true) {
        this.isMoving = true;
        item.isActive = true;
      } else {
        this.isMoving = false;
        item.isActive = false;
      }
  }

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

    if (this._pPtBuilderService.activeElement) {
      if (this._pPtBuilderService.activeElement.id != item.id) this._pPtBuilderService.setActiveElement(item);
    } else this._pPtBuilderService.setActiveElement(item);

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

  ngOnChanges(): void {
    // $(".element-list-container").get(0), 0, 0, 100, 100, function (data : any) {
    //   // in the data variable there is the base64 image
    //   // exmaple for displaying the image in an <img>
    //   $(".slide-preview").attr("src", "data:image/png;base64," + data);
    // }
  }
}
