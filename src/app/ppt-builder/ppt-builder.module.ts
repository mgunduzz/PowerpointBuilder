import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from '@app/material-module';
import { SharedModule } from '@app/shared';
import { PPtBuilderService } from './service/ppt-builder.service';
import { BaseElementContainer } from './ppt-elements/base-element-container.component';

@NgModule({
  imports: [CommonModule, DemoMaterialModule],
  declarations: [BaseElementContainer],
  exports: [BaseElementContainer],
  providers: [PPtBuilderService]
})
export class PptBuilderModule {}
