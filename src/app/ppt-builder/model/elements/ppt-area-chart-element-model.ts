import { PptDefaultChartElementModel, PptBaseElementModel, AnalyseApiDataModel } from '..';

export class PptAreaChartElementModel extends PptDefaultChartElementModel {
  constructor(el: PptBaseElementModel) {
    super(el);
    this.dataModal.dataSets.forEach(item => (item.fill = true));
  }

  setData(data: Array<AnalyseApiDataModel>) {
    super.setData(data);
    this.dataModal.dataSets.forEach(item => (item.fill = true));
  }
}
