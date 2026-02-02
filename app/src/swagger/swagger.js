const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CrudOps API',
      version: '1.0.0',
      description: 'Professional REST API with authentication, authorization, and CRUD operations',
      contact: {
        name: 'CrudOps',
        url: 'http://localhost:3000/api-docs',
        email: 'support@crudops.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.crudops.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token (without Bearer prefix)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            id: { type: 'integer', example: 1 },
            firstName: { type: 'string', minLength: 2, maxLength: 50 },
            lastName: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6, maxLength: 128 },
            status: { type: 'string', enum: ['active', 'non-active'], default: 'active' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Role: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              enum: ['ADMIN', 'MANAGER', 'USER'],
              example: 'ADMIN',
            },
            description: {
              type: 'string',
              example: 'Administrator role with full permissions',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Class: {
          type: 'object',
          required: ['name', 'roomNumber', 'capacity'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Grade 10-A' },
            roomNumber: { type: 'string', example: '101' },
            capacity: { type: 'integer', example: 30 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Course: {
          type: 'object',
          required: ['name', 'code', 'credits'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Mathematics' },
            code: { type: 'string', example: 'MTH-101' },
            description: { type: 'string', example: 'Basic Mathematics' },
            credits: { type: 'integer', example: 3 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'haris@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                  $ref: '#/components/schemas/User',
                },
                roles: {
                    type: 'array',
                    items: {
                        type: 'string',
                        example: 'ADMIN'
                    }
                }
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            data: {
              type: 'object',
              nullable: true,
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Users retrieved successfully',
            },
            data: {
              type: 'object',
              properties: {
                totalItems: {
                  type: 'integer',
                  example: 50,
                },
                items: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
                currentPage: {
                  type: 'integer',
                  example: 1,
                },
                itemsPerPage: {
                  type: 'integer',
                  example: 10,
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/swagger/*.js'], // Path to route and swagger files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
