import { z } from "zod";
import { Parser } from 'expr-eval'
import { StructuredTool } from "../types";



// Define a Zod schema for the calculator input
const CalculatorSchema = z.object({
    expression: z.string().describe("The calculation you wish to perform"),
});
  
export class Calculator extends StructuredTool<typeof CalculatorSchema> {
    constructor() {
      super({
        name: "Simple Calculator",
        description: "use this when you need to evaluate relatively simple mathematical expressions",
        schema: CalculatorSchema,
        requiresResponse: false,
        requiresReview: false,
        func: async (input) => {
          try {
            const result = Parser.evaluate(input.expression);
            return result.toString();
          } catch (error) {
            throw new Error(`Failed to evaluate expression: ${input.expression}`);
          }
        },
      });
    }
}
