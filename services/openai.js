const { Configuration, OpenAIApi } = require("openai");

const openaikey = process.env.openaikey || "";

const configuration = new Configuration({
    //organization: "Kittina",
    apiKey: openaikey,
});

const openai = new OpenAIApi(configuration);

async function getDialog(user, dialogInput, dialogTo) {
  const prompt = "Comienza una conversación con " + dialogTo + " basada en su literatura y datos que tengas. Respóndele en primera persona como si fueses " + dialogTo + ", puedes citar una obra asociada al tema si aplica. Por favor, asegúrate de que tus respuestas sean coherentes y contextualizadas. Aquí está el mensaje de inicio del chat: " + dialogInput;
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2048,
        n:1,
        temperature: 0.5
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
