import { Component, OnInit, OnDestroy, Input, HostListener, OnChanges, AfterViewInit } from '@angular/core';
import { PPtBuilderService } from '../service';

export abstract class AppComponentBase implements AfterViewInit, OnDestroy {
  /**
   *
   */

  pPtBuilderService: PPtBuilderService;

  constructor(pPtBuilderService: PPtBuilderService) {
    this.pPtBuilderService = pPtBuilderService;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pPtBuilderService.setSlidePreview();
    }, 1000);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.pPtBuilderService.setSlidePreview();
    }, 1000);
  }
}
