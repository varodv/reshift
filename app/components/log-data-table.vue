<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { Activity, Log } from '../types';

const props = defineProps<{
  data: Array<Log>;
  class?: HTMLAttributes['class'];
}>();

const { data: activityData } = useActivity();

const columns: Array<ColumnDef<Log>> = [
  {
    accessorKey: 'activity',
    header: () => h('span', { class: 'grow text-center truncate' }, 'Activity'),
    cell: ({ getValue }: any) =>
      h('span', { class: 'grow text-center truncate' }, getActivityName(getValue())),
  },
  {
    accessorKey: 'timestamp',
    header: () => h('span', { class: 'grow text-center truncate' }, 'Time'),
    cell: ({ getValue }: any) =>
      h('span', { class: 'grow text-center truncate' }, new Date(getValue()).toLocaleTimeString()),
  },
];

function getActivityName(activityId: Activity['id']) {
  return activityData.value.find(activity => activity.id === activityId)?.name ?? activityId;
}
</script>

<template>
  <DataTable :class="props.class" :columns="columns" :data="data">
    <template #empty>
      <UiTableEmpty :colspan="columns.length">
        <slot name="empty-content">
          No logs.
        </slot>
      </UiTableEmpty>
    </template>
  </DataTable>
</template>
