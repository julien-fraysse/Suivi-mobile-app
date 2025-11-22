/**
 * Projects Service
 * 
 * Service API pour les projets avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 */

import { API_MODE } from '../config/apiMode';
import { apiGet, apiPost } from './api';
import { mockProjects } from '../mocks/projectsMock';
import type { Project } from '../mocks/suiviMock';

export async function fetchProjects(): Promise<Project[]> {
  if (API_MODE === 'mock') {
    return mockProjects;
  }
  return apiGet('/projects');
}

export async function fetchProjectById(id: string): Promise<Project | undefined> {
  if (API_MODE === 'mock') {
    return mockProjects.find((project) => project.id === id);
  }
  return apiGet(`/projects/${id}`);
}

export async function createProject(project: any) {
  if (API_MODE === 'mock') {
    // Mock: ajouter le projet localement
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
    };
    mockProjects.push(newProject);
    return newProject;
  }
  return apiPost('/projects', project);
}

