<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { Log } from '../types';
import { cn } from '../lib/utils';

interface Segment {
  id: string;
  from: number;
  to: number;
  log?: Log;
}

const props = defineProps<{
  data: Array<Log>;
  stack?: boolean;
  class?: HTMLAttributes['class'];
}>();

const now = useTimestamp({ interval: 1000 });
const { data: activityData } = useActivity();

const start = computed(() => {
  const minTimestamp = props.data.length
    ? Math.min(...props.data.map(log => log.timestamp))
    : now.value;
  return new Date(minTimestamp).setHours(0, 0, 0, 0);
});

const end = computed(() => {
  const maxTimestamp = props.data.length
    ? Math.max(...props.data.map(log => log.timestamp))
    : now.value;
  return new Date(maxTimestamp).setHours(23, 59, 59, 999);
});

const segments = computed(() => (props.stack ? getStackSegments() : getDefaultSegments()));

function getDefaultSegments() {
  return props.data.reduce<Array<Segment>>((result, log, index) => {
    if (index === 0 && log.timestamp > start.value) {
      result.push({
        id: 'fill-start',
        from: start.value,
        to: log.timestamp,
      });
    }
    const nextLog = props.data[index + 1];
    result.push({
      id: log.id,
      from: log.timestamp,
      to: nextLog?.timestamp ?? Math.min(end.value, now.value),
      log,
    });
    if (index === props.data.length - 1 && end.value > now.value) {
      result.push({
        id: 'fill-end',
        from: now.value,
        to: end.value,
      });
    }
    return result;
  }, []);
}

function getStackSegments() {
  return getDefaultSegments().sort((segmentA, segmentB) => {
    if (segmentA.log && segmentB.log) {
      const activityIndexA = activityData.value.findIndex(
        activity => activity.id === segmentA.log!.activity,
      );
      const activityIndexB = activityData.value.findIndex(
        activity => activity.id === segmentB.log!.activity,
      );
      if (activityIndexA >= 0 && activityIndexB >= 0) {
        return activityIndexA - activityIndexB;
      }
      return activityIndexB - activityIndexA;
    }
    if (segmentA.log) {
      return -1;
    }
    if (segmentB.log) {
      return 1;
    }
    return 0;
  });
}

function getSegmentWidthStyle(segment: Segment) {
  return `${((segment.to - segment.from) / (end.value - start.value)) * 100}%`;
}

function getSegmentColorClass(segment: Segment) {
  if (segment.log) {
    const activity = activityData.value.find(activity => activity.id === segment.log!.activity);
    if (activity) {
      return `bg-${activity.color}-500`;
    }
  }
}
</script>

<template>
  <TransitionGroup
    tag="div"
    name="log-data-bar"
    :class="cn('overflow-hidden flex h-3.5 rounded-full bg-gray-300', props.class)"
  >
    <span
      v-for="segment in segments"
      :key="segment.id"
      :class="getSegmentColorClass(segment)"
      :style="{ width: getSegmentWidthStyle(segment) }"
    />
  </TransitionGroup>
</template>

<style scoped>
.log-data-bar-move {
  transition: all 500ms ease;
}
</style>
