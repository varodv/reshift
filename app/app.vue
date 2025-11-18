<script setup lang="ts">
import { fromDate, getLocalTimeZone, isSameDay, today } from '@internationalized/date';

const { data: activityData } = useActivity();
const { data: logData, create: createLog } = useLog();

const selectedDateValue = ref(today(getLocalTimeZone()) as any);

const selectedActivityId = ref(activityData.value[0]?.id);

const filteredLogData = computed(() =>
  logData.value.filter(log =>
    isSameDay(fromDate(new Date(log.timestamp), getLocalTimeZone()), selectedDateValue.value),
  ),
);
</script>

<template>
  <div class="flex flex-col h-screen gap-4 p-4">
    <DatePicker v-model="selectedDateValue" />
    <LogDataTable class="grow" :data="filteredLogData">
      <template #empty-content>
        No logs for the selected date.
      </template>
    </LogDataTable>
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
</template>
