import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from '@app/material-module';
import { SharedModule } from '@app/shared';
import { PPtBuilderService } from './service/ppt-builder.service';
import { BaseElementContainer } from './components/ppt-element/base-element-container.component';
import { ChartElement } from './components/ppt-element/elements/chart/chart-element.component';
import { PptFormatCompontent } from './components/ppt-format/ppt-format.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, DemoMaterialModule, FormsModule],
  declarations: [BaseElementContainer, ChartElement, PptFormatCompontent],
  exports: [BaseElementContainer, PptFormatCompontent],
  providers: [PPtBuilderService]
})
export class PptBuilderModule {}
