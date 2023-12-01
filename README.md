# 🔧 pnx-tool-shop

The pnx-tool-shop is a repo for storing tools for use with the [pnx](https://github.com/JTCorrin/pnx) ai agent framework


## ⚡️ Quick Install

You can use npm, or pnpm to install pnx

`npm install pnx-tool-shop` or `pnpm add pnx-tool-shop`

## 🚀 Get started

```typescript
import { Agent, PromptTemplate } from "pnx";
import { SendOutlookEmail, AskUser, GoogleSearch } from 'pnx-tool-shop'

const accessToken = "get-your-ms-graph-accesstoken"
const serpAPIKEY = "your serp api key"

const emailTool = new SendOutlookEmail(accessToken ?? "", "example@google.com")
const askUser = new AskUser()
const googleSearch = new GoogleSearch(process.env.SERP_API ?? serpAPIKEY)

const agent = Agent.getDefault([emailTool, askUser, googleSearch])
const { message, memory } = await agent.run(
    new PromptTemplate(`Hi can you find some information about the company OpenAI for me? Send the info via email to me at me@mydomain.com`)
);

console.log(message); // I've found some information about OpenAI and have sent it in an email to your provided address. You should have it in your inbox shortly. Please let me know if you need any further information!

```

## 🤔 What is this?

pnx-tool-shop offers a variety of tools for different purposes, such as "Ask User", "Send Email", "Conversation", and "Google Search". The list of tools available will grow as they are developed.


**📃 Creating Custom Tools:**

You can create custom tools by extending the StructuredTool class. Here's an example of defining a custom tool:

```typescript
import { StructuredTool, StructuredToolInput } from 'pnx';
import { z } from 'zod';

const CustomToolSchema = z.object({
  // Define your schema here
});

class CustomTool extends StructuredTool<typeof CustomToolSchema> {
  constructor() {
    super({
      name: "Custom Tool",
      description: "Describe your custom tool",
      schema: CustomToolSchema,
      requiresReview: false, // These 2 flags will notify pnx is additional steps need to be taken once this tool has been used
      requiresResponse: true,
      func: async (input) => {
        // Implement your tool's functionality
        return "Result of your custom tool";
      },
    });
  }
}
```

## 💁 Contributing

Contributions are welcome! If you have suggestions or want to contribute to the development of a tool, please feel free to create issues or pull requests here on Github