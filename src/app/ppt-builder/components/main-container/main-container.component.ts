import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import {
  PptElementModel,
  PPtElementEnum,
  ChartFormatModel,
  BaseFormatInputModel,
  ChartTypeEnum,
  ShapeFormatModel,
  ShapeTypeEnum,
  PptTableElementModel,
  PptShapeElementModel
} from '@app/ppt-builder/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'ppt-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainer implements OnInit, OnDestroy, OnChanges {
  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {}
  URL: any;

  closeResult: string;
  activeElement: PptElementModel = undefined;
  selectTab: number = 1;
  tableBox: Array<any>;
  uploader: FileUploader = new FileUploader({ url: this.URL });
  chartType = ChartTypeEnum;
  shapeType = ShapeTypeEnum;

  modalRef: NgbModalRef;

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onExport() {
    this._pPtBuilderService.export();
  }

  openModal(content: any, className: string = '', customSize: 'sm' | 'lg' = 'lg') {
    let size: 'sm' | 'lg' = 'lg';

    if (customSize.length > 0) {
      size = customSize;
    }
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: className,
      size: size
    });
    this.modalRef.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  createTextElemet() {
    let textEl = this._pPtBuilderService.createElement(PPtElementEnum.Text, {
      x: '35',
      y: '35',
      text: 'Metin Giriniz'
    });
  }

  closeModal() {
    this.modalRef.dismiss();
  }

  onAddImageElement() {
    let imageEl = this._pPtBuilderService.createElement(PPtElementEnum.Image, { x: '35', y: '35', url: this.URL });
  }

  onAddChart(type: ChartTypeEnum) {
    let chartEl = this._pPtBuilderService.createElement(PPtElementEnum.Chart, { x: '35', y: '35', type });

    this.closeModal();
  }

  onAddShape(type: ShapeTypeEnum) {
    let shapeEl = this._pPtBuilderService.createElement(PPtElementEnum.Shape, { x: '35', y: '35', type });

    this.closeModal();
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

    let tableEl = this._pPtBuilderService.createElement(PPtElementEnum.Table, { x: '35', y: '35', row, col });

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

  onFileSelect(ev: any) {
    this.onFileDropped();
  }

  onFileDrop(ev: any) {
    this.onFileDropped();
  }

  onFileDropped() {
    this.uploader.queue.forEach((val, i, array) => {
      let fileReader = new FileReader();
      fileReader.onloadend = e => {
        let imageData: any = fileReader.result;
        let rawData = imageData.split('base64,');
        if (rawData.length > 1) {
          rawData = rawData[1];
          this.uploader.clearQueue();
          this.URL = imageData;

          this.onAddImageElement();
          this.modalService.dismissAll();
        }
      };

      fileReader.readAsDataURL(val._file);
    });
  }

  ngOnDestroy() {}

  ngOnChanges() {}
}
