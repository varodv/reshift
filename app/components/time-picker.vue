<script setup lang="ts">
import type { Time } from '@internationalized/date';
import type { HTMLAttributes } from 'vue';
import { parseTime } from '@internationalized/date';

defineProps<{
  modelValue: Time;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  'update:modelValue': [newModelValue: Time];
}>();
</script>

<template>
  <UiInput
    type="time"
    :step="1"
    :model-value="modelValue.toString().substring(0, 8)"
    @update:model-value="emits('update:modelValue', parseTime(`${$event.toString()}.000`))"
  />
</template>
