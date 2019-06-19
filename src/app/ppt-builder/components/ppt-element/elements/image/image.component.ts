import { Component, OnInit, Input } from '@angular/core';
import { PptImageElementModel } from '@app/ppt-builder/model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ppt-image-element',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input('element') element: PptImageElementModel;
  isImageActive?: boolean = false;
  constructor(public _DomSanitizer: DomSanitizer) {}

  ngOnInit() {}
}
