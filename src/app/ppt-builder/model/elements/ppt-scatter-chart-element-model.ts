import * as _ from 'underscore';
import { PptBaseChartDataModel, PptBaseChartElementModel, PptBaseElementModel, AnalyseApiDataModel } from '..';

export class PptScatterChartDataSetModel {
  constructor() {
    this.data = new Array<number>();
  }
  label: string;
  data: Array<any>;
  fill: boolean = false;
  backgroundColor: string;
}

export class PptScatterChartDataModel extends PptBaseChartDataModel {
  constructor() {
    super();
    this.labels = new Array<string>();
    this.dataSets = new Array<PptScatterChartDataSetModel>();
  }
  labels: Array<string>;
  dataSets: Array<PptScatterChartDataSetModel>;
}

export class PptScatterChartElementModel extends PptBaseChartElementModel {
  constructor(el: PptBaseElementModel) {
    super(el);
    this.dataModal = new PptScatterChartDataModel();
    this.dataModal.labels = ['Renault', 'Toyota', 'Mercedes', 'Volkswagen', 'Fiat'];
    this.dataModal.dataSets = [
      {
        label: 'Olumlu',
        fill: false,
        data: [
          {
            x: 10,
            y: 20
          },
          {
            x: 50,
            y: 40
          },
          {
            x: 150,
            y: 200
          }
        ],
        backgroundColor: '#ffc94a'
      }
    ];
  }

  dataModal: PptScatterChartDataModel;

  setData(data: Array<AnalyseApiDataModel>) {
    this.dataModal.labels = [];
    this.dataModal.dataSets = [];
    let gorupedData = _.groupBy(data, 'customerName');
  }
}
