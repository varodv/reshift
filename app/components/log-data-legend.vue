<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { Log } from '../types';
import { cn } from '../lib/utils';

const props = defineProps<{
  data: Array<Log>;
  class?: HTMLAttributes['class'];
}>();

const { data: activityData } = useActivity();
const { getDuration, formatDuration } = useLog();
</script>

<template>
  <div :class="cn('overflow-auto flex justify-between gap-4', props.class)">
    <div
      v-for="activity in activityData"
      :key="activity.id"
      class="flex flex-col whitespace-nowrap"
    >
      <span :class="cn('text-sm font-medium', `text-${activity.color}-500`)">
        {{ activity.name }}
      </span>
      <span class="text-xs">
        {{ formatDuration(getDuration(...data.filter((log) => log.activity === activity.id))) }}
      </span>
    </div>
  </div>
</template>
