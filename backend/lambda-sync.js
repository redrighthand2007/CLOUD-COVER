const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'CloudCoverUsers';

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Set up CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // In production, restrict to your specific domain
        'Access-Control-Allow-Credentials': true,
    };
    
    try {
        // Handle CORS Preflight request
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'CORS Preflight successful' })
            };
        }

        const body = JSON.parse(event.body);
        
        // Use Cognito claims if available via API Gateway authorizer, fallback to email
        const userId = event.requestContext?.authorizer?.claims?.sub || body.email;
        
        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing user identifier.' })
            };
        }

        const params = {
            TableName: TABLE_NAME,
            Item: {
                userId: userId,
                email: body.email,
                activePolicies: body.activePolicies || 0,
                savedQuotes: body.savedQuotes || 0,
                lastSyncedAt: new Date().toISOString()
            }
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Successfully synced to DynamoDB!',
                data: params.Item
            })
        };
        
    } catch (error) {
        console.error('Error saving to DynamoDB:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: 'Internal Server Error',
                error: error.message
            })
        };
    }
};
