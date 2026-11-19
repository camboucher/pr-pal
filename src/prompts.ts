export const getDiffAnalysisPrompt = ({
  diff,
  context,
}: {
  diff: string;
  context?: string;
}) => {
  const diffPrompt = `
        You are in charge of analyzing a git diff file to summarize the code changes. 
        You can classify small changes and minor code cleanup all together as code cleanup. Return output in the format of:

        ## What Changed
        Explanation of significant changes, with focus on files changed, functions changed and the impact
        
        ## Why
        Analysis of what the changes accomplish. This might be a bugfix, adding a new feature, technical code improvements or other reasons
    
        ## How
        Why were the changes implemented this way. What are other possible ways to achieve the same changes
        
        Here is the diff file:
        '''
        ${diff}
        '''
        `;
  const additionalContext = context
    ? `Here is additional user provided context:
        '''
         ${context}
         '''`
    : "";
  return `${diffPrompt} \n ${additionalContext}`;
};

export const getClassificationPrompt = (changeSummary) =>
  `Based on the following code change summary, classify the changes as either bugfix or feature. Please responsd only with the word either 'feature' or 'bugfix'
  Here are the changes:
  '''
  ${changeSummary}
  '''`;

export const populatePRTemplatePrompt = ({
  template,
  changeSummary,
}: {
  template: string;
  changeSummary: string;
}) => {
  return `
    Here is a PR template: \n ''' \n ${template}\n''' \n
    Here is a summary of code changes: \n ''' \n ${changeSummary} \n ''' \n
    Please populate the template using the information provided in the code change summary. 
    Do your best to infer information important when possible, but when you make any assumptions call them out specifically.
    You are allowed to omit sections from the template if they are not relevant. Only provide relevant information and be concise.
    The end result should be a polished PR template that is ready to post to Github for review from a colleague.
    You do not need to be formal and should feel free to use casual langauge and.
  `;
};
