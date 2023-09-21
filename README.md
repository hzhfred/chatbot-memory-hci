

# abstract
https://arxiv.org/abs/2308.01542

*How can we reveal a chatbot’s memory state and allow a user to manipulate its memory representation?*

The recent advent of large language models (LLM) has resulted in high-performing conversational agents such as ChatGPT. These agents must remember key information from an ongoing conversation to provide responses that are contextually relevant to the user. However, these agents have limited memory and can be distracted by irrelevant parts of the conversation. While many strategies exist to manage conversational memory, users currently lack affordances for viewing and controlling what the agent remembers, resulting in a poor mental model and conversational breakdowns. In this paper, we present Memory Sandbox, an interactive system and design probe that allows users to manage the conversational memory of LLM-powered agents. By treating memories as data objects that can be viewed, manipulated, recorded, summarized, and shared across conversations, Memory Sandbox provides interaction affordances for users to manage how the agent should `see' the conversation.
# quickstart
### setup the application
1. install **[node.js](https://nodejs.org/en)**.
2. run `git clone https://github.com/hzhfred/chatbot-memory-hci.git`.
3. run `npm install` to get the dependencies.
### run the development server
1. run `npm run dev` to start the development server.
2. visit **http://localhost:3000** to view application.
3. edit `app/layout.js` or `app/page.js` and save to see the updated result in browser.
4. get the `.env.local` file to access OpenAI.
# concept
![image](https://github.com/hzhfred/chatbot-memory-hci/assets/44552816/91809f1c-a1f5-4c76-be44-a3430d8198e2)
_Memory Sandbox is a system that enables users to see and manage the memory of conversational agents. Memory
Sandbox provides the following interaction affordances: 1) toggle memory visibility, 2) add memory, 3) edit memory, 4) delete
memory, 5) summarize memory, 6) create a new conversation, and 7) share memory._
