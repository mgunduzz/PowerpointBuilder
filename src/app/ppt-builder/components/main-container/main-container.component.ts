import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { PptElementModel, PPtElementEnum, ChartFormatModel, BaseFormatInputModel } from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'ppt-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainer implements OnInit, OnDestroy {
  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {}

  closeResult: string;
  activeElement: PptElementModel = undefined;
  selectTab: number = 1;
  tableBox: Array<any>;

  openModal(content: any, className: string = '') {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: className }).result.then(
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

    this._pPtBuilderService.pptElementsSubscription.next({ elementList: [chartEl], dontAddToSlide: false });
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
    console.log(e);
  }

  onTableBoxOver() {}

  onTableBoxHover(box: any) {
    let index = box.index + 1;
    let row = Math.ceil(index / 8);
    let col = index % 8;

    if (col == 0) col = 8;

    document.getElementsByClassName('selected-box-index')[0].innerHTML = Math.ceil(row) + ' x ' + col;

    this.tableBox.forEach(item => (item.isActive = false));

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        this.tableBox[i * 8 + j].isActive = true;
      }
    }
  }

  onBoxClick(box: any) {
    let index = box.index + 1;
    let row = Math.ceil(index / 8);
    let col = index % 8;

    if (col == 0) col = 8;

    let tableEl = this._pPtBuilderService.createTableElement('35%', '35%', row, col);
    this._pPtBuilderService.pptElementsSubscription.next({ elementList: [tableEl], dontAddToSlide: false });
    this.modalService.dismissAll();
  }

  ngOnInit() {
    let startNumber = 0;
    this.tableBox = Array(64)
      .fill({})
      .map((item, index) => {
        return { index: index, isActive: false };
      });
  }

  ngOnDestroy() {}
}
