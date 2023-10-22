import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, AIMessage, SystemMessage } from "langchain/schema";

const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const runLLMChain = async (messages, modelName) => {

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const model = new ChatOpenAI({
    modelName: modelName || "gpt-3.5-turbo",
    streaming: true,
    openAIApiKey: key,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  const messagesPrompt = messages.map(msg => {
    switch (msg.role) {
      case "user":
        return new HumanMessage(msg.content);
      case "assistant":
        return new AIMessage(msg.content);
      case "system":
        return new SystemMessage(msg.content);
      default:
        throw new Error(`Unknown role: ${msg.role}`);
    }
  });

  console.log(messagesPrompt)

  model.call(messagesPrompt);

  return stream.readable;
};

export async function POST(req) {
  const { messages, modelName } = await req.json();

  const stream = runLLMChain(messages, modelName);
  return new Response(await stream);
}