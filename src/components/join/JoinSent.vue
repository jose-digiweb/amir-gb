<script setup lang="ts">
// Dependencies
import { CalendarDays, Check, MessageCircle } from "@lucide/vue";
import { JOIN_FORM_ID } from "./constants";

/**
 * The {@link Props} type
 * @description The props of the JoinSent component, the welcome that takes the form's place once a sign-up is sent
 */
type Props = {
  /** The welcome in three languages. */
  opener: string;
  /** The welcome or the thanks, with the visitor's name. */
  title: string;
  /** What happens now, in which language. */
  text: string;
  /** The What's on button's words. */
  seeWhatsOn: string;
  /** The What's on page. */
  whatsOnHref: string;
  /** The tell a friend button's words. */
  tellFriend: string;
  /** The WhatsApp message that tells a friend. */
  tellFriendHref: string;
};

// Read the welcome
const props = defineProps<Props>();
</script>

<template>
  <div role="status" class="flex flex-col gap-4">
    <span class="grid size-16 place-items-center rounded-full bg-success-bg text-success">
      <Check class="size-icon-lg" aria-hidden="true" />
    </span>
    <p class="type-label text-text-accent">{{ props.opener }}</p>
    <div class="flex flex-col gap-2">
      <h3
        :id="JOIN_FORM_ID.SENT"
        tabindex="-1"
        class="type-h2 text-balance text-text-heading outline-none"
      >
        {{ props.title }}
      </h3>
      <p class="type-body text-pretty text-text">{{ props.text }}</p>
    </div>
    <div class="flex flex-col gap-2 tablet:flex-row tablet:flex-wrap">
      <a
        :href="props.whatsOnHref"
        class="inline-flex h-control-lg touch-manipulation items-center justify-center gap-2 rounded-pill bg-primary px-6 type-button text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed"
      >
        <CalendarDays class="size-icon-md" aria-hidden="true" />
        {{ props.seeWhatsOn }}
      </a>
      <a
        :href="props.tellFriendHref"
        class="inline-flex h-control-lg touch-manipulation items-center justify-center gap-2 rounded-pill border-2 border-border-strong px-6 type-button text-text-heading transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-hover-quiet active:scale-97 active:bg-pressed-quiet"
      >
        <MessageCircle class="size-icon-md" aria-hidden="true" />
        {{ props.tellFriend }}
      </a>
    </div>
  </div>
</template>
