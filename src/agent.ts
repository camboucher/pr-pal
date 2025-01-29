import dotenv from "dotenv";
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

dotenv.config();

const { ANTHROPIC_API_KEY } = process.env;
// process.env.TAVILY_API_KEY = process.env;

// const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const agentModel = new ChatAnthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: [],
  checkpointSaver: agentCheckpointer,
});

// Now it's time to use!
const agentFinalState = await agent.invoke(
  { messages: [new HumanMessage("what is the current weather in sf")] },
  { configurable: { thread_id: "42" } }
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content
);

const agentNextState = await agent.invoke(
  { messages: [new HumanMessage("what about ny")] },
  { configurable: { thread_id: "42" } }
);

console.log(
  agentNextState.messages[agentNextState.messages.length - 1].content
);

/*
 * const getWeather = tool((input) => {
 *   if (["sf", "san francisco"].includes(input.location.toLowerCase())) {
 *     return "It's 60 degrees and foggy.";
 *   } else {
 *     return "It's 90 degrees and sunny.";
 *   }
 * }, {
 *   name: "get_weather",
 *   description: "Call to get the current weather.",
 *   schema: z.object({
 *     location: z.string().describe("Location to get the weather for."),
 *   })
 * })
 * */
