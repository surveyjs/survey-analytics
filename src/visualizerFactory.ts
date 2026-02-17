import { Question, QuestionCompositeModel, QuestionCustomModel } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { getDataName, IVisualizerDescription } from "./visualizerDescription";

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
    let question: Question;
    let optionsForCreator = Object.assign({}, options);
    let creatorInfos: Array<{typeName: string, creator: any}> = [];

    if("visualizerType" in description) {
      type = description.visualizerType;
      const dataName = getDataName(description);

      optionsForCreator = Object.assign({},
        optionsForCreator,
        description.options || {}
      );

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
      creatorInfos = this.getVisualizerCreatorsByDescription(description as IVisualizerDescription);
    } else {
      question = description;
      if(description.displayValueName !== undefined) {
        question.displayValueName = description.displayValueName;
      }
      creatorInfos = this.getVisualizerCreatorsByQuestion(question);
    }

    let questionForCreator: Question | Question[] = question;

    const visualizers = [];
    if(creatorInfos.length > 0) {
      creatorInfos.forEach(creatorInfo => {
        const optionsForCreatorType = Object.assign({}, optionsForCreator);
        if(description.availableTypes && description.availableTypes[creatorInfo.typeName]) {
          optionsForCreatorType["availableTypes"] = description.availableTypes[creatorInfo.typeName];
        }
        if(creatorInfos.length > 1) {
          optionsForCreatorType["allowChangeVisualizerType"] = false;
        }
        const visualizer = new creatorInfo.creator(questionForCreator, data, optionsForCreatorType, false);
        visualizers.push(visualizer);
      });
    }

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

  static getVisualizerCreatorsByQuestion(question: Question): Array<{typeName: string, creator: any}> {
    let allCreatorInfos: Array<{typeName: string, creator: any}> = [];
    const vTypes = [question.getType()];
    vTypes.forEach(type => {
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
      creators.forEach(creator => allCreatorInfos.push({ typeName: type, creator }));
    });
    return allCreatorInfos;
  }

  static getVisualizerCreatorsByDescription(description: IVisualizerDescription): Array<{typeName: string, creator: any}> {
    let allCreatorInfos: Array<{typeName: string, creator: any}> = [];
    const vTypes = description.visualizerTypes || [description.visualizerType];
    vTypes.forEach(type => {
      const creators = VisualizationManager.getVisualizersByType(type);
      creators.forEach(creator => allCreatorInfos.push({ typeName: type, creator }));
    });
    return allCreatorInfos;
  }
}

