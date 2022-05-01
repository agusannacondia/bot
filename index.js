const qrcode = require("qrcode-terminal");
const axios = require("axios");

const { Client } = require("whatsapp-web.js");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  if (!message.isStatus) {
    // console.log(message);
    // console.log(
    //   `Nuevo mensaje de ${message.from.replace(/\D/g, "")}: ${message.body}`
    // );
    if (message.body.includes("!t")) {
      message.reply(await translateEsToEn(message.body.split("!t")[1].trim()));
    }
  }
});

const translateEsToEn = async (text) => {
  const encodedParams = new URLSearchParams();
  encodedParams.append("q", text);
  encodedParams.append("target", "en");
  encodedParams.append("source", "es");

  const options = {
    method: "POST",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      "X-RapidAPI-Key": "6dae049cacmsh1f1cfb81c109f9ep135835jsn0fd3f7cea21d",
    },
    data: encodedParams,
  };

  const translation = await axios.request(options);

  console.log(JSON.stringify(translation.data.data));

  return translation.data.data.translations[0].translatedText.replace(
    /&#39;/g,
    "'"
  );
};

client.initialize();
