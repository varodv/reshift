<script setup lang="ts">
import type { Log } from '../types';

defineProps<{
  item?: Log;
}>();

const emits = defineEmits<{
  close: [];
  remove: [];
}>();
</script>

<template>
  <UiDrawer :open="!!item" @update:open="!$event && emits('close')">
    <UiDrawerContent>
      <UiDrawerHeader>
        <UiDrawerTitle>Delete log</UiDrawerTitle>
        <UiDrawerDescription> This action cannot be undone. </UiDrawerDescription>
      </UiDrawerHeader>
      <UiDrawerFooter>
        <UiButton variant="destructive" @click="emits('remove')">
          Delete
        </UiButton>
      </UiDrawerFooter>
    </UiDrawerContent>
  </UiDrawer>
</template>
