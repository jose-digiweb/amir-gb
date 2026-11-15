<script setup lang="ts">
// Dependencies
import { MessageCircle, RotateCw, WifiOff } from "@lucide/vue";

/**
 * The {@link Props} type
 * @description The props of the FormFailed component, the notice above a form that did not send, with everything typed still there
 */
type Props = {
  /** The id the form moves focus to when it did not send. */
  id: string;
  /** That it did not send. */
  title: string;
  /** That nothing is lost, and what to do. */
  text: string;
  /** The try again button's words. */
  tryAgain: string;
  /** The WhatsApp button's words. */
  whatsapp: string;
  /** The WhatsApp link. */
  whatsappHref: string;
};

// Read the notice, and tell the form to try again
const props = defineProps<Props>();
const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div
    :id="props.id"
    tabindex="-1"
    role="alert"
    class="flex flex-col gap-3 rounded-md bg-danger-bg p-4 text-text-heading"
  >
    <div class="flex gap-3">
      <WifiOff class="mt-0.5 size-icon-md shrink-0 text-danger" aria-hidden="true" />
      <div class="flex flex-col gap-1">
        <p class="type-h4">{{ props.title }}</p>
        <p class="type-body-sm text-text">{{ props.text }}</p>
      </div>
    </div>
    <div class="flex flex-wrap gap-2 pl-9">
      <button
        type="button"
        class="inline-flex h-control touch-manipulation items-center gap-2 rounded-pill bg-primary px-5 type-button-sm text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed"
        @click="emit('retry')"
      >
        <RotateCw class="size-icon-sm" aria-hidden="true" />
        {{ props.tryAgain }}
      </button>
      <a
        :href="props.whatsappHref"
        class="inline-flex h-control touch-manipulation items-center gap-2 rounded-pill border-2 border-border-strong px-5 type-button-sm text-text-heading transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-hover-quiet active:scale-97 active:bg-pressed-quiet"
      >
        <MessageCircle class="size-icon-sm" aria-hidden="true" />
        {{ props.whatsapp }}
      </a>
    </div>
  </div>
</template>
