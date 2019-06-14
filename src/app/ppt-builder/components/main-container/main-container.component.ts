import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel, PPtElementEnum, ChartFormatModel, BaseFormatInputModel } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

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
  }

  onAddChart() {
    this.onAddBarChart();
  }

  onAddBarChart() {
    let chartEl: PptElementModel = this._pPtBuilderService.createChartElement('35%', '35%');

    this.done.push(chartEl);
  }

  onElementClick(item: PptElementModel) {
    this._pPtBuilderService.activeElementSubscription.next(item);
    this._pPtBuilderService.setActiveElement(item);
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
