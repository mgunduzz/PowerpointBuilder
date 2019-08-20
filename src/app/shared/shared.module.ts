import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from '@app/material-module';
import { DndModule } from 'ngx-drag-drop';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [CommonModule, FileUploadModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent, FileUploadModule]
})
export class SharedModule {}
