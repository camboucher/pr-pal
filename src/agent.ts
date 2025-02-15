import dotenv from "dotenv";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import fs from "fs";


const getDiffFIle 
fs.readFile('path/to/your/file.txt', 'utf-8', (error, data) => {
   if (error) {
     console.error('Error reading the file:', error);
     return;
   }
   // Process the file content here
   console.log(data);
 });

import { tools } from "./tools";

import 
dotenv.config();

const { ANTHROPIC_API_KEY } = process.env;
// process.env.TAVILY_API_KEY = process.env;

const agentModel = new ChatAnthropic({
  apiKey: ANTHROPIC_API_KEY,
});


// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools,
  checkpointSaver: agentCheckpointer,
});

// Now it's time to use!
const agentFinalState = await agent.invoke(
  { messages: [new HumanMessage()] },
  { configurable: { thread_id: "42" } }
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content
);

// const agentNextState = await agent.invoke(
//   { messages: [new HumanMessage("what about ny")] },
//   { configurable: { thread_id: "42" } }
// );

// console.log(
//   agentNextState.messages[agentNextState.messages.length - 1].content
// );