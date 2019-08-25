import { Component, OnInit, OnDestroy, Input, HostListener, OnChanges, AfterViewInit } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import {
  PptElementModel,
  PPtElementEnum,
  ChartFormatModel,
  BaseFormatInputModel,
  SlideModel
} from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
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
  elementDeleteSubscription: Subscription;
  activeSlideSub: Subscription;
  activeElement: PptElementModel;
  activeSlide: SlideModel;
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
    this.activeElementSub = this._pPtBuilderService.activeElementSubscription.subscribe(el => {
      this.activeElement = el;
    });

    this.activeSlideSub = this._pPtBuilderService.activeSlideSubscription.subscribe(res => {
      this.activeSlide = res;
    });

    this.elementDeleteSubscription = this._pPtBuilderService.pptElementDeleteSubscription.subscribe(elId => {
      if (elId) {
        let index = this.elementList.findIndex(item => item.id == elId);

        if (index >= 0) this.elementList.splice(index, 1);
      }
    });
  }

  changeElementpPriorityEmitter(itemZIndez: { isLevelUp: boolean; id: number; zIndex: number }) {
    let indexElemetTemp = this.elementList.findIndex(o => o.id == itemZIndez.id && o.z == itemZIndez.zIndex);

    if (indexElemetTemp > -1) {
      if (itemZIndez.isLevelUp) {
        let indexLevelUp = this.elementList.findIndex(o => o.z == itemZIndez.zIndex + 100);
        this.elementList[indexLevelUp].tempZ = this.elementList[indexLevelUp].z =
          this.elementList[indexLevelUp].z - 100;
        this.elementList[indexElemetTemp].tempZ = this.elementList[indexElemetTemp].z =
          this.elementList[indexElemetTemp].z + 100;
      } else {
        let indexLevelUp = this.elementList.findIndex(o => o.z == itemZIndez.zIndex - 100);
        this.elementList[indexLevelUp].tempZ = this.elementList[indexLevelUp].z =
          this.elementList[indexLevelUp].z + 100;
        this.elementList[indexElemetTemp].tempZ = this.elementList[indexElemetTemp].z =
          this.elementList[indexElemetTemp].z - 100;
      }
    }
  }

  onItemActiveChanged(res: any) {
    let elId = res.id;
    let isActive = res.isActive;

    if (isActive && this.elementList.length > 1) {
      this.elementList.forEach(item => {
        if (item.id != elId) item.isActive = false;
      });
    }

    console.log(
      this.elementList.map(item => {
        return { id: item.id, isActive: item.isActive };
      })
    );
  }

  onElementClick(item: PptElementModel) {
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

  // @HostListener('document:keyup', ['$event'])
  // handleDeleteKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'Delete') {
  //     if (this.activeElement) this.deleteElement(this.activeElement.id);
  //   }
  // }

  onElementListClick() {}

  deleteElement(id: number) {
    this._pPtBuilderService.deleteElement(id);
  }

  changeHighlight(elId: PptElementModel) {
    // this.elementList.forEach(element => {
    //   if (elId == element.id) {
    //     element.z = 999;
    //   } else {
    //     // element.z = 0;
    //   }
    // });
  }

  elementListAsync: BehaviorSubject<Array<PptElementModel>>;

  ngOnInit() {
    this.elementListAsync = this._pPtBuilderService.elementListAsync;
  }

  ngOnDestroy() {
    this.elementSub.unsubscribe();
    this.activeElementSub.unsubscribe();
    this.activeSlideSub.unsubscribe();
    this.elementDeleteSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    // $(".element-list-container").get(0), 0, 0, 100, 100, function (data : any) {
    //   // in the data variable there is the base64 image
    //   // exmaple for displaying the image in an <img>
    //   $(".slide-preview").attr("src", "data:image/png;base64," + data);
    // }
  }
}
