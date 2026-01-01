<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { Activity, Log } from '../types';

const props = defineProps<{
  data: Array<Log>;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  itemClick: [item: Log];
}>();

const { locale } = useI18n();
const { data: activityData } = useActivity();
const { getDuration, formatDuration } = useLog();

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
      h(
        'span',
        { class: 'grow text-center truncate' },
        new Date(getValue()).toLocaleTimeString(locale.value, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      ),
  },
  {
    id: 'duration',
    header: () => h('span', { class: 'grow text-center truncate' }, $t('log.duration.label')),
    cell: ({ row }: any) =>
      h(
        'span',
        { class: 'grow text-center truncate' },
        row.original.activity === 'STOP' ? '-' : formatDuration(getDuration(row.original)),
      ),
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
