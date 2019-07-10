import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { PptImageElementModel, FormatChangeModel } from '@app/ppt-builder/model';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ppt-image-element',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, AfterViewInit {
  @Input('element') element: PptImageElementModel;
  isImageActive?: boolean = false;
  dragDropStatus: boolean = true;
  @ViewChild('content') elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  constructor(public _DomSanitizer: DomSanitizer) {}

  postNaturalWidth() {
    var height = (document.getElementById('img-' + this.element.id) as any).naturalHeight;
    var width = (document.getElementById('img-' + this.element.id) as any).naturalWidth;
    this.element.format.formatInputs.naturalWidth = width;
    this.element.format.formatInputs.naturalHeight = height;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    let _this = this;
    var img = $('#img-' + _this.element.id)[0];
    $('#img-example') // Make in memory copy of image to avoid css issues
      .attr('src', $(img).attr('src'))
      .on('load', function() {
        if (
          _this.element.format.formatInputs.naturalWidth.value == 0 &&
          _this.element.format.formatInputs.naturalHeight.value == 0
        ) {
          _this.element.format.formatInputs.naturalWidth = this.width;
          _this.element.format.formatInputs.naturalHeight = this.height;

          _this.element.format.formatInputs.width.value = this.width;
          _this.element.format.formatInputs.height.value = this.height;
        } else {
          _this.element.format.formatInputs.width = _this.element.format.formatInputs.naturalWidth;
          _this.element.format.formatInputs.height = _this.element.format.formatInputs.naturalHeight;
        }

        _this.element.onFormatChange.next({
          formatInput: _this.element.format.formatInputs.width,
          updateComponent: true
        });
        _this.element.onFormatChange.next({
          formatInput: _this.element.format.formatInputs.height,
          updateComponent: true
        });

        $('#img-example').remove();
      });
  }

  // ngAfterViewInit(){
  //   debugger;
  //     let _this = this;
  //     var img = $('#img-'+_this.element.id)[0];
  //     $('.image-box').prepend('<img id="theImg" />')
  //      .attr("src", $(img).attr("src")).on('load',function() {
  //        debugger;
  //       _this.element.naturalWidth = this.width;
  //       _this.element.naturalHeight = this.height;
  //     })

  //     $('.theImg').remove()
  // }
}
