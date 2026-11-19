import { z } from "zod";

const featureTemplate = `# Feature Addition PR Template

## Summary

[Briefly describe the feature being introduced.]

## Rationale

[Explain the reasoning behind this feature and its benefits to the project]

## Changes

[List the major changes made in this pull request.]

## Impact

[Discuss any potential impacts this feature may have on existing functionalities]

## Testing

[Describe how the feature has been tested, including both automated and manual testing strategies]

## Additional Notes

[Any additional information or context relevant to this PR]
`;

const bugfixTemplate = `# Bug Fix PR Template

## Summary

[Provide a concise description of the bug and the fix.]

## Root Cause Analysis

[Detail the root cause of the bug and how it was identified.]

## Changes

[Outline the changes made to fix the bug.]

## Impact

[Describe any implications this fix may have on other parts of the application.]

## Testing Strategy

[Explain how the fix has been tested to ensure the bug is resolved without introducing new issues]

## Regression Risk

[Assess the risk of regression caused by this fix and steps taken to mitigate it]

## Additional Notes

[Any further information needed to understand the fix or its impact]

`;
export type TemplateTypes = "feature" | "bugfix";
const zodTemplateTypesSchema = z.union([z.literal("bugfix"), z.literal("feature")])
export const prTemplates: Record<TemplateTypes, string> = {
  feature: featureTemplate,
  bugfix: bugfixTemplate,
};
