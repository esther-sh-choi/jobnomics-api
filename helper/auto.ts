const { Configuration, OpenAIApi } = require("openai");

const requestToOpenAI = async (description: string) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: description }],
    temperature: 0.7,
  });
  console.log(completion.data.choices[0].message);
};

module.exports = { requestToOpenAI };