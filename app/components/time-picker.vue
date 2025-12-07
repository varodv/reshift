<script setup lang="ts">
import type { Time } from '@internationalized/date';
import type { HTMLAttributes } from 'vue';
import { parseTime } from '@internationalized/date';

withDefaults(
  defineProps<{
    modelValue: Time;
    step?: number;
    class?: HTMLAttributes['class'];
  }>(),
  {
    step: 1,
  },
);

const emits = defineEmits<{
  'update:modelValue': [newModelValue: Time];
}>();
</script>

<template>
  <UiInput
    type="time"
    :step="step"
    :model-value="modelValue.toString().substring(0, 8)"
    @update:model-value="emits('update:modelValue', parseTime(`${$event.toString()}.000`))"
  />
</template>
