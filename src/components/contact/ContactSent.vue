<script setup lang="ts">
// Dependencies
import { Check, MessageCircle } from "@lucide/vue";
import { CONTACT_FORM_ID } from "./constants";

/**
 * The {@link Props} type
 * @description The props of the ContactSent component, the thank you that takes the form's place once a message is sent
 */
type Props = {
  /** The thank you in three languages. */
  opener: string;
  /** That the message arrived, with the visitor's name. */
  title: string;
  /** How and in which language AMIR-GB answers. */
  text: string;
  /** The WhatsApp button's words. */
  whatsapp: string;
  /** The WhatsApp link. */
  whatsappHref: string;
  /** The send another button's words. */
  sendAnother: string;
};

// Read the thank you, and tell the form to start again
const props = defineProps<Props>();
const emit = defineEmits<{ again: [] }>();
</script>

<template>
  <div role="status" class="flex flex-col gap-4">
    <span class="grid size-16 place-items-center rounded-full bg-success-bg text-success">
      <Check class="size-icon-lg" aria-hidden="true" />
    </span>
    <p class="flex items-center gap-2 type-label text-text-accent">{{ props.opener }}</p>
    <div class="flex flex-col gap-2">
      <h3
        :id="CONTACT_FORM_ID.SENT"
        tabindex="-1"
        class="type-h2 text-balance text-text-heading outline-none"
      >
        {{ props.title }}
      </h3>
      <p class="type-body text-pretty text-text">{{ props.text }}</p>
    </div>
    <div class="flex flex-col gap-2 tablet:flex-row">
      <a
        :href="props.whatsappHref"
        class="inline-flex h-control-lg touch-manipulation items-center justify-center gap-2 rounded-pill bg-primary px-6 type-button text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed"
      >
        <MessageCircle class="size-icon-md" aria-hidden="true" />
        {{ props.whatsapp }}
      </a>
      <button
        type="button"
        class="inline-flex h-control-lg touch-manipulation items-center justify-center rounded-pill border-2 border-border-strong px-6 type-button text-text-heading transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-hover-quiet active:scale-97 active:bg-pressed-quiet"
        @click="emit('again')"
      >
        {{ props.sendAnother }}
      </button>
    </div>
  </div>
</template>
