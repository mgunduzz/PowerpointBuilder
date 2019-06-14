import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel, PPtElementEnum } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ppt-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainer implements OnInit, OnDestroy {
  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {}

  closeResult: string;
  pptElementList = this._pPtBuilderService.pptElements;
  done: any[] = [];
  activeElement: PptElementModel = undefined;
  selectTab: number = 1;

  drop(event: CdkDragDrop<string[]>) {
    var item = event.item.data;
    item.x = '50%';
    item.y = '50%';

    console.log(item);

    this.done.push(item);

    this._pPtBuilderService.activeElementSubscription.next(item);
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    var item = this.pptElementList.filter(item => item.type == PPtElementEnum.Chart)[0];

    item.x = '35%';
    item.y = '35%';

    console.log(item);

    this.done.push(item);

    this._pPtBuilderService.activeElementSubscription.next(item);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selectTabType(e: any) {
    debugger;
    console.log(e);
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
