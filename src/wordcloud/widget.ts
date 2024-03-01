export const defaultOptions = {
  spiralResolution: 1,
  spiralLimit: 360 * 5,
  lineHeight: 0.8,
  xWordPadding: 0,
  yWordPadding: 3,
  weightFactor: 40,
  topN: 40,
  maxHeight: 0,
  padding: 10
};

export class WordCloudWidget {
  private _words: Array<Array<any>> = [];
  private _placedWords: Array<{element: HTMLDivElement, rect: DOMRect, left: number, top: number}> = [];
  private _minWeight = 1;
  private _weightFactor = 1;
  private _renderedTarget: HTMLDivElement = undefined;

  constructor(private _options = defaultOptions) {
  }

  colors = ["black"];
  get words(): Array<Array<any>> {
    return this._words;
  }
  set words(w: Array<Array<any>>) {
    this._words = [].concat(w || []);
    this._minWeight = 1;
    this._weightFactor = 1;
    if(this._words.length > 0) {
      this._words.sort((a, b) => -1 * (a[1] - b[1]));
      this._minWeight = this._words[this._words.length - 1][1];
      this._weightFactor = (this._words[0][1] - this._minWeight + 1) / this._options.weightFactor;
    }
  }

  private createWordElement(text: string, weight: number, color: number) {
    var element = document.createElement("div");
    element.style.position = "absolute";
    element.style.fontSize = (weight - this._minWeight + 1) / this._weightFactor + "px";
    element.style.lineHeight = this._options.lineHeight + "em";
    if(this.colors.length > 0) {
      element.style.color = this.colors[color % this.colors.length];
    }
    element.title = text + " (" + weight + ")";
    element.appendChild(document.createTextNode(text));
    return element;
  }
  private isIntersectWithPlaced(currentWordRect: DOMRect) {
    for(var i = 0; i < this._placedWords.length; i+=1) {
      var existingWordRect = this._placedWords[i].rect;
      if(!(currentWordRect.right + this._options.xWordPadding < existingWordRect.left - this._options.xWordPadding ||
           currentWordRect.left - this._options.xWordPadding > existingWordRect.right + this._options.xWordPadding ||
           currentWordRect.bottom + this._options.yWordPadding < existingWordRect.top - this._options.yWordPadding ||
           currentWordRect.top - this._options.yWordPadding > existingWordRect.bottom + this._options.yWordPadding)) {
        return true;
      }
    }
    return false;
  }
  private arrangeWords(cloudElement: HTMLDivElement, startPoint) {
    const currentPoint = {
      x: 0,
      y: 0
    };
    let yMin = currentPoint.y;
    let yMax = currentPoint.y;
    const displayWordsCount = Math.min(this._options.topN, this.words.length);
    for (var i = 0; i < displayWordsCount; i += 1) {
      var wordElement = this.createWordElement(this.words[i][0], this.words[i][1], i);
      cloudElement.appendChild(wordElement);
      for (var j = 0; j < this._options.spiralLimit; j++) {
        const angle = this._options.spiralResolution * j;
        currentPoint.x = (1 + angle) * Math.cos(angle);
        currentPoint.y = (1 + angle) * Math.sin(angle);
        const left = startPoint.x + currentPoint.x - wordElement.offsetWidth/2;
        const top = startPoint.y + currentPoint.y - wordElement.offsetHeight/2;
        wordElement.style.left = left + "px";
        wordElement.style.top = top + "px";
        const wordRect = wordElement.getBoundingClientRect();
        if (!this.isIntersectWithPlaced(wordRect)) {
          this._placedWords.push({
            element: wordElement,
            rect: wordRect,
            left,
            top
          });
          break;
        }
      }
      if(yMin > currentPoint.y) {
        yMin = currentPoint.y;
      }
      if(yMax < currentPoint.y) {
        yMax = currentPoint.y;
      }
    }
    return [yMin, yMax];
  }
  public render(target: HTMLDivElement): void {
    this._renderedTarget = target;
    var cloudElement = document.createElement("div");
    cloudElement.className = "sa-visualizer-wordcloud";
    cloudElement.style.position = "relative";
    target.appendChild(cloudElement);

    if(this._options.maxHeight > 0) {
      cloudElement.style.height = this._options.maxHeight + "px";
      cloudElement.style.overflow = "auto";
    }
    const startPoint = {
      x: cloudElement.offsetWidth / 2,
      y: cloudElement.offsetHeight / 2
    };
    const [yMin, yMax] = this.arrangeWords(cloudElement, startPoint);
    if(this._options.maxHeight == 0) {
      cloudElement.style.height = yMax - yMin + this._options.padding * 2 + "px";
    }
    this._placedWords.forEach(wordInfo => {
      wordInfo.element.style.top = wordInfo.top - yMin + this._options.padding + "px";
    });
  }
  public dispose(): void {
    if(!!this._renderedTarget) {
      this._renderedTarget.innerHTML = "";
      this._renderedTarget = undefined;
    }
  }
}
