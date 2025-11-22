/**
 * Projects Service
 * 
 * Service API pour les projets (placeholder).
 * Utilise apiGet/apiPost pour les appels API réels (non utilisés pour l'instant).
 */

import { apiGet, apiPost } from './api';

// Placeholder functions - NOT USED YET
export async function fetchProjects() {
  return apiGet('/projects');
}

export async function fetchProjectById(id: string) {
  return apiGet(`/projects/${id}`);
}

export async function createProject(project: any) {
  return apiPost('/projects', project);
}

// Mock service functions
import { mockProjects } from '../mocks/projectsMock';
import type { Project } from '../mocks/suiviMock';

export async function fetchProjectsMock(): Promise<Project[]> {
  return mockProjects;
}

export async function fetchProjectByIdMock(id: string): Promise<Project | undefined> {
  return mockProjects.find((project) => project.id === id);
}

