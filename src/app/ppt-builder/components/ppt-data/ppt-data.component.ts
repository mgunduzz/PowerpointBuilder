import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@env/environment';
import {
  PPtElementEnum,
  PptElementModel,
  BaseFormatInputModel,
  FormatCheckboxInputModel,
  FormatChangeModel,
  FormatInputsModel,
  PptDefaultChartDataModel,
  PptDefaultChartElementModel
} from '@app/ppt-builder/model';
import { PPtBuilderService } from '@app/ppt-builder/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ppt-data',
  templateUrl: './ppt-data.component.html',
  styleUrls: ['./ppt-data.component.scss']
})
export class PptDataCompontent implements OnInit, OnDestroy {
  @Input('element') element: PptElementModel;
  activeElSubscription: Subscription;

  dataSources: any[] = [];
  selectedDataSource: any;
  dataSourceProperties: any[];
  selectedSeries: string;
  categories: any[] = [];

  constructor(private pPtBuilderService: PPtBuilderService) {
    this.activeElSubscription = this.pPtBuilderService.activeElementSubscription.subscribe(el => {
      if (el) {
        this.element = el;
      }
    });
  }

  onUpdateElementDataClick() {
    if (this.element) {
      (this.element as PptDefaultChartElementModel).dataModal.dataSource.series = this.selectedSeries;
      (this.element as PptDefaultChartElementModel).dataModal.dataSource.categories = this.categories;

      this.pPtBuilderService.getElementData().subscribe(res => {
        let pptData = new PptDefaultChartDataModel();

        if (this.element instanceof PptDefaultChartElementModel) {
          (this.element as PptDefaultChartElementModel).setData(res);

          this.element.onDataChange.next();
        }
      });
    }
  }

  onSelectDataSource(source: any) {
    this.selectedDataSource = source;

    this.dataSourceProperties = [];
    this.categories = [];
    this.selectedSeries = undefined;

    if (this.selectedDataSource.id == 1) {
      this.dataSourceProperties.push({ name: 'customerName', friendlyName: 'Müşteri Adı' });
      this.dataSourceProperties.push({ name: 'positive', friendlyName: 'Olumlu' });
      this.dataSourceProperties.push({ name: 'negative', friendlyName: 'Olumsuz' });

      this.categories.push({ name: 'category1', index: 1, selectedProp: undefined });
    }
  }

  onSelectSeries(property: any) {
    this.selectedSeries = property;
  }

  onCategorySelected(cat: any, prop: any) {
    cat.selectedProp = prop;
  }

  addCategory() {
    if (this.categories.length > 0) {
      let lastCat = this.categories[this.categories.length - 1];

      this.categories.push({ name: 'category' + lastCat.index + 1, index: lastCat.index + 1, selectedProp: undefined });
    } else {
      this.categories.push({ name: 'category1', index: 1, selectedProp: undefined });
    }
  }

  deleteCatProp(cat: any) {
    this.categories = this.categories.filter(item => item.index != cat.index);
  }

  isChartElement() {
    return this.element instanceof PptDefaultChartElementModel;
  }

  ngOnInit() {
    this.dataSources.push({ id: 1, name: 'MüşteriOlumluOlumsuz' });
  }

  ngOnDestroy() {
    this.activeElSubscription.unsubscribe();
  }
}
