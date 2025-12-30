import { Question, QuestionCompositeModel, QuestionCustomModel } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerDescription } from "./visualizerDescription";

/**
 * An object that allows you to create individual visualizers without creating a [visualization panel](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel).
 */
export class VisualizerFactory {
  /**
   * Creates a visualizer for a single question.
   *
   * ```js
   * import { VisualizerFactory } from "survey-analytics";
   *
   * const visualizer = new VisualizerFactory.createVisualizer(
   *   question,
   *   data,
   *   options
   * );
   *
   * visualizer.render("containerId")
   * ```
   *
   * If a question has more than one [registered](https://surveyjs.io/dashboard/documentation/api-reference/visualizationmanager#registerVisualizer) visualizer, users can switch between them using a drop-down menu.
   * @param description A question for which to create a visualizer.
   * @param data A data array with survey results to be visualized.
   * @param options An object with any custom properties you need within the visualizer.
   */
  public static createVisualizer(
    description: Question | IVisualizerDescription,
    data: Array<{ [index: string]: any }>,
    options?: { [index: string]: any }
  ): VisualizerBase {
    let type: string;
    let types: Array<string>;
    let question: Question;
    let optionsForCreator = Object.assign({}, options);

    if("visualizerType" in description) {
      type = description.visualizerType;
      types = description.visualizerTypes || [description.visualizerType];

      optionsForCreator = Object.assign({},
        optionsForCreator,
        description.options || {}
      );

      const dataName = description["name"] || description.question?.name || description.dataName || description.questionName;

      if(!!description.chartType) {
        optionsForCreator[dataName] = Object.assign({},
          optionsForCreator[dataName] || {},
          {
            chartType: description.chartType,
            availableTypes: description.availableTypes
          }
        );
      }

      question = description.question || {
        name: dataName,
        valueName: description.question?.valueName || description.dataName || description.questionName,
        title: description.title,
        displayValueName: description.displayValueName,
        waitForQuestionIsReady: () => {
          return new Promise<void>((resolve) => resolve());
        }
      };
    } else {
      question = description;
      if(description.displayValueName !== undefined) {
        question.displayValueName = description.displayValueName;
      }
      types = [question.getType()];
    }

    let questionForCreator: Question | Question[] = question;
    const visualizers = [];
    types.forEach(type => {
      let creators = [];
      if(type === "text" && (<any>question).inputType) {
        creators = VisualizationManager.getVisualizersByType((<any>question).inputType, type);
      } else {
        let fallbackType = undefined;
        if(question instanceof QuestionCustomModel) {
          fallbackType = question.getDynamicType();
        } else if(question instanceof QuestionCompositeModel) {
          fallbackType = "composite";
        }
        creators = VisualizationManager.getVisualizersByType(type, fallbackType);
      }
      creators.forEach(creator => {
        const optionsForCreatorType = Object.assign({}, optionsForCreator);
        if(description.availableTypes && description.availableTypes[type]) {
          optionsForCreatorType["availableTypes"] = description.availableTypes[type];
        }
        const visualizer = new creator(questionForCreator, data, optionsForCreatorType, false);
        visualizers.push(visualizer);
      });
    });

    if(visualizers.length > 1) {
      const alternativesVisualizerConstructor = VisualizationManager.getAltVisualizerSelector();
      let visualizer = new alternativesVisualizerConstructor(
        visualizers,
        questionForCreator,
        data,
        optionsForCreator
      );
      if(type) {
        visualizer.setVisualizer(type);
      }
      return visualizer;
    }
    return visualizers[0];
  }
}
