import { Question, QuestionSelectBase, ItemValue, QuestionCommentModel, settings } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { ToolbarHelper } from "./utils/index";
import { VisualizerFactory } from './visualizerFactory';

export class SelectBase extends VisualizerBase {
  private selectedItem: ItemValue = undefined;
  protected orderByAnsweres: string = "default";
  // public static otherCommentQuestionType = "comment"; // TODO: make it configureable - allow choose what kind of question/visualizer will be used for comments/others
  public static otherCommentCollapsed = true;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.registerToolbarItem(
      "changeChartType",
      () => {
        if (this.chartTypes.length > 1) {
          return ToolbarHelper.createSelector(
            this.chartTypes.map(chartType => {
              return {
                value: chartType,
                text: localization.getString("chartType_" + chartType)
              };
            }),
            (option: any) => this.chartType === option.value,
            (e: any) => {
              this.setChartType(e.target.value);
              this.onChartTypeChanged();
            }
          );
        }
        return null;
      }
    );
  }

  protected chartTypes: string[];
  protected chartType: string;

  protected onChartTypeChanged() {}

  protected setChartType(chartType: string) {
    if (
      this.chartTypes.indexOf(chartType) !== -1 &&
      this.chartType !== chartType
    ) {
      this.chartType = chartType;
      this.destroyContent(this.contentContainer);
      this.renderContent(this.contentContainer);
      this.invokeOnUpdate();
    }
  }

  protected getSelectedItemByText(itemText: string) {
    return this.question.choices.filter(
      (choice: ItemValue) => choice.text === itemText
    )[0];
  }

  setSelection(item: ItemValue) {
    this.selectedItem = item;
    this.onDataItemSelected((item && item.value) || undefined, (item && item.text) || "");
  }
  get selection() {
    return this.selectedItem;
  }
  setLabelsOrder(value: string) {
    this.orderByAnsweres = value;
  }
  onDataItemSelected: (selectedValue: any, selectedText: string) => void;

  update(data: Array<{ [index: string]: any }>) {
    super.update(data);
    this.destroyContent(this.contentContainer);
    this.renderContent(this.contentContainer);
    this.destroyFooter(this.footerContainer);
    this.renderFooter(this.footerContainer);
    this.invokeOnUpdate();
  }

  protected renderFooter(container: HTMLElement) {
    container.innerHTML = "";
    if(this.question.hasComment || this.question.hasOther) {
      const footerTitleElement = document.createElement("h4");
      footerTitleElement.className = "sa-visualizer__footer-title";
      footerTitleElement.innerText = localization.getString("otherCommentTitle");
      container.appendChild(footerTitleElement);

      const footerContentElement = document.createElement("div");
      footerContentElement.className = "sa-visualizer__footer-content";
      footerContentElement.style.display = SelectBase.otherCommentCollapsed ? "none" : "block";

      const visibilityButton = ToolbarHelper.createButton(() => {
        if(footerContentElement.style.display === "none") {
          footerContentElement.style.display = "block";
          visibilityButton.innerText = localization.getString("hideButton");
        } else {
          footerContentElement.style.display = "none";
          visibilityButton.innerText = localization.getString(SelectBase.otherCommentCollapsed ? "showButton" : "hideButton");
        }
        this.invokeOnUpdate();
      }, localization.getString("showButton")/*, "sva-toolbar__button--right"*/);
      container.appendChild(visibilityButton);

      container.appendChild(footerContentElement);

      const question = new QuestionCommentModel(this.question.name + settings.commentPrefix);
      question.title = this.question.title;
      const visualizer = VisualizerFactory.createVizualizer(
        question,
        this.data
      );
      visualizer.render(footerContentElement);
    }
  }

  valuesSource(): any[] {
    const question = <QuestionSelectBase>this.question;
    return question["activeChoices"];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(choice => choice.value);

    if (this.question.hasOther) values.unshift("other");

    return values;
  }

  getLabels(): Array<string> {
    const labels: Array<string> = this.valuesSource().map(choice =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );

    if (this.question.hasOther) labels.unshift("Other");

    return labels;
  }

  getData(): any[] {
    const values = this.getValues();
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          values.forEach((val: any, index: number) => {
            if (rowValue.indexOf(val) !== -1) {
              statistics[index]++;
            }
          });
        } else {
          values.forEach((val: any, index: number) => {
            if (rowValue == val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return [statistics];
  }

  destroy() {
    this.destroyContent(this.contentContainer);
    this.destroyFooter(this.footerContainer);
    super.destroy();
  }

}
