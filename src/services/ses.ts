import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const SOURCE_EMAIL = 'thanchanok.lks@gmail.com';
const sesClient = new SESClient();


export async function sendEmail(targetEmail: string, subject: string, bodyText: string, bodyHtml: string) {
    const params = {
        Source: SOURCE_EMAIL, // TODO: use from variable
        Destination: {
            ToAddresses: [targetEmail],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Text: {
                    Data: bodyText,
                },
                HTML: {
                    Data: bodyHtml,
                },
            },
        },
    };
    console.log(JSON.stringify(params, null, 2));
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log('Email sent:', result);
}