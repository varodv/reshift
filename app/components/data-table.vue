<script setup lang="ts" generic="DataItemType">
import type { ColumnDef } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table';

const props = defineProps<{
  columns: Array<ColumnDef<DataItemType>>;
  data: Array<DataItemType>;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  itemClick: [item: DataItemType];
}>();

const table = useVueTable({
  get columns() {
    return props.columns;
  },
  get data() {
    return props.data;
  },
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <UiTable :class="props.class">
    <UiTableHeader>
      <UiTableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <UiTableHead
          v-for="header in headerGroup.headers"
          :key="header.id"
          :style="{ width: `${100 / columns.length}%` }"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </UiTableHead>
      </UiTableRow>
    </UiTableHeader>
    <UiTableBody>
      <template v-if="table.getRowModel().rows?.length">
        <UiTableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() ? 'selected' : undefined"
          @click="emits('itemClick', row.original)"
        >
          <UiTableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :style="{ width: `${100 / columns.length}%` }"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </UiTableCell>
        </UiTableRow>
      </template>
      <template v-else>
        <slot name="empty">
          <UiTableEmpty :colspan="columns.length">
            {{ $t('table.empty') }}
          </UiTableEmpty>
        </slot>
      </template>
    </UiTableBody>
  </UiTable>
</template>
