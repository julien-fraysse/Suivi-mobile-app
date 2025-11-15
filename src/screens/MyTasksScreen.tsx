import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { useMyTasks, UseMyTasksOptions } from '../hooks/useMyTasks';
import { Task, TaskStatus } from '../api/tasks';
import { tokens } from '../../theme';

type FilterOption = 'all' | 'open' | 'done';

const filterMap: Record<FilterOption, UseMyTasksOptions['filters']> = {
  all: { status: 'all' },
  open: { status: 'todo' },
  done: { status: 'done' },
};

export function MyTasksScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [filter, setFilter] = useState<FilterOption>('all');

  const filters = filterMap[filter];
  const {
    tasks,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyTasks({ filters });

  const renderFilterButton = (option: FilterOption, label: string) => {
    const isActive = filter === option;
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive
              ? theme.colors.primary
              : theme.colors.surface,
            borderColor: theme.colors.outline,
          },
        ]}
        onPress={() => setFilter(option)}
      >
        <Text
          style={[
            styles.filterButtonText,
            {
              color: isActive
                ? theme.colors.onPrimary
                : theme.colors.onSurface,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const statusColor = getStatusColor(item.status, theme.colors);

    return (
      <TouchableOpacity
        style={[
          styles.taskItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
          },
        ]}
        onPress={() => {
          (navigation as any).navigate('TaskDetail', { taskId: item.id });
        }}
      >
        <View style={styles.taskHeader}>
          <Text
            style={[
              styles.taskTitle,
              {
                color: theme.colors.onSurface,
              },
            ]}
          >
            {item.title}
          </Text>
          <View
            style={[
              styles.statusPill,
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
              {item.status}
            </Text>
          </View>
        </View>

        {item.projectName && (
          <Text
            style={[
              styles.projectName,
              {
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {item.projectName}
          </Text>
        )}

        <Text
          style={[
            styles.dueDate,
            {
              color: theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {item.dueDate
            ? `Due: ${formatDate(item.dueDate)}`
            : 'No due date'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text
          style={[
            styles.footerText,
            {
              color: theme.colors.onSurfaceVariant,
            },
          ]}
        >
          Loading more...
        </Text>
      </View>
    );
  };

  if (isLoading && tasks.length === 0) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.centerText,
              {
                color: theme.colors.onSurface,
              },
            ]}
          >
            Loading tasks...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
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
            {String(error?.message || 'Error loading tasks')}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.filterBar}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('open', 'Open')}
        {renderFilterButton('done', 'Done')}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </Screen>
  );
}

function getStatusColor(status: TaskStatus, colors: any): string {
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
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: tokens.typography.body2.fontSize,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: tokens.spacing.md,
  },
  taskItem: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    marginBottom: tokens.spacing.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.xs,
  },
  taskTitle: {
    flex: 1,
    fontSize: tokens.typography.h6.fontSize,
    fontWeight: 'bold',
    marginRight: tokens.spacing.sm,
  },
  statusPill: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  statusText: {
    fontSize: tokens.typography.caption.fontSize,
    textTransform: 'capitalize',
  },
  projectName: {
    fontSize: tokens.typography.body2.fontSize,
    marginBottom: tokens.spacing.xs,
  },
  dueDate: {
    fontSize: tokens.typography.body2.fontSize,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: tokens.typography.body1.fontSize,
  },
  errorText: {
    fontSize: tokens.typography.body1.fontSize,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: tokens.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  footerText: {
    fontSize: tokens.typography.body2.fontSize,
  },
});

