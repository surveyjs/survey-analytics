import { QuestionCommentModel } from "survey-core";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { WordCloudWidget } from "../src/wordcloud/widget";

test("remove stopwords and clean punktuation", () => {
  var wc = new WordCloud(new QuestionCommentModel("q1"), [
    { q1: "The Thimes!" },
    { q1: "mega, (mega) Super answer." },
  ]);
  var data = wc.getCalculatedValues();
  expect(Object.keys(data).length).toEqual(4);
  expect(data.filter((d) => d[0] === "The").length).toEqual(0);
  expect(data.filter((d) => d[0] === "mega").length).toEqual(1);
  expect(data.filter((d) => d[0] === "mega")[0][0]).toEqual("mega");
  expect(data.filter((d) => d[0] === "mega")[0][1]).toEqual(2);
  expect(data[0][0]).toEqual("thimes");
});

test("WordCloudWidget constructor", () => {
  const wcw = new WordCloudWidget();
  expect(wcw.colors).toStrictEqual(["black"]);
  expect(wcw["_minWeight"]).toEqual(1);
  expect(wcw["_weightFactor"]).toEqual(1);

  wcw.words = [["word1", 2], ["word2", 10]];
  expect(wcw["_minWeight"]).toEqual(2);
  expect(wcw["_weightFactor"]).toEqual(0.225);
});

test("WordCloudWidget createWordElement", () => {
  const wcw = new WordCloudWidget();
  wcw.words = [["word1", 2], ["word2", 10]];

  const word1El = wcw["createWordElement"]("word1", 2, 0);
  expect(word1El.style.position).toBe("absolute");
  expect(word1El.style.fontSize).toBe("4.444444444444445px");
  expect(word1El.style.lineHeight).toBe("0.8em");
  expect(word1El.style.color).toBe("black");
  expect(word1El.title).toBe("word1 (2)");
  expect(word1El.innerHTML).toBe("word1");
});

test("WordCloudWidget render", () => {
  const wcw = new WordCloudWidget();
  wcw.words = [["word1", 2], ["word2", 10]];
  const renderTarget = document.createElement("div");

  wcw.render(renderTarget);
  expect(renderTarget.innerHTML).toBe("<div class=\"sa-visualizer-wordcloud\" style=\"position: relative; height: 1649.9259536805148px;\"><div style=\"position: absolute; font-size: 40px; line-height: 0.8em; color: black; left: 1px; top: 10px;\" title=\"word2 (10)\">word2</div><div style=\"position: absolute; font-size: 4.444444444444445px; line-height: 0.8em; color: black; left: -763.7678872004664px; top: 1629.9259536805148px;\" title=\"word1 (2)\">word1</div></div>");
  wcw.dispose();
  expect(renderTarget.innerHTML).toBe("");
});

test("getCalculatedValues keeps umlauts", () => {
  var wc = new WordCloud(new QuestionCommentModel("q1"), [
    { q1: "Gro\u00DFmutter" },
    { q1: "Gro\u00DFmutter" },
  ]);
  var data = wc.getCalculatedValues();
  expect(Object.keys(data).length).toEqual(1);
  expect(data[0][0]).toBe("gro\u00DFmutter");
  expect(data[0][1]).toBe(2);
});
