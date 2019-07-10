import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import {
  PptElementModel,
  PPtFormatInputsEnum,
  FormatCheckboxInputModel,
  PptTableElementModel,
  PptTextElementModel,
  FormatTextInputModel,
  FormatNumberInputModel,
  FormatDropdownInputModel,
  FormatColorPickerInputModel,
  FormatRadioButtonInputModel
} from '@app/ppt-builder/model';
import { element } from '@angular/core/src/render3';
import { ContentEditableFormDirective } from '@app/ppt-builder/directives/content-editable-form.directive';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ppt-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss'],
  providers: [ContentEditableFormDirective]
})
export class TextElement implements OnInit, OnDestroy {
  showText: boolean = true;
  @Input('element') element: PptTextElementModel;

  @ViewChild('insideElement') insideElement: ElementRef;
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: ElementRef) {
    const clickedInside = this.insideElement.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.showText = true;
    }
  }

  constructor(public contenteditable: ContentEditableFormDirective, private cdr: ChangeDetectorRef) {}

  elementTextChanged() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.element.onFormatChange.subscribe((res: any) => {
      let textInput = res as FormatTextInputModel;
      let dropdown = res as FormatDropdownInputModel;
      let checkbox = res as FormatCheckboxInputModel;
      let numberInput = res as FormatNumberInputModel;
      let colorPickerInput = res as FormatColorPickerInputModel;
      let radioInput = res as FormatRadioButtonInputModel;

      switch (res.inputId) {
        case PPtFormatInputsEnum.color:
          this.element.color = textInput.value;
          break;
        case PPtFormatInputsEnum.font:
          if (dropdown.selectedItemKey > 0) {
            let index = dropdown.value.findIndex(o => o.key == dropdown.selectedItemKey);
            if (index > -1) {
              this.element.font = dropdown.value[index].value;
            }
          }
          break;
        case PPtFormatInputsEnum.backgroundColor:
          this.element.backgroundColor = colorPickerInput.value;
          break;
        case PPtFormatInputsEnum.fontSize:
          this.element.fontSize = numberInput.value + 'px';
          break;
        case PPtFormatInputsEnum.isItalic:
          if (checkbox.value) {
            this.element.fontStyle = 'italic';
          } else {
            this.element.fontStyle = 'unset';
          }
          break;
        case PPtFormatInputsEnum.isStroke:
          if (checkbox.value) {
            this.element.stroke = '4px solid red ';
          } else this.element.stroke = '5px solid transparent';
          break;
        case PPtFormatInputsEnum.isBold:
          if (checkbox.value) {
            this.element.fontWeigth = 600;
          } else {
            this.element.fontWeigth = 100;
          }
          break;
        case PPtFormatInputsEnum.width:
          if (numberInput.value == 0) {
            this.element.width = 'auto';
          } else {
            this.element.width = numberInput.value + 'px';
          }
          break;
        case PPtFormatInputsEnum.radius:
          this.element.radius = numberInput.value + 'px';
          break;
        case PPtFormatInputsEnum.textAlign:
          switch (radioInput.selectedItemKey) {
            case 1:
              this.element.textAlign = 'left';
              break;
            case 2:
              this.element.textAlign = 'center';
              break;
            case 3:
              this.element.textAlign = 'right';
              break;
            default:
              break;
          }

          break;
        default:
          break;
      }
    });
  }
  ngOnDestroy() {}

  showEditableText() {
    this.showText = false;
  }
}
