#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile, readdir } from "fs/promises";
import { join, extname } from "path";
import { glob } from "glob";

const PROJECT_DIR = process.env.PROJECT_DIR || process.cwd();

class OpenAPIMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "openapi-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  async findOpenAPIFiles() {
    const patterns = [
      "**/*.openapi.json",
      "**/*.swagger.json",
      "**/openapi.json",
      "**/swagger.json",
      "**/openapi.yaml",
      "**/swagger.yaml",
      "**/openapi.yml",
      "**/swagger.yml",
    ];

    const files = [];
    for (const pattern of patterns) {
      try {
        const matches = await glob(pattern, {
          cwd: PROJECT_DIR,
          ignore: ["node_modules/**", ".git/**", "dist/**", "build/**"],
        });
        files.push(...matches.map((f) => join(PROJECT_DIR, f)));
      } catch (error) {
        // Ignore errors
      }
    }

    return [...new Set(files)];
  }

  async readOpenAPIFile(filePath) {
    try {
      const content = await readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      return {
        error: `Failed to read OpenAPI file: ${error.message}`,
      };
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "read_openapi",
          description:
            "Read OpenAPI/Swagger definition files (*.openapi.json, *.swagger.json) and return the specification",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Path to OpenAPI file (optional, will auto-detect if not provided)",
              },
            },
          },
        },
        {
          name: "generate_typescript_client",
          description:
            "Generate TypeScript client code from OpenAPI specification",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Path to OpenAPI file",
              },
              outputPath: {
                type: "string",
                description: "Output path for generated TypeScript client",
              },
            },
            required: ["filePath", "outputPath"],
          },
        },
        {
          name: "generate_react_query_hooks",
          description: "Generate React Query hooks from OpenAPI specification",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Path to OpenAPI file",
              },
              outputPath: {
                type: "string",
                description: "Output path for generated hooks",
              },
            },
            required: ["filePath", "outputPath"],
          },
        },
        {
          name: "generate_services",
          description: "Generate service classes from OpenAPI specification",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Path to OpenAPI file",
              },
              outputPath: {
                type: "string",
                description: "Output path for generated services",
              },
            },
            required: ["filePath", "outputPath"],
          },
        },
        {
          name: "generate_validation_schemas",
          description: "Generate validation schemas (Zod) from OpenAPI specification",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Path to OpenAPI file",
              },
              outputPath: {
                type: "string",
                description: "Output path for generated schemas",
              },
            },
            required: ["filePath", "outputPath"],
          },
        },
        {
          name: "generate_api_documentation",
          description: "Generate API documentation from OpenAPI specification",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Path to OpenAPI file",
              },
              outputPath: {
                type: "string",
                description: "Output path for generated documentation",
              },
            },
            required: ["filePath", "outputPath"],
          },
        },
        {
          name: "list_openapi_files",
          description: "List all OpenAPI/Swagger files found in the repository",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === "list_openapi_files") {
        try {
          const files = await this.findOpenAPIFiles();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    files: files.map((f) => f.replace(PROJECT_DIR + "/", "")),
                    count: files.length,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error listing OpenAPI files: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      if (name === "read_openapi") {
        try {
          let filePath = args?.filePath;

          if (!filePath) {
            const files = await this.findOpenAPIFiles();
            if (files.length === 0) {
              return {
                content: [
                  {
                    type: "text",
                    text: "No OpenAPI files found. Please specify a filePath or add an OpenAPI file to your project.",
                  },
                ],
                isError: true,
              };
            }
            filePath = files[0];
          }

          if (!filePath.startsWith("/")) {
            filePath = join(PROJECT_DIR, filePath);
          }

          const spec = await this.readOpenAPIFile(filePath);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(spec, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error reading OpenAPI file: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      // For generation tools, return instructions
      const generationTools = [
        "generate_typescript_client",
        "generate_react_query_hooks",
        "generate_services",
        "generate_validation_schemas",
        "generate_api_documentation",
      ];

      if (generationTools.includes(name)) {
        const { filePath, outputPath } = args || {};

        if (!filePath || !outputPath) {
          return {
            content: [
              {
                type: "text",
                text: `Error: filePath and outputPath are required for ${name}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `To generate ${name.replace("generate_", "")} from OpenAPI:\n\n1. Read the OpenAPI file: read_openapi with filePath="${filePath}"\n2. Use a code generation tool or library like:\n   - openapi-typescript for TypeScript types\n   - @openapi-contrib/openapi-schema-to-json-schema for validation\n   - openapi-generator for full client generation\n\nFor now, I can help you read and analyze the OpenAPI specification.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("OpenAPI MCP server running on stdio");
  }
}

const server = new OpenAPIMCPServer();
server.run().catch(console.error);
