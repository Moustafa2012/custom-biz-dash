import { zodToJsonSchema } from 'zod-to-json-schema';
import * as schemas from '../utils/validation';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates an OpenAPI 3.0 specification from shared Zod schemas.
 * This ensures the front-end and back-end are always in sync.
 */

const generateOpenApiSpec = () => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'ERP System API',
      version: '1.0.0',
      description: 'Unified API documentation for the ERP system',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        LoginInput: zodToJsonSchema(schemas.loginSchema as any, 'LoginInput'),
        RegisterInput: zodToJsonSchema(schemas.registerSchema as any, 'RegisterInput'),
        CreateUserInput: zodToJsonSchema(schemas.createUserSchema as any, 'CreateUserInput'),
        UpdateUserInput: zodToJsonSchema(schemas.updateUserSchema as any, 'UpdateUserInput'),
        TwoFactorVerifyInput: zodToJsonSchema(schemas.twoFactorVerifySchema as any, 'TwoFactorVerifyInput'),
        PaginationQuery: zodToJsonSchema(schemas.paginationSchema as any, 'PaginationQuery'),
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          summary: 'Login to the system',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful login',
            },
          },
        },
      },
      '/auth/profile': {
        get: {
          summary: 'Get current user profile',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profile data',
            },
          },
        },
      },
      '/users': {
        get: {
          summary: 'Get all users',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
            },
          ],
          responses: {
            200: {
              description: 'List of users',
            },
          },
        },
        post: {
          summary: 'Create a new user',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
            },
          },
        },
      },
    },
  };

  const outputPath = path.resolve(__dirname, '../../../openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  console.log(`OpenAPI specification generated at ${outputPath}`);
};

if (require.main === module) {
  generateOpenApiSpec();
}

export { generateOpenApiSpec };
