function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var json = {
  locale: "fr",
  questions: [
    {
      type: "dropdown",
      name: "satisfaction",
      title: {
        default: "How satisfied are you with the Product?",
        ru: "Насколько Вас устраивает наш продукт?",
        fr: "Êtes-vous satisfait du produit?"
      },
      choices: [
        {
          value: 0,
          text: {
            default: "Not Satisfied",
            ru: "Coвсем не устраивает",
            fr: "Pas satisfait"
          },
        },
        {
          value: 1,
          text: {
            default: "Satisfied",
            ru: "Устраивает",
            fr: "Satisfait"
          },
        },
        {
          value: 2,
          text: {
            default: "Completely satisfied",
            ru: "Полностью устраивает",
            fr: "Complètement satisfait"
          },
        },
      ],
    },
    {
      type: "signaturepad",
      name: "signature",
      title:
        "Signature",
    },
  ],
};

var data = [];

for (let index = 0; index < 10; index++) {
  data.push({
    satisfaction: randomIntFromInterval(0, 2),
  });
}
