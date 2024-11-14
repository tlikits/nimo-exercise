import { AdminCreateUserCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { returnClientError, returnCreateSuccess, returnServerError } from '../lib/utils';

const cognitoClient = new CognitoIdentityProviderClient({});

const USER_POOL_ID = process.env.USER_POOL_ID as string;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, temporaryPassword } = JSON.parse(event.body || '{}');

        if (!email || !temporaryPassword) {
            return returnClientError('Signup failed', 'Both email and temporaryPassword are required');
        }

        const command = new AdminCreateUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: email,
            TemporaryPassword: temporaryPassword,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
            ],
            // MessageAction: 'SUPPRESS',
        });
        await cognitoClient.send(command);

        return returnCreateSuccess({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return returnServerError('Failed to create user', error as Error);
    }
};
