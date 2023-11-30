import { z } from 'zod';
import { StructuredTool } from '../../types';


// Define the schema for the email sending tool
const SendEmailSchema = z.object({
  recipient: z.string().email().describe("The email address of the recipient"),
  subject: z.string().describe("The subject of the email"),
  body: z.string().describe("The body content of the email"),
});

/**
 * SendOutlookEmail class allows models to use MS Graph to send an email.
 * You'll need to provide an accessToken and a userPrincipal name when
 * instantiating
 */
export class SendOutlookEmail extends StructuredTool<typeof SendEmailSchema> {
    private accessToken: string
    private userPrincipalName: string
    constructor(accessToken: string, userPrincipalName: string) {
        super({
            name: "Send Outlook Email",
            description: "Use this tool to send an Outlook email via Microsoft Graph",
            schema: SendEmailSchema,
            requiresReview: false,
            requiresResponse: false,
            func: async (input) => {
                // Use a function to interact with Microsoft Graph API
                try {
                    await this.sendEmailUsingMicrosoftGraph(input.recipient, input.subject, input.body);
                    return "Email sent successfully.";
                } catch (error) {
                    throw new Error("Failed to send email.");
                }
            }
        });
        this.accessToken = accessToken
        this.userPrincipalName = userPrincipalName
    }

    /**
     * Function to send an email using Microsoft Graph API.
     * @param recipient The email address of the recipient.
     * @param subject The subject of the email.
     * @param body The body content of the email.
     */
    sendEmailUsingMicrosoftGraph = async (recipient: string, subject: string, body: string): Promise<void> => {
        //const url = 'https://graph.microsoft.com/v1.0/me/sendMail';
        const url = `https://graph.microsoft.com/v1.0/users/${this.userPrincipalName}/sendMail`;
    
        const emailPayload = {
            message: {
                subject: subject,
                body: {
                    contentType: 'Text',
                    content: body,
                },
                toRecipients: [
                {
                    emailAddress: {
                        address: recipient
                    }
                }
                ],
            },
            saveToSentItems: 'true',
        };
    
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        },
            body: JSON.stringify(emailPayload)
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }
    }
}


