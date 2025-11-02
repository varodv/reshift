<script setup lang="ts">
import type { Activity } from './types';

const { data: activityData } = useActivity();
const { data: logData, create: createLog, remove: removeLog } = useLog();

const selectedActivityId = ref(activityData.value[0]!.id);

const selectedDateValue = ref(getDateValue(new Date()));

const filteredLogData = computed(() =>
  logData.value.filter((log) => {
    const logDateValue = getDateValue(new Date(log.timestamp));
    return logDateValue === selectedDateValue.value;
  }),
);

function getDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function decreaseSelectedDateValue() {
  const newDate = new Date(selectedDateValue.value);
  newDate.setDate(newDate.getDate() - 1);
  selectedDateValue.value = getDateValue(newDate);
}

function increaseSelectedDateValue() {
  const newDate = new Date(selectedDateValue.value);
  newDate.setDate(newDate.getDate() + 1);
  selectedDateValue.value = getDateValue(newDate);
}

function getActivityName(activityId: Activity['id']) {
  return activityData.value.find(activity => activity.id === activityId)?.name ?? activityId;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 8px">
    <div style="display: flex; align-items: center; gap: 8px">
      <select v-model="selectedActivityId" style="min-width: 160px">
        <option v-for="activity in activityData" :key="activity.id" :value="activity.id">
          {{ activity.name }}
        </option>
      </select>
      <button
        style="min-width: 80px"
        :disabled="
          !selectedActivityId || logData[logData.length - 1]?.activity === selectedActivityId
        "
        @click="createLog({ activity: selectedActivityId, timestamp: Date.now() })"
      >
        log
      </button>
      <button
        style="min-width: 80px"
        :disabled="!logData.length || logData[logData.length - 1]!.activity === 'STOP'"
        @click="createLog({ activity: 'STOP', timestamp: Date.now() })"
      >
        stop
      </button>
    </div>
    <div style="display: flex; align-items: center; gap: 8px">
      <button style="min-width: 40px" @click="decreaseSelectedDateValue()">
        -
      </button>
      <input v-model="selectedDateValue" type="date" style="min-width: 160px">
      <button style="min-width: 40px" @click="increaseSelectedDateValue()">
        +
      </button>
    </div>
    <table style="display: flex; flex-direction: column; width: 100%; max-width: 400px">
      <thead style="display: flex; flex-direction: column">
        <tr style="display: flex; align-items: center">
          <th style="width: calc(50% - 20px)">
            Activity
          </th>
          <th style="width: calc(50% - 20px)">
            <svg width="8" height="8" viewBox="0 0 30.727 30.727">
              <path
                d="M29.994,10.183L15.363,24.812L0.733,10.184c-0.977-0.978-0.977-2.561,0-3.536
                  c0.977-0.977,2.559-0.976,3.536,0
                  l11.095,11.093L26.461,6.647c0.977-0.976,2.559-0.976,3.535,0
                  C30.971,7.624,30.971,9.206,29.994,10.183z"
              />
            </svg>
            Date
          </th>
          <th style="width: 40px" />
        </tr>
      </thead>
      <tbody style="display: flex; flex-direction: column">
        <tr
          v-for="log in filteredLogData.reverse()"
          :key="log.id"
          style="display: flex; align-items: center; margin-top: 8px"
        >
          <td style="width: calc(50% - 20px); text-align: center">
            {{ getActivityName(log.activity) }}
          </td>
          <td style="width: calc(50% - 20px); text-align: center">
            {{ new Date(log.timestamp).toLocaleString() }}
          </td>
          <td style="width: 40px">
            <button
              v-if="log.id === logData[logData.length - 1]!.id"
              style="width: 100%"
              @click="removeLog(log.id)"
            >
              x
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
