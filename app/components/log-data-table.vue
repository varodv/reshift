<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { Activity, Log } from '../types';
import LogDataBar from './log-data-bar.vue';

const props = defineProps<{
  data: Array<Log>;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  itemClick: [item: Log];
}>();

const { data: activityData } = useActivity();

const columns: Array<ColumnDef<Log>> = [
  {
    accessorKey: 'activity',
    header: () => h('span', { class: 'grow text-center truncate' }, $t('log.activity.label')),
    cell: ({ getValue }: any) =>
      h('span', { class: 'grow text-center truncate' }, getActivityName(getValue())),
  },
  {
    accessorKey: 'timestamp',
    header: () => h('span', { class: 'grow text-center truncate' }, $t('log.timestamp.label')),
    cell: ({ getValue }: any) =>
      h('span', { class: 'grow text-center truncate' }, new Date(getValue()).toLocaleTimeString()),
  },
  {
    id: 'waterfall',
    header: () => h('span', { class: 'grow text-center truncate' }, $t('log.waterfall.label')),
    cell: ({ row }) =>
      h(LogDataBar, {
        class: 'grow',
        data: props.data,
        highlightFilter: log => log.id === row.original.id,
      }),
  },
];

function getActivityName(activityId: Activity['id']) {
  return activityData.value.find(activity => activity.id === activityId)?.name ?? activityId;
}
</script>

<template>
  <DataTable
    :class="props.class"
    :columns="columns"
    :data="data"
    @item-click="emits('itemClick', $event)"
  >
    <template #empty>
      <UiTableEmpty :colspan="columns.length">
        <slot name="empty-content">
          {{ $t('log.empty.default') }}
        </slot>
      </UiTableEmpty>
    </template>
  </DataTable>
</template>
