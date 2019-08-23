import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
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
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ppt-slide-list',
  templateUrl: './ppt-slide-list.component.html',
  styleUrls: ['./ppt-slide-list.component.scss']
})
export class PptSlideList implements OnInit, OnDestroy {
  slideList: SlideModel[] = [];
  elementSub: Subscription;
  slideListSub: Subscription;
  activeSlideSub: Subscription;
  activeSlide: SlideModel;

  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {
    this.activeSlideSub = this._pPtBuilderService.activeSlideSubscription.subscribe(res => {
      this.activeSlide = res;
    });
    this.elementSub = this._pPtBuilderService.pptElementsSubscription.subscribe(res => {
      if (res)
        if (!res.dontAddToSlide) {
          var activeSlide = this.getActiveSlide();
          if (activeSlide) {
            var els = this._pPtBuilderService.pptElementsSubscription.getValue();
            activeSlide.elementList.push(...res.elementList);
          }
        }
    });

    this.slideListSub = this._pPtBuilderService.slideListSubscription.subscribe(res => {
      if (res) {
        this.slideList = res;
      }
    });
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteSlide(this.activeSlide);
    }
  }

  ngOnInit() {}

  getActiveSlide(): SlideModel {
    return this.slideList.filter(item => item.isActive)[0];
  }

  deleteSlide(slide: SlideModel) {
    this._pPtBuilderService.deleteSlide(slide);
  }

  addSlide() {
    this._pPtBuilderService.addSlide();
  }

  onSlideClick(slide: SlideModel) {
    // this._pPtBuilderService.setActiveSlide(slide);
    debugger;

    if (this._pPtBuilderService.activeSlide) {
      if (this._pPtBuilderService.activeSlide.id != slide.id) {
        this._pPtBuilderService.setActiveSlide(slide);
      }
    } else {
      this._pPtBuilderService.setActiveSlide(slide);
    }
  }

  ngOnDestroy() {
    this.elementSub.unsubscribe();
    this.slideListSub.unsubscribe();
  }
}
