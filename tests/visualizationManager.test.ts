import { VisualizationManager } from "../src/visualizationManager";
import { Text } from "../src/text";
import { WordCloud } from "../src/wordcloud/wordcloud";

test("register and get", () => {
  expect(VisualizationManager.vizualizers).toMatchObject({});

  const text = Text; // need to trigger VisualizationManager.registerVisualizer("text", Text);
  const wordCloud = WordCloud; // need to trigger VisualizationManager.registerVisualizer("text", WordCloud);

  const textVizualizer = new (<any>(
    VisualizationManager.getVisualizersByType("text")[0]
  ))();

  const wordCloudVizualizer = new (<any>(
    VisualizationManager.getVisualizersByType("text")[1]
  ))();

  expect(textVizualizer.name).toBe("text");
  expect(wordCloudVizualizer.name).toBe("wordcloud");
  expect(VisualizationManager.vizualizers.text.length).toBe(2);
});
