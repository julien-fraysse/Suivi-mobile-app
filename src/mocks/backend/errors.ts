/**
 * Mock Backend Errors
 * 
 * Gestion des erreurs HTTP-like pour le mock backend.
 * Simule les codes de statut HTTP et les messages d'erreur.
 */

/**
 * Erreur API avec code de statut HTTP
 */
export class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * Codes de statut HTTP courants
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Créer une erreur 404 (Not Found)
 */
export function createNotFoundError(resource: string, id: string): ApiError {
  return new ApiError(HTTP_STATUS.NOT_FOUND, `${resource} with id "${id}" not found`);
}

/**
 * Créer une erreur 400 (Bad Request)
 */
export function createBadRequestError(message: string): ApiError {
  return new ApiError(HTTP_STATUS.BAD_REQUEST, message);
}

/**
 * Créer une erreur 500 (Internal Server Error)
 */
export function createInternalServerError(message: string = 'Internal server error'): ApiError {
  return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
}


