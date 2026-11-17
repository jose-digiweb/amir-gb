// Dependencies
import { onMounted, ref } from "vue";

/**
 * The {@link useFormEnhanced} composable
 * @description Whether a form's script has taken over: until then the browser checks the required fields itself, so a form posted without JavaScript is not sent empty
 * @returns {Ref<boolean>} True once the form is running in the browser
 */
export function useFormEnhanced() {
  const isEnhanced = ref(false);

  // The form checks its own fields once it runs in the browser
  onMounted(() => {
    isEnhanced.value = true;
  });
  return isEnhanced;
}
