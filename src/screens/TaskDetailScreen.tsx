import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
  Modal,
  Alert,
  Clipboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@components/Screen';
import { ScreenHeader } from '@components/layout/ScreenHeader';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviSwitch } from '@components/ui/SuiviSwitch';
import { UserAvatar } from '@components/ui/UserAvatar';
import { SuiviStatusPicker } from '@components/ui/SuiviStatusPicker';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { SuiviButton } from '@components/ui/SuiviButton';
import * as DocumentPicker from 'expo-document-picker';
import { useTaskById } from '../tasks/useTaskById';
import { useTasksContext } from '../tasks/TasksContext';
import type { TaskStatus, TaskQuickAction, Attachment } from '../types/task';
import { useTaskActivity } from '@hooks/useActivity';
import { useUser } from '@hooks/useUser';
import { tokens, getShadowStyle } from '@theme';
import type { AppStackParamList } from '../navigation/types';
import { QuickActionWeather } from '@components/tasks/quickactions/QuickActionWeather';
import { QuickActionProgress } from '@components/tasks/quickactions/QuickActionProgress';
import { QuickActionRating } from '@components/tasks/quickactions/QuickActionRating';
import { QuickActionCheckbox } from '@components/tasks/quickactions/QuickActionCheckbox';
import { QuickActionSelect } from '@components/tasks/quickactions/QuickActionSelect';
import { QuickActionCalendar } from '@components/tasks/quickactions/QuickActionCalendar';
import { QuickActionApproval } from '@components/tasks/quickactions/QuickActionApproval';
import { QuickActionComment } from '@components/tasks/quickactions/QuickActionComment';
import type { SuiviActivityEvent } from '../types/activity';

type TaskDetailRoute = RouteProp<AppStackParamList, 'TaskDetail'>;

/**
 * TaskDetailScreen
 * 
 * Détails d'une tâche avec :
 * - Détails complets de la tâche depuis useTaskById() (source unique de vérité)
 * - Affichage du statut (read-only, les changements se font uniquement via Quick Actions)
 * - Breadcrumb projet
 * - Assigned user (useUser)
 * - Section "Recent updates" (useActivityFeed filtré par taskId)
 * - Quick Actions pour interagir avec la tâche
 * 
 * TODO: Replace useTaskById() with real Suivi API calls when backend is ready.
 */
export function TaskDetailScreen() {
  const route = useRoute<TaskDetailRoute>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { taskId } = route.params;
  
  // Source unique de vérité pour les tâches - TODO: Replace with real Suivi API
  const { task, isLoading: isLoadingTask, error: taskError } = useTaskById(taskId);
  const { updateTask, deleteTaskInContext } = useTasksContext();
  
  const { data: user } = useUser();
  const { data: taskActivities = [] } = useTaskActivity(taskId);

  // Status actuel de la tâche (dérivé du store)
  const taskStatus = task?.status;
  
  // Priorité actuelle de la tâche (dérivée du store)
  const taskPriority = task?.priority;


  // États pour les modals/pickers d'édition
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);
  const [assigneePickerVisible, setAssigneePickerVisible] = useState(false);
  const [dueDatePickerVisible, setDueDatePickerVisible] = useState(false);
  const [priorityPickerVisible, setPriorityPickerVisible] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(task?.description || '');
  const [dueDateInput, setDueDateInput] = useState(task?.dueDate || '');
  
  // États pour les custom fields
  const [customFieldEditModal, setCustomFieldEditModal] = useState<{ fieldId: string; type: string } | null>(null);
  const [customFieldInputValue, setCustomFieldInputValue] = useState<string>('');
  const [customFieldDateInput, setCustomFieldDateInput] = useState<string>('');

  // États pour le nouveau header et onglets
  const [optionsSheetVisible, setOptionsSheetVisible] = useState(false);
  const initialTab = route.params?.openTab ?? 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'attachments'>(initialTab);

  // Fusionner task.activities avec taskActivities (API), avec déduplication par id et tri par date DESC
  const allActivities = [
    ...(task?.activities || []),
    ...taskActivities,
  ]
    .filter((activity, index, self) => 
      // Dédupliquer par id (éviter les doublons entre task.activities et API)
      index === self.findIndex(a => a.id === activity.id)
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // DESC
    });

  // Synchroniser descriptionValue avec task.description quand task change
  React.useEffect(() => {
    if (task?.description !== undefined) {
      setDescriptionValue(task.description);
    }
  }, [task?.description]);

  // Synchroniser dueDateInput avec task.dueDate quand task change
  React.useEffect(() => {
    if (task?.dueDate !== undefined) {
      setDueDateInput(task.dueDate);
    }
  }, [task?.dueDate]);

  // Helper pour créer une activité de mise à jour de tâche
  function createActivityForTaskUpdate(fieldName: string, newValue: any, oldValue?: any): SuiviActivityEvent | null {
    if (!task || !user) return null;

    const activityEntry: SuiviActivityEvent = {
      id: `local-${Date.now()}`,
      source: 'BOARD',
      eventType: 'TASK_REPLANNED',
      title: t('activity.actions.task_updated', { field: fieldName, value: String(newValue) }),
      workspaceName: task.location?.workspaceName || 'Default',
      boardName: task.location?.boardName || '',
      actor: {
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        userId: user.id,
      },
      createdAt: new Date().toISOString(),
      severity: 'INFO',
      taskInfo: {
        taskId: task.id,
        taskTitle: task.title,
      },
    };

    return activityEntry;
  }

  // Handle Quick Action completion (mock) - pour Approval et Comment uniquement
  async function handleMockAction(result: { actionType: string; details: Record<string, any> }) {
    if (!task || !user) return;

    // Create a local activity entry
    const activityEntry: SuiviActivityEvent = {
      id: `local-${Date.now()}`,
      source: 'BOARD',
      eventType: getEventTypeFromActionType(result.actionType),
      title: getActivityTitle(result.actionType, result.details, t),
      workspaceName: task.location?.workspaceName || 'Default',
      boardName: task.location?.boardName || '',
      actor: {
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        userId: user.id,
      },
      createdAt: new Date().toISOString(),
      severity: 'INFO',
      taskInfo: {
        taskId: task.id,
        taskTitle: task.title,
      },
    };

    // Ajouter l'activité via un appel atomique (pas de modification de champ, juste l'activité)
    try {
      await updateTask(task.id, {
        activities: [activityEntry]
      });
    } catch (err) {
      console.error('Error adding activity to task:', err);
    }
  }

  // Handler pour mettre à jour le statut
  async function handleStatusChange(newStatus: TaskStatus) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('taskDetail.status'), formatStatus(newStatus, t), formatStatus(task.status, t));
      
      // Un seul appel atomique avec status ET activities
      await updateTask(task.id, {
        status: newStatus,
        activities: activity ? [activity] : []
      });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  }

  // Handler pour mettre à jour la due date
  async function handleDueDateChange(date: string) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('taskDetail.dueDate'), formatDate(date), task.dueDate ? formatDate(task.dueDate) : undefined);
      
      // Un seul appel atomique avec dueDate ET activities
      await updateTask(task.id, {
        dueDate: date,
        activities: activity ? [activity] : []
      });
      setDueDatePickerVisible(false);
    } catch (err) {
      console.error('Error updating task due date:', err);
    }
  }

  // Handler pour mettre à jour l'assignee
  async function handleAssigneeChange(selectedUser: { id: string; name: string; avatarUrl?: string }) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('taskDetail.assignee'), selectedUser.name, task.assignee?.name);
      
      // Un seul appel atomique avec assignee ET activities
      await updateTask(task.id, {
        assignee: selectedUser,
        activities: activity ? [activity] : []
      });
      setAssigneePickerVisible(false);
    } catch (err) {
      console.error('Error updating task assignee:', err);
    }
  }

  // Handler pour mettre à jour la priority
  async function handlePriorityChange(newPriority: 'normal' | 'low' | 'high') {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('taskDetail.priority'), t(`taskDetail.priority.${newPriority}`), task.priority ? t(`taskDetail.priority.${task.priority}`) : undefined);
      
      // Un seul appel atomique avec priority ET activities
      await updateTask(task.id, {
        priority: newPriority,
        activities: activity ? [activity] : []
      });
      setPriorityPickerVisible(false);
    } catch (err) {
      console.error('Error updating task priority:', err);
    }
  }

  // Handler pour mettre à jour la description
  async function handleDescriptionSave() {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('taskDetail.description'), descriptionValue, task.description);
      
      // Un seul appel atomique avec description ET activities
      await updateTask(task.id, {
        description: descriptionValue,
        activities: activity ? [activity] : []
      });
      setEditingDescription(false);
    } catch (err) {
      console.error('Error updating task description:', err);
    }
  }

  // Handler pour mettre à jour le progress
  async function handleProgressChange(progress: number) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('quickActions.progress.title'), `${progress}%`, task.progress !== undefined ? `${task.progress}%` : undefined);
      
      // Un seul appel atomique avec progress ET activities
      await updateTask(task.id, {
        progress,
        activities: activity ? [activity] : []
      });
    } catch (err) {
      console.error('Error updating task progress:', err);
    }
  }

  // Wrapper pour QuickActionProgress qui extrait la valeur du payload
  function handleProgressAction(result: { actionType: string; details: Record<string, any> }) {
    // QuickActionProgress envoie { progress, min, max } dans details
    if (result.details.progress !== undefined) {
      handleProgressChange(result.details.progress);
    } else {
      handleMockAction(result);
    }
  }

  // Handler pour mettre à jour le rating
  async function handleRatingChange(rating: number) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('quickActions.rating.title'), `${rating}`, task.rating !== undefined ? `${task.rating}` : undefined);
      
      // Un seul appel atomique avec rating ET activities
      await updateTask(task.id, {
        rating,
        activities: activity ? [activity] : []
      });
    } catch (err) {
      console.error('Error updating task rating:', err);
    }
  }

  // Handler pour mettre à jour le weather
  async function handleWeatherChange(weather: string) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('quickActions.weather.title'), weather, task.weather);
      
      // Un seul appel atomique avec weather ET activities
      await updateTask(task.id, {
        weather,
        activities: activity ? [activity] : []
      });
    } catch (err) {
      console.error('Error updating task weather:', err);
    }
  }

  // Handler pour mettre à jour le checkbox
  async function handleCheckboxChange(checked: boolean) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('quickActions.checkbox.title'), checked ? t('quickActions.checkbox.completed') : t('taskDetail.cancel'), task.checkboxValue !== undefined ? (task.checkboxValue ? t('quickActions.checkbox.completed') : t('taskDetail.cancel')) : undefined);
      
      // Un seul appel atomique avec checkboxValue ET activities
      await updateTask(task.id, {
        checkboxValue: checked,
        activities: activity ? [activity] : []
      });
    } catch (err) {
      console.error('Error updating task checkbox:', err);
    }
  }

  // Handler pour mettre à jour le select
  async function handleSelectChange(selectedOption: string) {
    if (!task) return;
    try {
      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(t('quickActions.select.title'), selectedOption, task.selectValue);
      
      // Un seul appel atomique avec selectValue ET activities
      await updateTask(task.id, {
        selectValue: selectedOption,
        activities: activity ? [activity] : []
      });
    } catch (err) {
      console.error('Error updating task select:', err);
    }
  }

  // Handler pour mettre à jour un custom field
  async function handleCustomFieldChange(fieldId: string, newValue: any) {
    if (!task || !task.customFields) return;
    try {
      const field = task.customFields.find((cf) => cf.id === fieldId);
      if (!field) return;

      const oldValue = field.value;
      
      // Mettre à jour uniquement le champ modifié
      const updatedCustomFields = task.customFields.map((cf) =>
        cf.id === fieldId ? { ...cf, value: newValue } : cf
      );

      // Créer l'activité AVANT l'appel atomique
      const activity = createActivityForTaskUpdate(field.label, String(newValue), oldValue ? String(oldValue) : undefined);
      
      // Un seul appel atomique avec customFields ET activities
      await updateTask(task.id, {
        customFields: updatedCustomFields,
        activities: activity ? [activity] : []
      });
      
      setCustomFieldEditModal(null);
      setCustomFieldInputValue('');
      setCustomFieldDateInput('');
    } catch (err) {
      console.error('Error updating custom field:', err);
    }
  }

  // Handlers pour les options du bottom-sheet
  async function handleShareTask() {
    if (!task) return;
    // Mock: TODO: Implémenter le partage réel avec expo-sharing ou Linking
    console.log('Share task:', task.id);
    Alert.alert(t('taskDetail.options.share'), `Task ID: ${task.id}`);
    setOptionsSheetVisible(false);
  }

  async function handleCopyTaskId() {
    if (!task) return;
    try {
      // Utiliser Clipboard API de React Native (disponible dans RN 0.81.5)
      if (Clipboard && Clipboard.setString) {
        Clipboard.setString(task.id);
        Alert.alert(t('taskDetail.options.copyId'), 'Task ID copied to clipboard');
      } else {
        // Fallback si Clipboard n'est pas disponible
        Alert.alert(t('taskDetail.options.copyId'), `Task ID: ${task.id}`);
      }
    } catch (err) {
      // Fallback en cas d'erreur
      Alert.alert(t('taskDetail.options.copyId'), `Task ID: ${task.id}`);
    }
    setOptionsSheetVisible(false);
  }

  async function handleToggleFavorite() {
    if (!task) return;
    try {
      // Mock: TODO: Ajouter isFavorite au type Task et à l'API
      const currentFavorite = (task as any).isFavorite || false;
      await updateTask(task.id, { isFavorite: !currentFavorite } as any);
      setOptionsSheetVisible(false);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }

  async function handleDeleteTask() {
    if (!task) return;
    Alert.alert(
      t('taskDetail.options.deleteConfirmTitle'),
      t('taskDetail.options.deleteConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTaskInContext(task.id);
              setOptionsSheetVisible(false);
              navigation.goBack();
            } catch (err) {
              console.error('Error deleting task:', err);
              Alert.alert(t('common.error'), 'Failed to delete task');
            }
          },
        },
      ],
    );
  }

  // Handler pour sélectionner un document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        console.log('Selected file:', result);
        // TODO: brancher au backend plus tard
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  // Mock users pour le picker d'assignee
  const mockUsers = [
    { id: '1', name: 'Julien', avatarUrl: undefined },
    { id: '2', name: 'Alice', avatarUrl: undefined },
    { id: '3', name: 'Bob', avatarUrl: undefined },
  ];

  // Render activity item (comment or system activity)
  function renderActivityItem(activity: SuiviActivityEvent) {
    // Detect comment: eventType is COMMENT
    const isComment = activity.eventType === 'COMMENT';
    
    if (isComment) {
      // Extract comment text from title (format: "{prefix} : {comment}" - FR/EN agnostic)
      const commentText = activity.title.split(':').slice(1).join(':').trim() || activity.title;
      
      // Render comment bubble
      return (
        <View key={activity.id} style={[styles.commentContainer, { backgroundColor: isDark ? tokens.colors.surface.darkVariant : tokens.colors.surface.variant }]}>
          <SuiviText variant="body" color="primary" style={styles.commentAuthor}>
            {activity.actor.name}
          </SuiviText>
          <SuiviText variant="body" color="primary" style={styles.commentText}>
            {commentText}
          </SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.commentTimestamp}>
            {formatActivityDate(activity.createdAt, t)}
          </SuiviText>
        </View>
      );
    }
    
    // Render system activity (simple line with dot)
    return (
      <View key={activity.id} style={styles.activityRow}>
        <View style={styles.activityDot} />
        <View style={styles.activityContent}>
          <SuiviText variant="body" color="secondary" style={styles.activityText}>
            {activity.title}
          </SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.activityTimestamp}>
            {formatActivityDate(activity.createdAt, t)}
          </SuiviText>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoadingTask) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={tokens.colors.brand.primary} />
          <SuiviText variant="body" color="secondary" style={styles.loadingText}>
            Loading task...
          </SuiviText>
        </View>
      </Screen>
    );
  }

  // Error state: tâche introuvable
  if (taskError || !task) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <SuiviText variant="body" color="primary" style={styles.errorText}>
            {taskError?.message || 'Task not found'}
          </SuiviText>
          <SuiviText variant="body" color="secondary" style={styles.errorSubtext}>
            {/* TODO: handle this case properly when wired to real API */}
            The task may have been deleted or moved.
          </SuiviText>
        </View>
      </Screen>
    );
  }

  const isDark = theme.dark;
  const statusColors = getStatusColors(taskStatus!, isDark);

  // Diagnostic log for Quick Actions
  console.log(
    "QA-DIAG: TaskDetailScreen rendering for",
    task?.id,
    "quickActions =",
    task?.quickActions
  );

  // Helper function to render a single Quick Action
  function renderQuickAction(qa: TaskQuickAction, index: number) {
    switch (qa.type) {
      case 'WEATHER':
        return (
          <QuickActionWeather
            key={index}
            task={task!}
            payload={{ ...qa.payload, value: task?.weather ?? qa.payload?.value }}
            onActionComplete={(result) => {
              if (result.details.weather) {
                handleWeatherChange(result.details.weather);
              } else {
                handleMockAction(result);
              }
            }}
          />
        );
      case 'PROGRESS':
        return (
          <QuickActionProgress
            key={index}
            task={task!}
            payload={{ ...qa.payload, value: task?.progress ?? qa.payload?.value ?? 0 }}
            onActionComplete={handleProgressAction}
          />
        );
      case 'RATING':
        return (
          <QuickActionRating
            key={index}
            task={task!}
            payload={{ value: task?.rating ?? undefined }}
            onActionComplete={(result) => {
              if (result.details.rating !== undefined) {
                handleRatingChange(result.details.rating);
              } else {
                handleMockAction(result);
              }
            }}
          />
        );
      case 'CHECKBOX':
        return (
          <QuickActionCheckbox
            key={index}
            task={task!}
            payload={{ value: task?.checkboxValue ?? undefined }}
            onActionComplete={(result) => {
              if (result.details.checked !== undefined) {
                handleCheckboxChange(result.details.checked);
              } else {
                handleMockAction(result);
              }
            }}
          />
        );
      case 'SELECT':
        return (
          <QuickActionSelect
            key={index}
            task={task!}
            payload={{ ...qa.payload, value: task?.selectValue ?? qa.payload?.value }}
            onActionComplete={(result) => {
              if (result.details.selectedOption) {
                handleSelectChange(result.details.selectedOption);
              } else {
                handleMockAction(result);
              }
            }}
          />
        );
      case 'CALENDAR':
        return (
          <QuickActionCalendar
            key={index}
            task={task!}
            payload={{ value: task?.dueDate ?? undefined }}
            onActionComplete={(result) => {
              if (result.details.date) {
                handleDueDateChange(result.details.date);
              } else {
                handleMockAction(result);
              }
            }}
          />
        );
      case 'APPROVAL':
        return (
          <QuickActionApproval
            key={index}
            task={task!}
            payload={qa.payload}
            onActionComplete={handleMockAction}
          />
        );
      case 'COMMENT':
        return (
          <QuickActionComment
            key={index}
            task={task!}
            onActionComplete={handleMockAction}
          />
        );
      default:
        return null;
    }
  }


  // Format breadcrumb
  const formatBreadcrumb = (): string | null => {
    if (!task.location) return null;
    const { workspaceName, boardName } = task.location;
    if (workspaceName && boardName) {
      return t('taskDetail.breadcrumb', { workspace: workspaceName, board: boardName });
    }
    if (workspaceName) return workspaceName;
    if (boardName) return boardName;
    return null;
  };

  return (
    <Screen noTopBackground>
      <KeyboardAwareScrollView
        extraScrollHeight={80}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: tokens.spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.pagePadding, { paddingTop: insets.top + tokens.spacing.md }]}>
        {/* Header standardisé */}
        <ScreenHeader
          title={task.title}
          showBackButton
          onBack={() => navigation.goBack()}
          spacing="xs"
          rightAction={
            <Pressable onPress={() => setOptionsSheetVisible(true)}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary}
              />
            </Pressable>
          }
        />

        {/* Séparateur Top App Bar M3 style */}
        <View
          style={[
            styles.headerSeparator,
            {
              backgroundColor: isDark
                ? tokens.colors.border.darkMode.default
                : tokens.colors.border.default,
            },
            getShadowStyle('sm', isDark),
          ]}
        />

        {/* Status Picker Modal */}
        <SuiviStatusPicker
          visible={statusPickerVisible}
          onClose={() => setStatusPickerVisible(false)}
          currentStatus={taskStatus!}
          onSelectStatus={handleStatusChange}
        />

        {/* Onglets : Overview / Comments / Attachments */}
        <View style={styles.tabsContainer}>
          <SegmentedControl
            options={[
              { key: 'overview', label: t('taskDetail.tabs.overview') },
              { key: 'comments', label: t('taskDetail.tabs.comments') },
              { key: 'attachments', label: t('taskDetail.tabs.attachments') },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as 'overview' | 'comments' | 'attachments')}
            variant="fullWidth"
          />
        </View>

        {/* Bottom-sheet d'options */}
        <Modal
          visible={optionsSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setOptionsSheetVisible(false)}
          statusBarTranslucent
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setOptionsSheetVisible(false)}
            />
            <View style={[
              styles.optionsSheetContainer,
              { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default },
              { ...getShadowStyle('lg', isDark), shadowOffset: { width: 0, height: -2 } },
            ]}>
              <SafeAreaView edges={['bottom']}>
                {/* Handle indicator */}
                <View style={styles.handleContainer}>
                  <View
                    style={[
                      styles.handleIndicator,
                      {
                        backgroundColor: isDark
                          ? tokens.colors.neutral.medium
                          : tokens.colors.neutral.light,
                      },
                    ]}
                  />
                </View>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {/* Share */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionItem,
                      {
                        opacity: pressed ? 0.7 : 1,
                        borderBottomColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                      },
                    ]}
                    onPress={handleShareTask}
                  >
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={24}
                      color={isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary}
                      style={styles.optionIcon}
                    />
                    <SuiviText variant="body" style={{ color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary }}>
                      {t('taskDetail.options.share')}
                    </SuiviText>
                  </Pressable>

                  {/* Copy ID */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionItem,
                      {
                        opacity: pressed ? 0.7 : 1,
                        borderBottomColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                      },
                    ]}
                    onPress={handleCopyTaskId}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={24}
                      color={isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary}
                      style={styles.optionIcon}
                    />
                    <SuiviText variant="body" style={{ color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary }}>
                      {t('taskDetail.options.copyId')}
                    </SuiviText>
                  </Pressable>

                  {/* Favorite */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionItem,
                      {
                        opacity: pressed ? 0.7 : 1,
                        borderBottomColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                      },
                    ]}
                    onPress={handleToggleFavorite}
                  >
                    <MaterialCommunityIcons
                      name={(task as any)?.isFavorite ? 'star' : 'star-outline'}
                      size={24}
                      color={isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary}
                      style={styles.optionIcon}
                    />
                    <SuiviText variant="body" style={{ color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary }}>
                      {(task as any)?.isFavorite ? t('taskDetail.options.removeFavorite') : t('taskDetail.options.addFavorite')}
                    </SuiviText>
                  </Pressable>

                  {/* Delete */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionItem,
                      styles.optionItemDelete,
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                    onPress={handleDeleteTask}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={24}
                      color={tokens.colors.semantic.error}
                      style={styles.optionIcon}
                    />
                    <SuiviText variant="body" style={{ color: tokens.colors.semantic.error }}>
                      {t('taskDetail.options.delete')}
                    </SuiviText>
                  </Pressable>
                </View>
              </SafeAreaView>
            </View>
          </View>
        </Modal>

        {/* Contenu conditionnel selon l'onglet actif */}
        {activeTab === 'overview' && (
          <>
            {/* Bloc Informations principales */}
        <View style={[styles.section, { marginBottom: tokens.spacing.xl }]}>
          <SuiviText variant="h2" style={styles.sectionTitle}>
            {t('taskDetail.information')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.metadataCard}>
            {/* Statut (éditable) */}
            <View style={styles.metadataRow}>
              <View style={styles.metadataLabelContainer}>
                <MaterialCommunityIcons
                  name="flag"
                  size={16}
                  color={tokens.colors.neutral.medium}
                  style={styles.metadataIcon}
                />
                <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                  {t('taskDetail.status')}
                </SuiviText>
              </View>
              <Pressable
                onPress={() => setStatusPickerVisible(true)}
                style={styles.metadataValueContainer}
              >
                <View
                  style={[
                    styles.statusBadgeCompact,
                    {
                      backgroundColor: statusColors.bg,
                      borderColor: statusColors.border,
                    },
                  ]}
                >
                  <View style={styles.statusBadgeContent}>
                    <SuiviText variant="label" style={{ color: statusColors.text, fontWeight: '600' }}>
                      {formatStatus(taskStatus!, t)}
                    </SuiviText>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={16}
                  color={tokens.colors.neutral.medium}
                  style={styles.metadataIcon}
                />
              </Pressable>
            </View>

            {/* Date d'échéance (éditable) */}
            <View style={styles.metadataRow}>
              <View style={styles.metadataLabelContainer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={16}
                  color={tokens.colors.neutral.medium}
                  style={styles.metadataIcon}
                />
                <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                  {t('taskDetail.dueDate')}
                </SuiviText>
              </View>
              {task.dueDate ? (
                <Pressable onPress={() => setDueDatePickerVisible(true)}>
                  <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                    {formatDate(task.dueDate)}
                  </SuiviText>
                </Pressable>
              ) : (
                <Pressable onPress={() => setDueDatePickerVisible(true)}>
                  <SuiviText variant="body" color="secondary" style={styles.metadataValue}>
                    {t('taskDetail.editDueDate')}
                  </SuiviText>
                </Pressable>
              )}
            </View>

            {/* Assignee (éditable) */}
            <View style={styles.metadataRow}>
              <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                {t('taskDetail.assignee')}
              </SuiviText>
              <Pressable
                onPress={() => setAssigneePickerVisible(true)}
                style={styles.metadataValueContainer}
              >
                {task.assignee?.name ? (
                  <>
                    <UserAvatar
                      size={24}
                      fullName={task.assignee.name}
                      style={styles.metadataAvatar}
                    />
                    <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                      {task.assignee.name}
                    </SuiviText>
                  </>
                ) : (
                  <SuiviText variant="body" color="secondary" style={styles.metadataValue}>
                    {t('taskDetail.editAssignee')}
                  </SuiviText>
                )}
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={16}
                  color={tokens.colors.neutral.medium}
                  style={styles.metadataIcon}
                />
              </Pressable>
            </View>

            {/* Dernière mise à jour */}
            {task.updatedAt && (
              <View style={styles.metadataRow}>
                <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                  {t('taskDetail.updated')}
                </SuiviText>
                <SuiviText variant="body" color="secondary" style={styles.metadataValue}>
                  {formatDate(task.updatedAt)}
                </SuiviText>
              </View>
            )}

            {/* Priority (éditable) */}
            <View style={styles.metadataRow}>
              <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                {t('taskDetail.priority')}
              </SuiviText>
              <Pressable
                onPress={() => setPriorityPickerVisible(true)}
                style={styles.metadataValueContainer}
              >
                <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                  {t(`taskDetail.priority.${taskPriority || 'normal'}`)}
                </SuiviText>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={16}
                  color={tokens.colors.neutral.medium}
                  style={styles.metadataIcon}
                />
              </Pressable>
            </View>

            {/* Project */}
            {task.projectName && (
              <View style={[styles.metadataRow, styles.metadataRowLast]}>
                <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                  {t('taskDetail.projectBoard')}
                </SuiviText>
                <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                  {task.projectName}
                </SuiviText>
              </View>
            )}

          </SuiviCard>

          {/* Section Custom Fields */}
          {task.customFields && task.customFields.length > 0 && (
            <View style={[styles.section, { marginTop: tokens.spacing.lg, marginBottom: tokens.spacing.xl }]}>
              <SuiviText variant="h2" style={styles.sectionTitle}>
                {t('taskDetail.customFields')}
              </SuiviText>
              <SuiviCard padding="md" elevation="card" variant="default" style={styles.metadataCard}>
                {task.customFields.map((field, index) => {
                  const isLast = index === task.customFields!.length - 1;
                  
                  // Rendre la valeur selon le type
                  const renderValue = () => {
                    if (field.value === undefined || field.value === null || field.value === '') {
                      return (
                        <SuiviText variant="body" color="secondary" style={styles.metadataValue}>
                          {t('taskDetail.noValue')}
                        </SuiviText>
                      );
                    }
                    
                    switch (field.type) {
                      case 'boolean':
                        return (
                          <SuiviSwitch
                            value={Boolean(field.value)}
                            onValueChange={(value) => handleCustomFieldChange(field.id, value)}
                          />
                        );
                      case 'date':
                        return (
                          <Pressable onPress={() => {
                            setCustomFieldEditModal({ fieldId: field.id, type: 'date' });
                            setCustomFieldDateInput(field.value || '');
                          }}>
                            <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                              {formatDate(field.value)}
                            </SuiviText>
                          </Pressable>
                        );
                      case 'enum':
                      case 'multi':
                        return (
                          <Pressable
                            onPress={() => {
                              setCustomFieldEditModal({ fieldId: field.id, type: field.type });
                            }}
                            style={styles.metadataValueContainer}
                          >
                            <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                              {Array.isArray(field.value) ? field.value.join(', ') : String(field.value)}
                            </SuiviText>
                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={16}
                              color={tokens.colors.neutral.medium}
                              style={styles.metadataIcon}
                            />
                          </Pressable>
                        );
                      case 'number':
                        return (
                          <Pressable onPress={() => {
                            setCustomFieldEditModal({ fieldId: field.id, type: 'number' });
                            setCustomFieldInputValue(String(field.value || ''));
                          }}>
                            <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                              {String(field.value)}
                            </SuiviText>
                          </Pressable>
                        );
                      case 'text':
                      default:
                        return (
                          <Pressable onPress={() => {
                            setCustomFieldEditModal({ fieldId: field.id, type: 'text' });
                            setCustomFieldInputValue(String(field.value || ''));
                          }}>
                            <SuiviText variant="body" color="primary" style={styles.metadataValue}>
                              {String(field.value)}
                            </SuiviText>
                          </Pressable>
                        );
                    }
                  };

                  return (
                    <View key={field.id} style={[styles.metadataRow, isLast && styles.metadataRowLast]}>
                      <SuiviText variant="label" color="secondary" style={styles.metadataLabel}>
                        {field.label}
                      </SuiviText>
                      {field.type === 'boolean' ? (
                        <View style={styles.metadataValueContainer}>
                          {renderValue()}
                        </View>
                      ) : (
                        renderValue()
                      )}
                    </View>
                  );
                })}
              </SuiviCard>
            </View>
          )}

          {/* Description (éditable) - en bloc plein */}
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.descriptionCard}>
            <View style={styles.descriptionHeader}>
              <SuiviText variant="label" color="secondary" style={styles.descriptionLabel}>
                {t('taskDetail.description')}
              </SuiviText>
              {!editingDescription && (
                <Pressable
                  onPress={() => {
                    setDescriptionValue(task?.description || '');
                    setEditingDescription(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={16}
                    color={tokens.colors.neutral.medium}
                  />
                </Pressable>
              )}
            </View>
            {editingDescription ? (
              <View style={styles.descriptionEditContainer}>
                <TextInput
                  style={[
                    styles.descriptionInput,
                    {
                      color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary,
                      borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                    },
                  ]}
                  value={descriptionValue}
                  onChangeText={setDescriptionValue}
                  multiline
                  numberOfLines={3}
                  placeholder={t('taskDetail.noDescription')}
                  placeholderTextColor={tokens.colors.neutral.medium}
                />
                <View style={styles.descriptionEditActions}>
                  <Pressable
                    onPress={() => {
                      setDescriptionValue(task?.description || '');
                      setEditingDescription(false);
                    }}
                    style={styles.descriptionEditButton}
                  >
                    <SuiviText variant="body" color="secondary">
                      {t('taskDetail.cancel')}
                    </SuiviText>
                  </Pressable>
                  <Pressable
                    onPress={handleDescriptionSave}
                    style={styles.descriptionEditButton}
                  >
                    <SuiviText variant="body" color="primary">
                      {t('taskDetail.save')}
                    </SuiviText>
                  </Pressable>
                </View>
              </View>
            ) : (
              <SuiviText variant="body" color={task.description ? 'primary' : 'secondary'} style={styles.descriptionText}>
                {task.description || t('taskDetail.noDescription')}
              </SuiviText>
            )}
          </SuiviCard>

          {/* Assignee Picker Modal */}
          <Modal
            visible={assigneePickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setAssigneePickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setAssigneePickerVisible(false)}
              />
              <View style={[styles.modalContent, { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default }]}>
                <SuiviText variant="h2" style={styles.modalTitle}>
                  {t('taskDetail.editAssignee')}
                </SuiviText>
                {mockUsers.map((mockUser) => (
                  <Pressable
                    key={mockUser.id}
                    onPress={() => handleAssigneeChange(mockUser)}
                    style={styles.assigneeOption}
                  >
                    <UserAvatar
                      size={32}
                      fullName={mockUser.name}
                      style={styles.assigneeOptionAvatar}
                    />
                    <SuiviText variant="body" color="primary">
                      {mockUser.name}
                    </SuiviText>
                    {task.assignee?.id === mockUser.id && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={tokens.colors.brand.primary}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </Modal>

          {/* Due Date Picker Modal */}
          <Modal
            visible={dueDatePickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setDueDatePickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setDueDatePickerVisible(false)}
              />
              <View style={[styles.modalContent, { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default }]}>
                <SuiviText variant="h2" style={styles.modalTitle}>
                  {t('taskDetail.editDueDate')}
                </SuiviText>
                <View style={styles.datePickerContainer}>
                  <TextInput
                    style={[
                      styles.dateInput,
                      {
                        color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary,
                        borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                        backgroundColor: isDark ? tokens.colors.surface.darkVariant : tokens.colors.surface.default,
                      },
                    ]}
                    value={dueDateInput}
                    onChangeText={(text) => {
                      setDueDateInput(text);
                      if (text.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        handleDueDateChange(text);
                      }
                    }}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={tokens.colors.neutral.medium}
                  />
                  <View style={styles.datePickerActions}>
                    <Pressable
                      onPress={() => setDueDatePickerVisible(false)}
                      style={styles.datePickerButton}
                    >
                      <SuiviText variant="body" color="secondary">
                        {t('taskDetail.cancel')}
                      </SuiviText>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        const today = new Date().toISOString().split('T')[0];
                        handleDueDateChange(today);
                        setDueDatePickerVisible(false);
                      }}
                      style={styles.datePickerButton}
                    >
                      <SuiviText variant="body" color="primary">
                        {t('tasks.sections.today')}
                      </SuiviText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          {/* Priority Picker Modal */}
          <Modal
            visible={priorityPickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setPriorityPickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setPriorityPickerVisible(false)}
              />
              <View style={[styles.modalContent, { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default }]}>
                <SuiviText variant="h2" style={styles.modalTitle}>
                  {t('taskDetail.priority')}
                </SuiviText>
                <Pressable
                  onPress={() => handlePriorityChange('normal')}
                  style={styles.assigneeOption}
                >
                  <SuiviText variant="body" color="primary">
                    {t('taskDetail.priority.normal')}
                  </SuiviText>
                  {(!taskPriority || taskPriority === 'normal') && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={tokens.colors.brand.primary}
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => handlePriorityChange('low')}
                  style={styles.assigneeOption}
                >
                  <SuiviText variant="body" color="primary">
                    {t('taskDetail.priority.low')}
                  </SuiviText>
                  {taskPriority === 'low' && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={tokens.colors.brand.primary}
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => handlePriorityChange('high')}
                  style={styles.assigneeOption}
                >
                  <SuiviText variant="body" color="primary">
                    {t('taskDetail.priority.high')}
                  </SuiviText>
                  {taskPriority === 'high' && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={tokens.colors.brand.primary}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Custom Field Edit Modals */}
          {customFieldEditModal && (() => {
            const field = task?.customFields?.find((cf) => cf.id === customFieldEditModal.fieldId);
            if (!field) return null;

            if (customFieldEditModal.type === 'text' || customFieldEditModal.type === 'number') {
              return (
                <Modal
                  visible={customFieldEditModal !== null}
                  transparent
                  animationType="slide"
                  onRequestClose={() => {
                    setCustomFieldEditModal(null);
                    setCustomFieldInputValue('');
                  }}
                >
                  <View style={styles.modalContainer}>
                    <Pressable
                      style={styles.modalBackdrop}
                      onPress={() => {
                        setCustomFieldEditModal(null);
                        setCustomFieldInputValue('');
                      }}
                    />
                    <View style={[styles.modalContent, { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default }]}>
                      <SuiviText variant="h2" style={styles.modalTitle}>
                        {field.label}
                      </SuiviText>
                      <View style={styles.datePickerContainer}>
                        <TextInput
                          style={[
                            styles.dateInput,
                            {
                              color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary,
                              borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                              backgroundColor: isDark ? tokens.colors.surface.darkVariant : tokens.colors.surface.default,
                            },
                          ]}
                          value={customFieldInputValue}
                          onChangeText={setCustomFieldInputValue}
                          keyboardType={customFieldEditModal.type === 'number' ? 'numeric' : 'default'}
                          placeholder={t('taskDetail.enterValue')}
                          placeholderTextColor={tokens.colors.neutral.medium}
                        />
                        <View style={styles.datePickerActions}>
                          <Pressable
                            onPress={() => {
                              setCustomFieldEditModal(null);
                              setCustomFieldInputValue('');
                            }}
                            style={styles.datePickerButton}
                          >
                            <SuiviText variant="body" color="secondary">
                              {t('taskDetail.cancel')}
                            </SuiviText>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              const value = customFieldEditModal.type === 'number' 
                                ? Number(customFieldInputValue) 
                                : customFieldInputValue;
                              handleCustomFieldChange(field.id, value);
                            }}
                            style={styles.datePickerButton}
                          >
                            <SuiviText variant="body" color="primary">
                              {t('taskDetail.save')}
                            </SuiviText>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
              );
            }

            if (customFieldEditModal.type === 'date') {
              return (
                <Modal
                  visible={customFieldEditModal !== null}
                  transparent
                  animationType="slide"
                  onRequestClose={() => {
                    setCustomFieldEditModal(null);
                    setCustomFieldDateInput('');
                  }}
                >
                  <View style={styles.modalContainer}>
                    <Pressable
                      style={styles.modalBackdrop}
                      onPress={() => {
                        setCustomFieldEditModal(null);
                        setCustomFieldDateInput('');
                      }}
                    />
                    <View style={[styles.modalContent, { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default }]}>
                      <SuiviText variant="h2" style={styles.modalTitle}>
                        {field.label}
                      </SuiviText>
                      <View style={styles.datePickerContainer}>
                        <TextInput
                          style={[
                            styles.dateInput,
                            {
                              color: isDark ? tokens.colors.text.dark.primary : tokens.colors.text.primary,
                              borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
                              backgroundColor: isDark ? tokens.colors.surface.darkVariant : tokens.colors.surface.default,
                            },
                          ]}
                          value={customFieldDateInput}
                          onChangeText={(text) => {
                            setCustomFieldDateInput(text);
                            if (text.match(/^\d{4}-\d{2}-\d{2}$/)) {
                              handleCustomFieldChange(field.id, text);
                            }
                          }}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor={tokens.colors.neutral.medium}
                        />
                        <View style={styles.datePickerActions}>
                          <Pressable
                            onPress={() => {
                              setCustomFieldEditModal(null);
                              setCustomFieldDateInput('');
                            }}
                            style={styles.datePickerButton}
                          >
                            <SuiviText variant="body" color="secondary">
                              {t('taskDetail.cancel')}
                            </SuiviText>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              const today = new Date().toISOString().split('T')[0];
                              handleCustomFieldChange(field.id, today);
                              setCustomFieldEditModal(null);
                              setCustomFieldDateInput('');
                            }}
                            style={styles.datePickerButton}
                          >
                            <SuiviText variant="body" color="primary">
                              {t('tasks.sections.today')}
                            </SuiviText>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
              );
            }

            if (customFieldEditModal.type === 'enum' || customFieldEditModal.type === 'multi') {
              return (
                <Modal
                  visible={customFieldEditModal !== null}
                  transparent
                  animationType="slide"
                  onRequestClose={() => {
                    setCustomFieldEditModal(null);
                  }}
                >
                  <View style={styles.modalContainer}>
                    <Pressable
                      style={styles.modalBackdrop}
                      onPress={() => {
                        setCustomFieldEditModal(null);
                      }}
                    />
                    <View style={[styles.modalContent, { backgroundColor: isDark ? tokens.colors.surface.darkElevated : tokens.colors.background.default }]}>
                      <SuiviText variant="h2" style={styles.modalTitle}>
                        {field.label}
                      </SuiviText>
                      {field.options?.map((option) => {
                        const isSelected = customFieldEditModal.type === 'multi'
                          ? Array.isArray(field.value) && field.value.includes(option)
                          : field.value === option;
                        
                        return (
                          <Pressable
                            key={option}
                            onPress={() => {
                              if (customFieldEditModal.type === 'multi') {
                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                const newValues = isSelected
                                  ? currentValues.filter((v) => v !== option)
                                  : [...currentValues, option];
                                handleCustomFieldChange(field.id, newValues);
                              } else {
                                handleCustomFieldChange(field.id, option);
                              }
                            }}
                            style={styles.assigneeOption}
                          >
                            <SuiviText variant="body" color="primary">
                              {option}
                            </SuiviText>
                            {isSelected && (
                              <MaterialCommunityIcons
                                name="check"
                                size={20}
                                color={tokens.colors.brand.primary}
                              />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </Modal>
              );
            }

            return null;
          })()}
        </View>

        {/* Bloc Actions rapides */}
        <View style={[styles.section, { marginTop: tokens.spacing.lg, marginBottom: tokens.spacing.md }]}>
          <SuiviText variant="h2" style={styles.sectionTitle}>
            {t('taskDetail.quickActions')}
          </SuiviText>
          
          {/* Afficher toutes les quick actions disponibles, une par ligne (exclure comment_input de l'onglet overview) */}
          {task.quickActions && task.quickActions.length > 0 ? (
            task.quickActions
              .filter((qa) => qa.uiHint !== 'comment_input')
              .map((qa, index) => (
                <View key={index} style={{ marginBottom: tokens.spacing.md }}>
                  {renderQuickAction(qa, index)}
                </View>
              ))
          ) : (
            <SuiviCard padding="md" elevation="sm" variant="outlined" style={styles.emptyActivityCard}>
              <SuiviText variant="body" color="secondary">
                {t('taskDetail.noActivity')}
              </SuiviText>
            </SuiviCard>
          )}
        </View>
          </>
        )}

        {activeTab === 'comments' && (
          <View style={[styles.section, { marginTop: tokens.spacing.md }]}>
            {/* QuickActionComment en haut */}
            {task.quickActions?.some(qa => qa.type === 'COMMENT') && (
              <View style={{ marginBottom: tokens.spacing.md }}>
                {task.quickActions
                  .filter(qa => qa.type === 'COMMENT')
                  .map((qa, index) => (
                    <View key={index} style={{ marginBottom: tokens.spacing.md }}>
                      {renderQuickAction(qa, index)}
                    </View>
                  ))}
              </View>
            )}

            {/* Liste des commentaires filtrés */}
            <SuiviText variant="h2" style={styles.sectionTitle}>
              {t('taskDetail.tabs.comments')}
            </SuiviText>
            <SuiviText variant="body" color="secondary" style={styles.sectionSubtitle}>
              {t('taskDetail.activitySubtitle')}
            </SuiviText>
            
            {(() => {
              const commentActivities = allActivities;
              return commentActivities.length > 0 ? (
                <SuiviCard padding="md" elevation="card" variant="default" style={styles.metadataCard}>
                  {commentActivities.map((activity) => renderActivityItem(activity))}
                </SuiviCard>
              ) : (
                <SuiviCard padding="md" elevation="sm" variant="outlined" style={styles.emptyActivityCard}>
                  <SuiviText variant="body" color="secondary">
                    {t('taskDetail.noActivity')}
                  </SuiviText>
                </SuiviCard>
              );
            })()}
          </View>
        )}

        {activeTab === 'attachments' && (
          <View style={styles.attachmentsContainer}>
            {task?.attachments && task.attachments.length > 0 ? (
              <>
                <SuiviCard padding="md" elevation="card" variant="default" style={styles.metadataCard}>
                  {task.attachments.map((attachment, index) => {
                    const isLast = index === task.attachments!.length - 1;
                    return (
                      <Pressable
                        key={attachment.id}
                        style={[
                          styles.metadataRow,
                          isLast && styles.metadataRowLast,
                          {
                            borderBottomColor: isDark
                              ? tokens.colors.border.darkMode.default
                              : tokens.colors.border.default,
                          },
                        ]}
                        onPress={() => {
                          // TODO: Ouvrir le fichier (Linking.openURL pour les URLs)
                          console.log('Open attachment:', attachment.url);
                        }}
                      >
                        <View style={styles.metadataLabelContainer}>
                          <MaterialCommunityIcons
                            name={getAttachmentIcon(attachment.type) as any}
                            size={20}
                            color={
                              isDark
                                ? tokens.colors.text.dark.primary
                                : tokens.colors.text.primary
                            }
                            style={styles.metadataIcon}
                          />
                          <View style={{ flex: 1, marginLeft: tokens.spacing.sm }}>
                            <SuiviText variant="body" color="primary" style={{ flexShrink: 1 }}>
                              {attachment.name}
                            </SuiviText>
                            <SuiviText variant="body" color="secondary" style={{ marginTop: tokens.spacing.xs }}>
                              {formatFileSize(attachment.size)}
                            </SuiviText>
                          </View>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={20}
                          color={
                            isDark
                              ? tokens.colors.text.dark.secondary
                              : tokens.colors.neutral.medium
                          }
                        />
                      </Pressable>
                    );
                  })}
                </SuiviCard>
                {/* Optionnel : Drop zone pour ajouter de nouveaux fichiers */}
                <View style={{ marginTop: tokens.spacing.lg }}>
                  <View
                    style={[
                      styles.attachmentsDropZone,
                      {
                        borderColor: isDark
                          ? tokens.colors.border.darkMode.default
                          : tokens.colors.border.default,
                        backgroundColor: isDark
                          ? tokens.colors.surface.darkVariant
                          : tokens.colors.background.default,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="file-upload"
                      size={36}
                      color={
                        isDark
                          ? tokens.colors.text.dark.secondary
                          : tokens.colors.text.secondary
                      }
                      style={styles.attachmentsIcon}
                    />
                    <SuiviButton
                      title={t('taskDetail.attachments.upload')}
                      variant="primary"
                      onPress={pickDocument}
                      style={styles.attachmentsButton}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View
                style={[
                  styles.attachmentsDropZone,
                  {
                    borderColor: isDark
                      ? tokens.colors.border.darkMode.default
                      : tokens.colors.border.default,
                    backgroundColor: isDark
                      ? tokens.colors.surface.darkVariant
                      : tokens.colors.background.default,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="file-upload"
                  size={48}
                  color={
                    isDark
                      ? tokens.colors.text.dark.secondary
                      : tokens.colors.text.secondary
                  }
                  style={styles.attachmentsIcon}
                />
                <SuiviText
                  variant="h2"
                  style={[
                    styles.attachmentsTitle,
                    {
                      color: isDark
                        ? tokens.colors.text.dark.primary
                        : tokens.colors.text.primary,
                    },
                  ]}
                >
                  {t('taskDetail.attachments.empty')}
                </SuiviText>
                <SuiviButton
                  title={t('taskDetail.attachments.upload')}
                  variant="primary"
                  onPress={pickDocument}
                  style={styles.attachmentsButton}
                />
              </View>
            )}
          </View>
        )}
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

/**
 * Convertit une couleur hex en rgba avec opacité
 */
function addOpacityToColor(color: string, opacity: number): string {
  // Supprimer le # si présent
  const hex = color.replace('#', '');
  
  // Convertir en RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Retourner rgba
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Retourne les couleurs spécifiques pour un statut (pour TaskDetailScreen)
 * Supporte le dark mode avec des couleurs adaptées
 */
function getStatusColors(status: TaskStatus, isDark: boolean): { border: string; text: string; bg: string } {
  const opacity = isDark ? 0.15 : 0.12; // 15% en dark mode, 12% en light mode
  
  switch (status) {
    case 'in_progress': {
      const color = '#FF6B35'; // Orange, même couleur que TaskItem
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    case 'todo': {
      const color = '#4F46E5';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    case 'done': {
      const color = '#10B981';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    case 'blocked': {
      const color = '#EF4444';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
    default: {
      const color = isDark ? '#E5E7EB' : '#6B7280';
      return {
        border: color,
        text: color,
        bg: addOpacityToColor(color, opacity),
      };
    }
  }
}

/**
 * Retourne la couleur du statut d'une tâche
 */
function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return tokens.colors.brand.primary; // #4F5DFF
    case 'in_progress':
      return tokens.colors.accent.maize; // #FDD447
    case 'blocked':
      return tokens.colors.semantic.error; // #D32F2F
    case 'done':
      return tokens.colors.semantic.success; // #00C853
    default:
      return tokens.colors.neutral.medium; // #98928C
  }
}

/**
 * Formate un statut pour l'affichage avec i18n
 */
function formatStatus(status: TaskStatus, t: any): string {
  switch (status) {
    case 'todo':
      return t('tasks.status.todo');
    case 'in_progress':
      return t('tasks.status.inProgress');
    case 'blocked':
      return t('tasks.status.blocked');
    case 'done':
      return t('tasks.status.done');
    default:
      return status;
  }
}

/**
 * Formate une date pour l'affichage
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Retourne l'icône MaterialCommunityIcons pour un type d'attachment
 */
function getAttachmentIcon(type: Attachment['type']): string {
  switch (type) {
    case 'image':
      return 'file-image';
    case 'pdf':
      return 'file-pdf-box';
    case 'spreadsheet':
      return 'file-excel';
    case 'other':
    default:
      return 'file-outline';
  }
}

/**
 * Formate une taille de fichier en format lisible (KB, MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Convertit un actionType en SuiviActivityEventType
 */
function getEventTypeFromActionType(actionType: string): SuiviActivityEvent['eventType'] {
  switch (actionType) {
    case 'COMMENT':
      return 'COMMENT';
    case 'APPROVAL':
      return 'TASK_COMPLETED'; // Approximation pour approbation
    case 'RATING':
    case 'PROGRESS':
    case 'WEATHER':
    case 'CALENDAR':
    case 'CHECKBOX':
    case 'SELECT':
      return 'TASK_REPLANNED'; // Approximation pour autres actions
    default:
      return 'TASK_CREATED';
  }
}

/**
 * Génère un titre d'activité depuis le résultat d'action
 * 
 * Utilise les clés i18n pour toutes les actions standardisées.
 * 
 * @see Les mêmes clés i18n seront utilisées pour l'API backend
 */
function getActivityTitle(actionType: string, details: Record<string, any>, t: any): string {
  switch (actionType) {
    case 'COMMENT':
      return t('activity.actions.comment_added', { comment: details.comment || t('quickActions.comment.label') });
    case 'APPROVAL':
      return details.decision === 'approved' 
        ? t('activity.actions.approval_approved') 
        : t('activity.actions.approval_rejected');
    case 'RATING':
      return t('activity.actions.rating', { rating: details.rating || 'N/A' });
    case 'PROGRESS':
      return t('activity.actions.progress', { progress: details.progress || 'N/A' });
    case 'WEATHER':
      return t('activity.actions.weather', { weather: details.weather || 'N/A' });
    case 'CALENDAR':
      return t('activity.actions.calendar', { date: details.date || 'N/A' });
    case 'CHECKBOX':
      return details.checked 
        ? t('activity.actions.checkbox_checked') 
        : t('activity.actions.checkbox_unchecked');
    case 'SELECT':
      return t('activity.actions.selected_option', { option: details.selectedOption || 'N/A' });
    default:
      return t('activity.actions.generic', { actionType });
  }
}

/**
 * Formate une date d'activité pour l'affichage
 * 
 * Utilise les clés i18n pour tous les timestamps relatifs.
 * 
 * @see Les mêmes clés i18n seront utilisées pour l'API backend
 */
function formatActivityDate(dateString: string, t: any): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('activity.timestamps.just_now');
    if (diffMins < 60) return t('activity.timestamps.minutes_ago', { count: diffMins });
    if (diffHours < 24) return t('activity.timestamps.hours_ago', { count: diffHours });
    if (diffDays === 1) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return t('activity.timestamps.yesterday', { time: `${hours}:${minutes}` });
    }
    if (diffDays < 7) return t('activity.timestamps.days_ago', { count: diffDays });
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: tokens.spacing.md,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  errorSubtext: {
    textAlign: 'center',
    marginTop: tokens.spacing.xs,
  },
  pagePadding: {
    paddingHorizontal: tokens.spacing.lg,
  },
  headerSeparator: {
    height: 1,
    marginBottom: tokens.spacing.lg,
  },
  tabsContainer: {
    marginBottom: tokens.spacing.lg,
  },
  attachmentsContainer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  attachmentsDropZone: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: tokens.spacing.xxl * 10, // 320px - hauteur minimale pour une drop zone visible
  },
  attachmentsIcon: {
    marginBottom: tokens.spacing.md,
  },
  attachmentsTitle: {
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
  attachmentsButton: {
    marginTop: tokens.spacing.lg,
  },
  // Options Bottom Sheet
  optionsSheetContainer: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    maxHeight: '60%',
  },
  optionsList: {
    paddingBottom: tokens.spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    marginBottom: tokens.spacing.xs,
    borderRadius: tokens.radius.md,
  },
  optionItemDelete: {
    borderBottomWidth: 0,
    marginTop: tokens.spacing.sm,
  },
  optionIcon: {
    marginRight: tokens.spacing.md,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: tokens.radius.xs,
  },
  // Header inline "Task Overview" (structure identique à ScreenHeader) - DEPRECATED
  headerContainer: {
    marginBottom: tokens.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  backIcon: {
    marginRight: tokens.spacing.md,
    padding: tokens.spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  // En-tête Monday-like - DEPRECATED
  headerSection: {
    marginBottom: tokens.spacing.xl,
  },
  breadcrumbContainer: {
    marginBottom: tokens.spacing.xs,
  },
  breadcrumb: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskTitleContainer: {
    marginBottom: tokens.spacing.md,
  },
  taskTitleText: {
    fontSize: tokens.typography.h1.fontSize,
    fontWeight: tokens.typography.h1.fontWeight,
    lineHeight: tokens.typography.h1.lineHeight,
  },
  statusBadgeContainer: {
    marginTop: tokens.spacing.sm,
  },
  statusBadgeInline: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    minHeight: 32,
    justifyContent: 'center',
  },
  statusBadgeCompact: {
    paddingHorizontal: tokens.spacing.xs,
    paddingVertical: tokens.spacing.xs / 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    minHeight: 28,
    justifyContent: 'center',
  },
  // Sections
  section: {
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: tokens.typography.h2.fontSize,
    fontFamily: tokens.typography.h2.fontFamily,
    fontWeight: tokens.typography.h2.fontWeight,
    marginBottom: tokens.spacing.md,
  },
  sectionSubtitle: {
    marginBottom: tokens.spacing.md,
  },
  // Métadonnées
  metadataCard: {
    marginTop: tokens.spacing.sm,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
  metadataRowLast: {
    borderBottomWidth: 0,
  },
  metadataLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metadataIcon: {
    marginRight: tokens.spacing.xs,
  },
  metadataLabel: {
    flex: 1,
  },
  metadataValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  metadataAvatar: {
    marginRight: tokens.spacing.xs,
  },
  metadataValue: {
    textAlign: 'right',
  },
  // Activity Timeline
  commentContainer: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.md,
  },
  commentAuthor: {
    fontWeight: '600',
    marginBottom: tokens.spacing.xs,
  },
  commentText: {
    marginBottom: tokens.spacing.xs,
  },
  commentTimestamp: {
    marginTop: tokens.spacing.xs,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: tokens.radius.xs,
    backgroundColor: tokens.colors.brand.primary,
    marginRight: tokens.spacing.sm,
    marginTop: tokens.spacing.xs,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    marginBottom: tokens.spacing.xs,
  },
  activityTimestamp: {
    marginTop: 0,
  },
  emptyActivityCard: {
    marginTop: tokens.spacing.md,
  },
  statusBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadgeIcon: {
    marginLeft: tokens.spacing.xs,
  },
  descriptionEditContainer: {
    flex: 1,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.sm,
    minHeight: 80,
    fontSize: tokens.typography.body.fontSize,
    fontFamily: tokens.typography.body.fontFamily,
    marginBottom: tokens.spacing.sm,
  },
  descriptionEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: tokens.spacing.md,
  },
  descriptionEditButton: {
    padding: tokens.spacing.xs,
  },
  descriptionCard: {
    marginTop: tokens.spacing.md,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  descriptionLabel: {
    flex: 1,
  },
  descriptionText: {
    marginTop: tokens.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    maxHeight: '60%',
  },
  modalTitle: {
    marginBottom: tokens.spacing.lg,
  },
  assigneeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: tokens.colors.border.default,
  },
  assigneeOptionAvatar: {
    marginRight: tokens.spacing.md,
  },
  datePickerContainer: {
    marginTop: tokens.spacing.md,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    fontSize: tokens.typography.body.fontSize,
    fontFamily: tokens.typography.body.fontFamily,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: tokens.spacing.md,
  },
  datePickerButton: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
  },
});

