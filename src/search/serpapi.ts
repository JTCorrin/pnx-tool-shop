import { z } from "zod";
import { getJson } from "serpapi";
import { StructuredTool } from "../types";

type OrganicResult = {
    position: number,
    title: string,
    link: string,
    displayed_link: string,
    favicon: string,
    snippet: string,
    snippet_highlighted_words: string[],
    about_page_link: string,
    about_page_serpapi_link: string,      
    cached_page_link: string,
    source: string
}


// Define the schema for the email sending tool
const GoogleSearchSchema = z.object({
    query: z.string().describe("the keyword search query"),
    location: z.string().nullish().describe("the Google encoded location you want to use for the search"),
});

/**
 * SendOutlookEmail class allows models to use MS Graph to send an email.
 * You'll need to provide an accessToken and a userPrincipal name when
 * instantiating
 */
export class GoogleSearch extends StructuredTool<typeof GoogleSearchSchema> {
    private apiKey: string
    constructor(apiKey: string) {
        super({
            name: "Google Search Tool",
            description: "use this to search the internet. Useful for gathering information that's not immediately available",
            schema: GoogleSearchSchema,
            requiresReview: false,
            requiresResponse: false,
            func: async (input) => {
                // Use a function to interact with Microsoft Graph API
                try {
                    const response = await getJson("google", {
                        api_key: this.apiKey, // Get your API_KEY from https://serpapi.com/manage-api-key
                        q: input.query,
                        location: input.location,
                        num: 10
                    });
                    console.log(response);
                    
                    return `Here are the results from a google search. The snippets give a brief insight into the information held on the website. 
                    ${JSON.stringify(response["organic_results"].map((result: OrganicResult) => {
                        return {
                            title: result.title,
                            link: result.link,
                            snippet: result.snippet
                        }
                    }))}`;
                } catch (error) {
                    console.error(error)
                    throw new Error("Failed to perform a search.");
                }
            }
        });
        this.apiKey = apiKey
    }

}