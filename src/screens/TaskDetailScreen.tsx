import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { getTaskById } from '../api/tasks';
import { useAuth } from '../auth';
import { tokens } from '../../theme';

type TaskDetailRouteParams = {
  TaskDetail: {
    taskId: string;
  };
};

type TaskDetailRoute = RouteProp<TaskDetailRouteParams, 'TaskDetail'>;

export function TaskDetailScreen() {
  const route = useRoute<TaskDetailRoute>();
  const { taskId } = route.params;
  const theme = useTheme();
  const { accessToken } = useAuth();

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return getTaskById(accessToken, taskId);
    },
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.error,
              },
            ]}
          >
            Not authenticated
          </Text>
        </View>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.centerText,
              {
                color: theme.colors.onSurface,
              },
            ]}
          >
            Loading task...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError || !task) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.error,
              },
            ]}
          >
            {String(error?.message || 'Error loading task')}
          </Text>
        </View>
      </Screen>
    );
  }

  const statusColor = getStatusColor(task.status, theme.colors);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.onSurface,
              },
            ]}
          >
            {task.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: theme.colors.onSurface,
                },
              ]}
            >
              {task.status}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          {task.projectName && (
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Project:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.colors.onSurface,
                  },
                ]}
              >
                {task.projectName}
              </Text>
            </View>
          )}

          {task.assigneeName && (
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Assignee:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.colors.onSurface,
                  },
                ]}
              >
                {task.assigneeName}
              </Text>
            </View>
          )}

          {task.dueDate && (
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Due Date:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.colors.onSurface,
                  },
                ]}
              >
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}

          {task.updatedAt && (
            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Updated:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function getStatusColor(status: string, colors: any): string {
  switch (status) {
    case 'todo':
      return colors.info || '#1976D2';
    case 'in_progress':
      return colors.warning || '#FFB300';
    case 'blocked':
      return colors.error || '#D32F2F';
    case 'done':
      return colors.success || '#00C853';
    default:
      return colors.surfaceVariant || '#E0E0E0';
  }
}

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

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.typography.h4.fontSize,
    fontWeight: 'bold',
    marginBottom: tokens.spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
  },
  statusText: {
    fontSize: tokens.typography.body2.fontSize,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    gap: tokens.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: tokens.typography.body2.fontSize,
    fontWeight: '600',
    width: 100,
  },
  value: {
    flex: 1,
    fontSize: tokens.typography.body2.fontSize,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: tokens.typography.body1.fontSize,
    marginTop: tokens.spacing.md,
  },
  errorText: {
    fontSize: tokens.typography.body1.fontSize,
    textAlign: 'center',
  },
});

