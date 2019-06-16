import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {
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
  }

  ngOnInit() {
    if (this.slideList.length == 0) {
      this.slideList.push({ elementList: [], isActive: true });
    }
  }

  getActiveSlide(): SlideModel {
    return this.slideList.filter(item => item.isActive)[0];
  }

  setActiveSlide(slide: SlideModel) {
    this.slideList.forEach(item => (item.isActive = false));
    slide.isActive = true;
    this._pPtBuilderService.pptElementsSubscription.next({
      elementList: slide.elementList,
      isClear: true,
      dontAddToSlide: true
    });
  }

  addSlide() {
    this.slideList.push({ elementList: [], isActive: true });
    this.setActiveSlide(this.slideList[this.slideList.length - 1]);
  }

  onSlideClick(slide: SlideModel) {
    this.setActiveSlide(slide);
  }

  ngOnDestroy() {}
}
