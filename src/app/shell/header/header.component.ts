import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, CredentialsService, I18nService } from '@app/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuHidden = true;
  modalRef: NgbModalRef;
  closeResult: string;
  URL: any;
  uploader: FileUploader = new FileUploader({ url: this.URL });
  undoRedoSub: Subscription;

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private i18nService: I18nService,
    private modalService: NgbModal,
    private _pptBuilderService: PPtBuilderService
  ) {}

  canUndo: boolean = false;
  canRedo: boolean = false;

  ngOnInit() {
    this.undoRedoSub = this._pptBuilderService.undoRedoIndexSubscription.subscribe(index => {
      if (index) {
        this.canUndo = index > 0;
        this.canRedo = index < this._pptBuilderService.activeSlide.formatChangeHistory.length - 1;
      }
    });
  }

  ngOnDestroy() {
    this.undoRedoSub.unsubscribe();
  }

  undoChanges() {
    this._pptBuilderService.undoActiveSlideFormatChange();
  }

  redoChanges() {
    this._pptBuilderService.redoActiveSlideFormatChange();
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
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

  onExport() {
    this._pptBuilderService.export();
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
        let fileResult: any = fileReader.result;

        this.modalRef.dismiss();

        this._pptBuilderService.jsonStringConvert(fileResult);
      };

      fileReader.readAsText(val._file);
    });
  }

  saveAsTemplate() {
    this._pptBuilderService.saveAsTemplate();
  }
}
