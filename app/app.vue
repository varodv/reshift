<script setup lang="ts">
import type { Log } from './types';
import { fromDate, getLocalTimeZone, isSameDay, today } from '@internationalized/date';
import { toast } from 'vue-sonner';
import 'vue-sonner/style.css';

useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
    },
  ],
});

const { data: activityData } = useActivity();
const { data: logData, create: createLog, remove: removeLog } = useLog();

const selectedDateValue = ref(today(getLocalTimeZone()) as any);

const selectedActivityId = ref(activityData.value[0]?.id);

const selectedLog = ref<Log | undefined>();

const filteredLogData = computed(() =>
  logData.value.filter(log =>
    isSameDay(fromDate(new Date(log.timestamp), getLocalTimeZone()), selectedDateValue.value),
  ),
);

function onRemoveSelectedLog() {
  removeLog(selectedLog.value!.id);
  selectedLog.value = undefined;
  toast.success('Log removed');
}
</script>

<template>
  <div class="flex flex-col h-full gap-4 p-4">
    <DatePicker v-model="selectedDateValue" />
    <LogDataTable class="grow" :data="filteredLogData" @item-click="selectedLog = $event">
      <template #empty-content>
        No logs for the selected date.
      </template>
    </LogDataTable>
    <LogDrawer :item="selectedLog" @close="selectedLog = undefined" @remove="onRemoveSelectedLog" />
    <div class="flex items-center gap-2">
      <UiButton
        class="min-w-24"
        variant="destructive"
        :disabled="!logData.length || logData[logData.length - 1]!.activity === 'STOP'"
        @click="createLog({ activity: 'STOP', timestamp: Date.now() })"
      >
        stop
      </UiButton>
      <UiSelect v-model="selectedActivityId">
        <UiSelectTrigger class="grow">
          <UiSelectValue placeholder="Select an activity" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem v-for="activity in activityData" :key="activity.id" :value="activity.id">
            {{ activity.name }}
          </UiSelectItem>
        </UiSelectContent>
      </UiSelect>
      <UiButton
        class="min-w-24"
        :disabled="
          !selectedActivityId || logData[logData.length - 1]?.activity === selectedActivityId
        "
        @click="createLog({ activity: selectedActivityId!, timestamp: Date.now() })"
      >
        log
      </UiButton>
    </div>
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
