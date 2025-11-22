/**
 * EXEMPLE D'INTÉGRATION - HomeScreen avec RecentActivityModal et ActivityDetailModal
 * 
 * Ce fichier montre comment intégrer les modals d'activité dans un écran parent.
 * 
 * Pour utiliser dans HomeScreen.tsx :
 * 1. Importer les modals
 * 2. Ajouter les states pour gérer la visibilité
 * 3. Brancher le callback onSelect de RecentActivityModal
 * 4. Afficher ActivityDetailModal avec l'événement sélectionné
 * 
 * Exemple de code à ajouter dans HomeScreen.tsx :
 */

import React, { useState } from 'react';
import { RecentActivityModal } from '@components/activity/RecentActivityModal';
import { ActivityDetailModal } from '@components/activity/ActivityDetailModal';
import type { SuiviActivityEvent } from '../types/activity';

// Dans le composant HomeScreen :
export function HomeScreenExample() {
  // State pour le modal d'activités récentes
  const [recentActivityModalVisible, setRecentActivityModalVisible] = useState(false);
  
  // State pour le modal de détail d'activité
  const [selectedActivity, setSelectedActivity] = useState<SuiviActivityEvent | null>(null);
  const [activityDetailModalVisible, setActivityDetailModalVisible] = useState(false);

  // Handler pour ouvrir le modal d'activités récentes
  const handleOpenRecentActivity = () => {
    setRecentActivityModalVisible(true);
  };

  // Handler pour fermer le modal d'activités récentes
  const handleCloseRecentActivity = () => {
    setRecentActivityModalVisible(false);
  };

  // Handler appelé quand une activité est sélectionnée dans RecentActivityModal
  const handleSelectActivity = (event: SuiviActivityEvent) => {
    setSelectedActivity(event);
    setActivityDetailModalVisible(true);
    // Optionnel : fermer le modal d'activités récentes
    // setRecentActivityModalVisible(false);
  };

  // Handler pour fermer le modal de détail
  const handleCloseActivityDetail = () => {
    setActivityDetailModalVisible(false);
    setSelectedActivity(null);
  };

  return (
    <>
      {/* Votre contenu HomeScreen ici */}
      
      {/* Bouton pour ouvrir le modal d'activités récentes */}
      {/* <SuiviButton
        title="Voir les activités récentes"
        onPress={handleOpenRecentActivity}
        variant="primary"
      /> */}

      {/* Modal d'activités récentes */}
      <RecentActivityModal
        visible={recentActivityModalVisible}
        onClose={handleCloseRecentActivity}
        onSelect={handleSelectActivity}
      />

      {/* Modal de détail d'activité */}
      <ActivityDetailModal
        visible={activityDetailModalVisible}
        event={selectedActivity}
        onClose={handleCloseActivityDetail}
      />
    </>
  );
}

