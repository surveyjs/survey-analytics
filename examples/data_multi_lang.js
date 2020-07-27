function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var json = {
  locale: "ru",
  questions: [
    {
      type: "dropdown",
      name: "satisfaction",
      title: {
        default: "How satisfied are you with the Product?",
        ru: "Насколько Вас устраивает наш продукт?",
      },
      choices: [
        {
          value: 0,
          text: {
            default: "Not Satisfied",
            ru: "Coвсем не устраивает",
          },
        },
        {
          value: 1,
          text: {
            default: "Satisfied",
            ru: "Устраивает",
          },
        },
        {
          value: 2,
          text: {
            default: "Completely satisfied",
            ru: "Полностью устраивает",
          },
        },
      ],
    },
  ],
};

var data = [];

for (let index = 0; index < 10; index++) {
  data.push({
    satisfaction: randomIntFromInterval(0, 2),
  });
}
