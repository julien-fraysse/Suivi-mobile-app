/**
 * API Mode Configuration
 * 
 * Système global pour basculer entre le mode mock et le mode API.
 * 
 * - 'mock' : Utilise les mocks centralisés dans src/mocks/
 * - 'api' : Utilise les endpoints réels de l'API Suivi Desktop
 * 
 * NOTE: Laisser 'mock' par défaut pour ne pas casser le fonctionnement actuel.
 * 
 * Pour activer le mode API à l'avenir, changer simplement :
 * export const API_MODE: ApiMode = 'api';
 */

export type ApiMode = 'mock' | 'api';

export const API_MODE: ApiMode = 'mock'; // Par défaut : mode mock

