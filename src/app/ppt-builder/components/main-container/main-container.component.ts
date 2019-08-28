import { Component, OnInit, OnChanges, OnDestroy, Input, HostListener } from '@angular/core';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import {
  PptTableElementModel,
  PptBaseChartElementModel,
  PptBaseElementModel,
  ChartTypeEnum,
  PPtElementEnum
} from '@app/ppt-builder/model';
import { ShapeTypeEnum } from '@app/ppt-builder/model';
declare var $: any;

@Component({
  selector: 'ppt-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainer implements OnInit, OnDestroy, OnChanges {
  constructor(private _pPtBuilderService: PPtBuilderService, private modalService: NgbModal) {
    this.activeElSubscription = this._pPtBuilderService.activeElementSubscription.subscribe(el => {
      if (el) {
        this.activeElement = el;
        this.isElementHasData = el instanceof PptTableElementModel || el instanceof PptBaseChartElementModel;
        this._pPtBuilderService.updateActiveElementSubscription();
      } else {
        this.activeElement = undefined;
        this.activeElementTemplates = [];
        this.activeTab = 0;
      }
    });

    this.activeElementTemplatesSubscription = this._pPtBuilderService.activeElementTemplatesSubscription.subscribe(
      res => {
        if (res) {
          this.activeElementTemplates = res;
        }
      }
    );
  }

  URL: any;
  closeResult: string;
  activeElement: PptBaseElementModel = undefined;
  selectTab: number = 1;
  tableBox: Array<any>;
  uploader: FileUploader = new FileUploader({ url: this.URL });
  chartType = ChartTypeEnum;
  shapeType = ShapeTypeEnum;
  activeElSubscription: Subscription;
  activeElementTemplatesSubscription: Subscription;
  isElementHasData: boolean = false;
  modalRef: NgbModalRef;
  activeTab: number = 0;
  templateName = 'test';
  activeElementTemplates: Array<any> = new Array<any>();
  document: Document;
  elem: any;
  isFullScreen: boolean = false;

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  // onExport() {
  //   this._pPtBuilderService.export();
  // }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      if (this._pPtBuilderService.activeElement)
        this._pPtBuilderService.deleteElement(this._pPtBuilderService.activeElement.id);
      else {
        if (this._pPtBuilderService.activeSlide.isHovered)
          this._pPtBuilderService.deleteSlide(this._pPtBuilderService.activeSlide);
      }
    }
  }

  onSaveAsTemplate(templateName: string) {
    if (templateName.length >= 3) {
      this._pPtBuilderService.saveActiveElementAsTemplate(templateName);
    }
  }

  onMainContainerClick(ev: MouseEvent) {
    this._pPtBuilderService.setActiveElement(undefined);
    this._pPtBuilderService.elementListAsync.value.forEach(item => (item.isActive = false));
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
    let textEl = this._pPtBuilderService.generateElement(PPtElementEnum.Text, {
      x: '35',
      y: '35',
      text: 'Metin Giriniz'
    });
  }

  closeModal() {
    this.modalRef.dismiss();
  }

  onAddImageElement() {
    let imageEl = this._pPtBuilderService.generateElement(PPtElementEnum.Image, { x: '0', y: '0', url: this.URL });
  }

  onAddChart(type: ChartTypeEnum) {
    let chartEl = this._pPtBuilderService.generateElement(PPtElementEnum.Chart, { x: '35', y: '35', type });

    this.closeModal();
  }

  onAddShape(type: ShapeTypeEnum) {
    let shapeEl = this._pPtBuilderService.generateElement(PPtElementEnum.Shape, { x: '35', y: '35', type });

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

    let tableEl = this._pPtBuilderService.generateElement(PPtElementEnum.Table, { x: '35', y: '35', row, col });

    this.modalService.dismissAll();
  }

  ngOnInit() {
    let startNumber = 0;
    this.tableBox = Array(64)
      .fill({})
      .map((item, index) => {
        return { index: index, isActive: false };
      });

    this.elem = document.documentElement;
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

      fileReader.onload = () => {
        // when file has loaded
        var img = new Image();

        img.onload = () => {};
      };

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

  onElementTemplateClick(template: any) {
    this._pPtBuilderService.setActiveElementTemplate(template);
  }

  @HostListener('window:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 122) {
      return false;
    }
    if (event.keyCode === 27) {
      this.isFullScreen = false;
      $('.full-screen-close').open();
    }
  }

  @HostListener('document:fullscreenchange', ['closeFullScreen'])
  @HostListener('document:webkitfullscreenchange', ['closeFullScreen'])
  @HostListener('document:mozfullscreenchange', ['closeFullScreen'])
  @HostListener('document:MSFullscreenChange', ['closeFullScreen'])
  closeFullScreen() {
    if (!document['webkitIsFullScreen'] && !document['mozFullScreen'] && !document['msFullscreenElement']) {
      $('.full-screen-close').show();
      this._pPtBuilderService.stopInterval();

      $('.base-element-container').addClass('active');
      this.isFullScreen = false;
    }
  }

  toggleFullscreen() {
    if (document['webkitIsFullScreen']) {
      this.exitFullscreen();
    } else {
      this.openFullscreen();
    }
  }

  openFullscreen() {
    $('.full-screen-close').hide();
    $('.base-element-container').removeClass('active');
    this.isFullScreen = true;
    this._pPtBuilderService.startSlide();

    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  private exitFullscreen() {
    this.isFullScreen = false;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['mozCancelFullScreen']) {
      /* Firefox */
      document['mozCancelFullScreen()'];
    } else if (document['webkitExitFullscreen']) {
      /* Chrome, Safari and Opera */
      document['webkitExitFullscreen()'];
    } else if (document['msExitFullscreen']) {
      /* IE/Edge */
      document['msExitFullscreen()'];
    }
  }

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
    this.activeElementTemplatesSubscription.unsubscribe();
  }

  ngOnChanges() {}
}
