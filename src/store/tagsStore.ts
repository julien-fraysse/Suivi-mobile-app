import { create } from 'zustand';
import type { SuiviTag } from '../types/task';
import { mockTags } from '../mocks/tagsMock';

interface TagsState {
  /** Liste de tous les tags disponibles dans l'application */
  availableTags: SuiviTag[];
  
  /** Initialiser la liste des tags (appelé au démarrage avec mockTags + tags des tâches) */
  initializeTags: (tags: SuiviTag[]) => void;
  
  /** Créer un nouveau tag et l'ajouter à availableTags */
  createTag: (name: string, color: string) => SuiviTag;
  
  /** Mettre à jour un tag existant (nom et/ou couleur) */
  updateTag: (tagId: string, name: string, color: string) => void;
  
  /** Supprimer un tag de availableTags (sauf les tags statiques de mockTags) */
  deleteTag: (tagId: string) => void;
  
  /** Récupérer un tag par son ID */
  getTagById: (tagId: string) => SuiviTag | undefined;
  
  /** Récupérer tous les tags disponibles */
  getAllTags: () => SuiviTag[];
}

/**
 * useTagsStore
 * 
 * Store Zustand pour gérer les tags de l'application Suivi.
 * Source unique de vérité pour tous les tags disponibles.
 * 
 * Les tags statiques de mockTags sont protégés contre la suppression.
 * Les tags créés dynamiquement peuvent être modifiés et supprimés.
 * 
 * Utilisation :
 * - TagEditModal : createTag, updateTag
 * - TaskDetailScreen : getAllTags pour afficher la liste
 * - TagPickerBottomSheet : getAllTags pour la sélection
 */
export const useTagsStore = create<TagsState>((set, get) => ({
  // Initialiser avec mockTags par défaut
  availableTags: [...mockTags],
  
  /**
   * initializeTags
   * 
   * Initialise la liste des tags avec une liste complète.
   * Appelé au démarrage de TaskDetailScreen avec mockTags + tags extraits des tâches.
   */
  initializeTags: (tags) => {
    set({ availableTags: tags });
  },
  
  /**
   * createTag
   * 
   * Crée un nouveau tag et l'ajoute à availableTags.
   * 
   * @param name - Nom du tag
   * @param color - Couleur du tag (doit être un token Suivi)
   * @returns Le tag créé avec un ID unique
   */
  createTag: (name, color) => {
    const newTag: SuiviTag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color,
    };
    
    set((state) => ({
      availableTags: [...state.availableTags, newTag],
    }));
    
    return newTag;
  },
  
  /**
   * updateTag
   * 
   * Met à jour le nom et/ou la couleur d'un tag existant.
   * 
   * @param tagId - ID du tag à mettre à jour
   * @param name - Nouveau nom
   * @param color - Nouvelle couleur
   */
  updateTag: (tagId, name, color) => {
    set((state) => ({
      availableTags: state.availableTags.map((tag) =>
        tag.id === tagId ? { ...tag, name: name.trim(), color } : tag
      ),
    }));
  },
  
  /**
   * deleteTag
   * 
   * Supprime un tag de availableTags.
   * Les tags statiques de mockTags sont protégés et ne peuvent pas être supprimés.
   * 
   * @param tagId - ID du tag à supprimer
   */
  deleteTag: (tagId) => {
    // Ne pas supprimer les tags statiques de mockTags
    const isStaticTag = mockTags.some((tag) => tag.id === tagId);
    if (isStaticTag) {
      return; // Ne pas supprimer les tags statiques
    }
    
    set((state) => ({
      availableTags: state.availableTags.filter((tag) => tag.id !== tagId),
    }));
  },
  
  /**
   * getTagById
   * 
   * Récupère un tag par son ID.
   * 
   * @param tagId - ID du tag à récupérer
   * @returns Le tag si trouvé, undefined sinon
   */
  getTagById: (tagId) => {
    return get().availableTags.find((tag) => tag.id === tagId);
  },
  
  /**
   * getAllTags
   * 
   * Récupère tous les tags disponibles.
   * 
   * @returns Liste de tous les tags
   */
  getAllTags: () => {
    return get().availableTags;
  },
}));










