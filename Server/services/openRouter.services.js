import axios from "axios";

export const askAi = async (messages) => {

  try {

    // Validate messages
    if (
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {

      throw new Error("Messages array is empty.");

    }

    // API Request
   const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "openai/gpt-4o-mini",
    messages:messages
  },

      {
        headers: {

          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json"

        }
      }
    );

    // Debug API Response
    console.log(response.data);

    // Extract content
    const content =
      response?.data?.choices?.[0]?.message?.content;

    // Validate content
    if (!content || !content.trim()) {

      throw new Error("AI returned empty response");

    }

    return content;

  } catch (error) {

    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );

    throw new Error(

      error.response?.data?.error?.message ||
      error.message

    );
  }
};