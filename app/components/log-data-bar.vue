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
  highlightFilter?: (log: Log) => boolean;
  class?: HTMLAttributes['class'];
}>();

const now = useTimestamp({ interval: 1000 });

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

const segments = computed(() =>
  props.data.reduce<Array<Segment>>((result, log, index) => {
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
  }, []),
);

function getSegmentWidthStyle(segment: Segment) {
  return `${((segment.to - segment.from) / (end.value - start.value)) * 100}%`;
}
</script>

<template>
  <div :class="cn('flex h-2', props.class)">
    <span
      v-for="segment in segments"
      :key="segment.id"
      :class="
        cn('first:rounded-s-full last:rounded-e-full bg-black', {
          'opacity-25': !!highlightFilter && (!segment.log || !highlightFilter(segment.log)),
        })
      "
      :style="{ width: getSegmentWidthStyle(segment) }"
    />
  </div>
</template>
