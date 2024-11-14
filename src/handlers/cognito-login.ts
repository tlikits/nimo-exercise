import { CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandOutput, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyHandler } from "aws-lambda";
import { returnClientError, returnSuccess } from '../lib/utils';

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

async function cognitoInitiateAuth(username: string, password: string): Promise<InitiateAuthCommandOutput> {
    const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.APP_CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    });
    const response = await client.send(command);
    return response;
}


// NOTE: temporarily logic for bypassing new password required workflow
export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return returnClientError('Login failed', 'No credential provided');
    }
    const { username, password } = JSON.parse(event.body);

    try {
        let response = await cognitoInitiateAuth(username, password);
        if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            const newPasswordCommand = new RespondToAuthChallengeCommand({
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ClientId: process.env.APP_CLIENT_ID,
                ChallengeResponses: {
                    USERNAME: username,
                    NEW_PASSWORD: password,
                },
                Session: response.Session,
            });
            await client.send(newPasswordCommand);
            response = await cognitoInitiateAuth(username, password);
        }

        return returnSuccess({
            accessToken: response.AuthenticationResult?.AccessToken,
            idToken: response.AuthenticationResult?.IdToken,
            refreshToken: response.AuthenticationResult?.RefreshToken,
            expiresIn: response.AuthenticationResult?.ExpiresIn,
        })
    } catch (error: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Login failed', error: error.message }),
        };
    }
};
