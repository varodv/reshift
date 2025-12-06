<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date';
import type { HTMLAttributes } from 'vue';
import { DateFormatter, getLocalTimeZone, isToday, today } from '@internationalized/date';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<{
  modelValue: CalendarDate;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  'update:modelValue': [newModelValue: CalendarDate];
}>();

const calendarForwardedProps = useForwardPropsEmits(reactiveOmit(props, 'class'), emits);

const { locale } = useI18n();

const df = new DateFormatter(locale.value, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
});
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.class)">
    <UiPopover>
      <UiPopoverTrigger as-child>
        <UiButton variant="outline" class="grow w-0 font-normal">
          <CalendarIcon class="size-4" />
          <span class="truncate">
            {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
          </span>
        </UiButton>
      </UiPopoverTrigger>
      <UiPopoverContent class="w-auto p-0">
        <UiCalendar
          v-bind="calendarForwardedProps"
          :locale="locale"
          prevent-deselect
          initial-focus
        />
      </UiPopoverContent>
    </UiPopover>
    <div class="flex gap-1">
      <UiButton
        variant="secondary"
        size="icon"
        @click="() => emits('update:modelValue', modelValue.subtract({ days: 1 }))"
      >
        <ChevronLeft />
      </UiButton>
      <UiButton
        variant="secondary"
        size="icon"
        @click="() => emits('update:modelValue', modelValue.add({ days: 1 }))"
      >
        <ChevronRight />
      </UiButton>
    </div>
    <UiButton
      class="capitalize"
      variant="secondary"
      :disabled="isToday(modelValue, getLocalTimeZone())"
      @click="() => emits('update:modelValue', today(getLocalTimeZone()))"
    >
      {{ $t('today') }}
    </UiButton>
  </div>
</template>
