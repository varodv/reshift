<script setup lang="ts">
import type { Log } from './types';
import { fromDate, getLocalTimeZone, isSameDay, isToday, today } from '@internationalized/date';
import { Plus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';

const { data: logData, create: createLog, update: updateLog, remove: removeLog } = useLog();

const selectedDateValue = ref(today(getLocalTimeZone()) as any);

const selectedLog = ref<Log | undefined>();

const filteredLogData = computed(() =>
  logData.value.filter(log =>
    isSameDay(fromDate(new Date(log.timestamp), getLocalTimeZone()), selectedDateValue.value),
  ),
);

function onCreateLog(payload: Log) {
  createLog(payload);
  selectedLog.value = undefined;
  toast.success($t('log.create.success'));
}

function onUpdateLog(payload: Log) {
  updateLog(payload);
  selectedLog.value = undefined;
  toast.success($t('log.update.success'));
}

function onRemoveLog() {
  removeLog(selectedLog.value!.id);
  selectedLog.value = undefined;
  toast.success($t('log.remove.success'));
}
</script>

<template>
  <div class="flex flex-col h-full gap-4 p-4">
    <DatePicker v-model="selectedDateValue" />
    <LogDataTable class="grow" :data="filteredLogData" @item-click="selectedLog = $event">
      <template #empty-content>
        {{ $t('log.empty.date') }}
      </template>
    </LogDataTable>
    <LogDrawer
      :item="selectedLog"
      @close="selectedLog = undefined"
      @create="onCreateLog"
      @update="onUpdateLog"
      @remove="onRemoveLog"
    />
    <UiButton
      class="self-center rounded-full"
      size="icon-lg"
      @click="
        selectedLog = {
          id: '',
          activity: '',
          timestamp: !isToday(selectedDateValue, getLocalTimeZone())
            ? selectedDateValue.toDate(getLocalTimeZone()).getTime()
            : Date.now(),
        }
      "
    >
      <Plus />
    </UiButton>
  </div>
  <UiSonner position="bottom-center" />
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
}

:root {
  touch-action: pan-x pan-y;
}
</style>
