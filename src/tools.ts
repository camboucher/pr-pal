import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import {
  getClassificationPrompt,
  getDiffAnalysisPrompt,
  populatePRTemplatePrompt as populateTemplatePrompt,
} from "./prompts";
import { prTemplates, TemplateTypes } from "./pr_templates";

const { ANTHROPIC_API_KEY } = process.env;

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const analyzeDiff = tool(
  async ({ diff, context }) => {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        { role: "user", content: getDiffAnalysisPrompt({ diff, context }) },
      ],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  },
  {
    name: "analyze_diff",
    description:
      "Analyze a git diff file and identify the significant code changes",
    schema: z.object({
      diff: z.string().describe("Git diff file"),
      context: z
        .string()
        .optional()
        .describe(
          "Optional input the user can provide to give context about the changes"
        ),
    }),
  }
);

const categorizeChanges = tool(
  async (changeSummary) => {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        { role: "user", content: getClassificationPrompt(changeSummary) },
      ],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  },
  {
    name: "categorize_changes",
    description:
      "Determine whether this diff is a feature, bugfix, refactor, or other type.",
    schema: z.string(),
  }
);

const selectTemplate = tool((changeType: string) => prTemplates[changeType], {
  name: "select_template",
  description:
    "return the proper PR template to populate based on the type of code changes",
  schema: z.string(),
  // need fix type validation later
  // z.union([z.literal("bugfix"), z.literal("feature")])
});

const populateTemplate = tool(
  async ({ changeSummary, template }) => {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: populateTemplatePrompt({ changeSummary, template }),
        },
      ],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  },
  {
    name: "poulate_template",
    description:
      "Populates a PR template using a summary of code changes and a PR template",
    schema: z.object({
      changeSummary: z.string(),
      template: z.string(),
    }),
  }
);

export const tools = [
  analyzeDiff,
  categorizeChanges,
  selectTemplate,
  populateTemplate,
];
