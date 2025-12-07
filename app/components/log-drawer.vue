<script setup lang="ts">
import type { Log } from '../types';
import { Time } from '@internationalized/date';

const props = defineProps<{
  item?: Log;
}>();

const emits = defineEmits<{
  close: [];
  create: [payload: Log];
  update: [payload: Log];
  remove: [];
}>();

const { locale } = useI18n();
const { data: activityData } = useActivity();

const formItem = ref<Log>({
  id: '',
  activity: '',
  timestamp: Date.now(),
});

const dirty = computed(
  () =>
    !formItem.value.id
    || formItem.value.activity !== props.item?.activity
    || formItem.value.timestamp !== props.item?.timestamp,
);

const valid = computed(() => !!formItem.value.activity);

const timePickerModelValue = computed(() => {
  const date = new Date(formItem.value.timestamp);
  return new Time(date.getHours(), date.getMinutes());
});

function unpdateTimePickerModelValue(value: Time) {
  const date = new Date(formItem.value.timestamp);
  date.setHours(value.hour, value.minute, 0, 0);
  formItem.value.timestamp = date.getTime();
}

watch(
  () => props.item,
  (value) => {
    formItem.value = {
      id: value?.id ?? '',
      activity: value?.activity ?? '',
      timestamp: value?.timestamp ?? Date.now(),
    };
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <UiDrawer :open="!!item" @update:open="!$event && emits('close')">
    <UiDrawerContent>
      <UiDrawerHeader>
        <UiDrawerTitle>
          {{ $t(`log.${!formItem.id ? 'create' : 'update'}.title`) }}
        </UiDrawerTitle>
        <UiDrawerDescription>
          {{
            new Date(formItem.timestamp).toLocaleString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })
          }}
        </UiDrawerDescription>
      </UiDrawerHeader>
      <div class="flex flex-col gap-4 p-4">
        <UiSelect v-model="formItem.activity">
          <UiSelectTrigger class="w-full">
            <UiSelectValue :placeholder="$t('log.activity.placeholder')" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem v-for="activity in activityData" :key="activity.id" :value="activity.id">
              {{ activity.name }}
            </UiSelectItem>
            <UiSelectItem value="STOP">
              {{ $t('log.activity.stop') }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <TimePicker
          :model-value="timePickerModelValue"
          :step="60"
          @update:model-value="unpdateTimePickerModelValue"
        />
      </div>
      <UiDrawerFooter>
        <UiButton
          v-if="!formItem.id"
          :disabled="!valid"
          @click="emits('create', formItem)"
        >
          {{ $t('log.create.action') }}
        </UiButton>
        <template v-else>
          <UiButton :disabled="!dirty || !valid" @click="emits('update', formItem)">
            {{ $t('log.update.action') }}
          </UiButton>
          <UiButton variant="destructive" @click="emits('remove')">
            {{ $t('log.remove.action') }}
          </UiButton>
        </template>
      </UiDrawerFooter>
    </UiDrawerContent>
  </UiDrawer>
</template>
