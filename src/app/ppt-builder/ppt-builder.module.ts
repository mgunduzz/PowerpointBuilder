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
import { MainContainer as PptMainContainer } from './components/main-container/main-container.component';
import { PptElementContainer } from './components/ppt-element-container/ppt-element-container.component';
import { PptSlideList } from './components/ppt-slide-list/ppt-slide-list.component';
import { TableElement } from './components/ppt-element/elements/table/table-element.component';
import { TextElement } from './components/ppt-element/elements/text/text-element.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PptCheckBoxInput } from './components/ppt-format/inputs/checkbox/checkbox-input.component';
import { PptTextInput } from './components/ppt-format/inputs/textInput/text-input.component';
import { PptNumberInput } from './components/ppt-format/inputs/numberInput/number-input.component';
import { ContentEditableFormDirective } from './directives/content-editable-form.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { PptColorPickerInput } from './components/ppt-format/inputs/colorPickerInput/color-picker-input.component';
import { ImageComponent } from './components/ppt-element/elements/image/image.component';

@NgModule({
  imports: [CommonModule, DemoMaterialModule, FormsModule, FileUploadModule, ColorPickerModule],
  declarations: [
    BaseElementContainer,
    ChartElement,
    PptFormatCompontent,
    PptMainContainer,
    PptCheckBoxInput,
    PptElementContainer,
    PptSlideList,
    TableElement,
    TextElement,
    PptTextInput,
    PptNumberInput,
    ContentEditableFormDirective,
    PptColorPickerInput,
    ImageComponent
  ],
  exports: [
    BaseElementContainer,
    PptFormatCompontent,
    PptMainContainer,
    PptCheckBoxInput,
    PptElementContainer,
    PptSlideList,
    TableElement,
    TextElement,
    PptTextInput,
    PptNumberInput,
    PptColorPickerInput
  ],
  providers: [PPtBuilderService]
})
export class PptBuilderModule {}
