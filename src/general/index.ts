import { z } from "zod";
import { StructuredTool } from "../types";

const AskUserSchema = z.object({
  question: z.string().describe("The question you would like to ask the user"),
});

export class AskUser extends StructuredTool<typeof AskUserSchema> {
  constructor() {
    super({
      name: "Ask User",
      description: "use this when you need to ask the user a question",
      schema: AskUserSchema,
      requiresReview: false,
      requiresResponse: true,
      func: async (input) => {
        return input.question;
      },
    });
  }
}


const ConversationSchema = z.object({
    response: z.string().describe("Your response to the user"),
  });
  
  export class ConversationTool extends StructuredTool<typeof ConversationSchema> {
    constructor() {
      super({
        name: "Conversation",
        description:
          "use this when you the user strikes up a conversation e.g. they ask 'How are you?'. Useful if none of the other tools are appropriate. You can respond however you deem appropriate",
        schema: ConversationSchema,
        requiresResponse: false,
        requiresReview: false,
        func: async (input) => {
          return input.response;
        },
      });
    }
  }