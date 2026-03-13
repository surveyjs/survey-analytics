import { Question, QuestionCompositeModel, QuestionCustomModel } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager, IVisualizerTypeDescriptor } from "./visualizationManager";

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
   * @param descriptor A question or type descriptor to create a visualizer.
   * @param data A data array with survey results to be visualized.
   * @param options An object with any custom properties you need within the visualizer.
   */
  public static createVisualizer(
    descriptor: Question | any,
    data: Array<{ [index: string]: any }>,
    options?: { [index: string]: any }
  ): VisualizerBase {
    let type: string;
    let question: Question;
    let optionsForCreator = Object.assign({}, options);
    let creatorInfos: Array<{typeName: string, creator: any}> = [];

    if("visualizerType" in descriptor || "visualizerTypes" in descriptor) {
      type = descriptor.visualizerType || (descriptor.visualizerTypes || [])[0];
      const dataName = descriptor["name"] || descriptor.question?.name || descriptor.dataField || descriptor.questionName;

      optionsForCreator = Object.assign({},
        optionsForCreator,
        descriptor.options || {}
      );

      if(!!descriptor.chartType) {
        optionsForCreator[dataName] = Object.assign({},
          optionsForCreator[dataName] || {},
          {
            chartType: descriptor.chartType,
            availableTypes: descriptor.availableTypes
          }
        );
      }

      question = descriptor.question || {
        name: dataName,
        valueName: descriptor.question?.valueName || descriptor.dataField || descriptor.questionName,
        title: descriptor.title,
        displayValueName: descriptor.displayValueName,
        waitForQuestionIsReady: () => {
          return new Promise<void>((resolve) => resolve());
        }
      } as any;
      creatorInfos = this.getVisualizerCreatorsByDescriptor(descriptor);
    } else {
      question = descriptor;
      if(descriptor.displayValueName !== undefined) {
        question.displayValueName = descriptor.displayValueName;
      }
      creatorInfos = this.getVisualizerCreatorsByQuestion(question);
    }

    let questionForCreator: Question | Question[] = question;

    const visualizers = [];
    if(creatorInfos.length > 0) {
      creatorInfos.forEach(creatorInfo => {
        const optionsForCreatorType = Object.assign({}, optionsForCreator);
        // TODO: improve available types processing
        const availableTypes = (descriptor as any).availableTypes && (descriptor as any).availableTypes[creatorInfo.typeName];
        if(availableTypes && availableTypes[creatorInfo.typeName]) {
          optionsForCreatorType["availableTypes"] = availableTypes[creatorInfo.typeName];
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

  static getVisualizerCreatorsByDescriptor(descriptor: IVisualizerTypeDescriptor): Array<{typeName: string, creator: any}> {
    let allCreatorInfos: Array<{typeName: string, creator: any}> = [];
    const vTypes = descriptor.visualizerTypes || [descriptor.visualizerType];
    vTypes.forEach(type => {
      const creators = VisualizationManager.getVisualizersByType(type);
      creators.forEach(creator => allCreatorInfos.push({ typeName: type, creator }));
    });
    return allCreatorInfos;
  }
}
