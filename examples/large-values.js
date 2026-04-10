var json = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          type: "radiogroup",
          name: "product",
          title: "Which product do you prefer?",
          choices: ["Product A", "Product B", "Product C", "Product D"]
        }
      ]
    }
  ]
};

// Generate large data: Product A=15600, Product B=12530, Product C=10000, Product D=4200
var data = [];
var counts = {
  "Product A": 15600,
  "Product B": 12530,
  "Product C": 10000,
  "Product D": 4200
};
Object.keys(counts).forEach(function(key) {
  for (var i = 0; i < counts[key]; i++) {
    data.push({ product: key });
  }
});
