import { VisualizationManager } from "../src/visualizationManager";
import { Text } from "../src/text";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { VisualizerBase } from "../src/visualizerBase";
import { VisualizerFactory } from "../src/visualizerFactory";

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

  expect(textVizualizer.type).toBe("text");
  expect(wordCloudVizualizer.type).toBe("wordcloudmodel");
  expect(VisualizationManager.vizualizers.text.length).toBe(2);
});

test("unregister visualizer", () => {
  expect(VisualizationManager.vizualizers).toMatchObject({});

  const text = Text; // need to trigger VisualizationManager.registerVisualizer("text", Text);
  const wordCloud = WordCloud; // need to trigger VisualizationManager.registerVisualizer("text", WordCloud);

  let textVizualizers = VisualizationManager.getVisualizersByType("text");

  expect(textVizualizers.length).toBe(2);
  expect(textVizualizers[0]).toBe(Text);
  expect(textVizualizers[1]).toBe(WordCloud);

  VisualizationManager.unregisterVisualizer("text", WordCloud);
  textVizualizers = VisualizationManager.getVisualizersByType("text");

  expect(textVizualizers.length).toBe(1);
  expect(textVizualizers[0]).toBe(Text);

  VisualizationManager.registerVisualizer("text", WordCloud);
});

test("unregister visualizer for all question types", () => {
  expect(VisualizationManager.vizualizers).toMatchObject({});

  const text = Text; // need to trigger VisualizationManager.registerVisualizer("text", Text);
  const wordCloud = WordCloud; // need to trigger VisualizationManager.registerVisualizer("text", WordCloud);

  let textVizualizers = VisualizationManager.getVisualizersByType("text");
  let commentVizualizers = VisualizationManager.getVisualizersByType("comment");
  let multipletextVizualizers = VisualizationManager.getVisualizersByType(
    "multipletext"
  );

  expect(textVizualizers.length).toBe(2);
  expect(textVizualizers[0]).toBe(Text);
  expect(textVizualizers[1]).toBe(WordCloud);

  expect(commentVizualizers.length).toBe(2);
  expect(commentVizualizers[0]).toBe(Text);
  expect(commentVizualizers[1]).toBe(WordCloud);

  expect(multipletextVizualizers.length).toBe(2);
  expect(multipletextVizualizers[0]).toBe(Text);
  expect(multipletextVizualizers[1]).toBe(WordCloud);

  VisualizationManager.unregisterVisualizer(undefined, WordCloud);

  textVizualizers = VisualizationManager.getVisualizersByType("text");
  commentVizualizers = VisualizationManager.getVisualizersByType("comment");
  multipletextVizualizers = VisualizationManager.getVisualizersByType(
    "multipletext"
  );

  expect(textVizualizers.length).toBe(1);
  expect(textVizualizers[0]).toBe(Text);

  expect(commentVizualizers.length).toBe(1);
  expect(commentVizualizers[0]).toBe(Text);

  expect(multipletextVizualizers.length).toBe(1);
  expect(multipletextVizualizers[0]).toBe(Text);

  VisualizationManager.registerVisualizer("text", WordCloud);
  VisualizationManager.registerVisualizer("comment", WordCloud);
  VisualizationManager.registerVisualizer("multipletext", WordCloud);
});

test("visualizers default order", () => {
  VisualizationManager.registerVisualizer("test", { name: "v1" } as any);
  VisualizationManager.registerVisualizer("test", { name: "v2" } as any);
  VisualizationManager.registerVisualizer("test", { name: "v3" } as any);

  let testVizualizers = VisualizationManager.getVisualizersByType("test");
  expect(testVizualizers.length).toBe(3);
  expect(testVizualizers[0].name).toBe("v1");
  expect(testVizualizers[2].name).toBe("v3");

  VisualizationManager.unregisterVisualizer("test", undefined as any);
  testVizualizers = VisualizationManager.getVisualizersByType("test");
  expect(testVizualizers.length).toBe(0);
});

test("visualizers set order", () => {
  VisualizationManager.registerVisualizer("test", { name: "v1" } as any);
  VisualizationManager.registerVisualizer("test", { name: "v2" } as any);
  VisualizationManager.registerVisualizer("test", { name: "v3" } as any, 0);

  let testVizualizers = VisualizationManager.getVisualizersByType("test");
  expect(testVizualizers.length).toBe(3);
  expect(testVizualizers[0].name).toBe("v3");
  expect(testVizualizers[1].name).toBe("v1");
  expect(testVizualizers[2].name).toBe("v2");

  VisualizationManager.unregisterVisualizer("test", undefined as any);
  testVizualizers = VisualizationManager.getVisualizersByType("test");
  expect(testVizualizers.length).toBe(0);
});

test("stub default visualizer and suppressVisulizerStubRendering setting", () => {
  let testVizualizers = VisualizationManager.getVisualizersByType("signaturepad");
  expect(testVizualizers.length).toBe(1);
  expect(testVizualizers[0].name).toBe("VisualizerBase");

  try {
    VisualizerBase.suppressVisualizerStubRendering = true;
    testVizualizers = VisualizationManager.getVisualizersByType("signaturepad");
    expect(testVizualizers.length).toBe(0);
  } finally {
    VisualizerBase.suppressVisualizerStubRendering = false;
  }
});

class Tel extends VisualizerBase {
  constructor() {
    super({ name: "tel" } as any, [], {}, "tel");
  }
}
test("Create text visualizer for unregistered input types", () => {
  try {
    VisualizationManager.unregisterVisualizer("text", WordCloud);
    VisualizationManager.registerVisualizer("tel", Tel);

    const telVisualizer = VisualizerFactory.createVisualizer({ name: "q1", getType: () => "text", inputType: "tel" } as any, []);
    expect(telVisualizer).toBeDefined();
    expect(telVisualizer.type).toBe("tel");

    const textVisualizer = VisualizerFactory.createVisualizer({ name: "q1", getType: () => "text" } as any, []);
    expect(textVisualizer).toBeDefined();
    expect(textVisualizer.type).toBe("text");

    const textWithUnknownInputTypeVisualizer = VisualizerFactory.createVisualizer({ name: "q1", getType: () => "text", inputType: "password" } as any, []);
    expect(textWithUnknownInputTypeVisualizer).toBeDefined();
    expect(textWithUnknownInputTypeVisualizer.type).toBe("text");
  } finally {
    VisualizationManager.unregisterVisualizer("tel", Tel);
    VisualizationManager.registerVisualizer("text", WordCloud);
  }
});
