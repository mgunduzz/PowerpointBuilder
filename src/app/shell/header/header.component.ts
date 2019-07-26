import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, CredentialsService, I18nService } from '@app/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { PPtBuilderService } from '@app/ppt-builder/service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  modalRef: NgbModalRef;
  closeResult: string;
  URL: any;
  uploader: FileUploader = new FileUploader({ url: this.URL });

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
    private pptBuilderService: PPtBuilderService,
    private _pptBuilderService: PPtBuilderService
  ) {}

  ngOnInit() {}

  undoChanges() {
    this.pptBuilderService.undoActiveSlideFormatChange();
  }

  redoChanges() {
    this.pptBuilderService.redoActiveSlideFormatChange();
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
    this.pptBuilderService.export();
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
        let imageData: any = fileReader.result;
        let rawData = imageData.split('base64,');
        if (rawData.length > 1) {
          rawData = rawData[1];
          this.uploader.clearQueue();
          this.URL = imageData;

          this.modalService.dismissAll();
        }
      };

      fileReader.readAsDataURL(val._file);
    });
  }
}
