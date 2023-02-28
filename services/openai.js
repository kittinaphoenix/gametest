const { Configuration, OpenAIApi } = require("openai");

const openaikey = process.env.openaikey || "";

const configuration = new Configuration({
    //organization: "Kittina",
    apiKey: openaikey,
});

const openai = new OpenAIApi(configuration);

async function getDialog(user, dialogInput, dialogTo) {
  const prompt = "simula y responde mi siguiente interaccion como un dialogo uno a uno con el autor "+dialogTo+".Basado en toda su literatura y datos que tengas, responde en primera persona como si fuese el autor quien responde, si aplica en la pregunta, el autor tiene que citar una obra asociada al tema, la pregunta: "+dialogInput;
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0,
      });

      if (!response.data) {
        throw new Error("Invalid response from OpenAI API (response.data)");
      }
  
      if (!response.data.choices) {
        throw new Error("Invalid response from OpenAI API (response.choices)");
      }
  
      const text = response.data.choices[0].text.replace(/\n/g, '');
  
      if (!text) {
        throw new Error("Invalid response text from OpenAI API (response.choices[0].text)");
      }
  
      return text;
    } catch (err) {
      console.error("Error in getDialog:", err);
      throw err;
    }
  }

module.exports = { getDialog };
