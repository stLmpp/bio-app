<script lang="ts">
  import { ToastNotification } from 'carbon-components-svelte';
  import { getReasonPhrase } from 'http-status-codes';
  import { onMount } from 'svelte';
  import { errorNotification$ } from '../stores/error-notification';
  import { v4 } from 'uuid';

  export let showTechnicalError = false;

  interface Notification {
    title: string;
    subtitle?: string;
    caption: string;
    id: string;
    timeout: number;
  }

  let notifications: Notification[] = [];

  function onCloseNotification(notificationId: string) {
    notifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
  }

  const MS_PER_TOKEN_TIMEOUT = 80;
  const FIXED_TIMEOUT_MS = 5_000; // 5 seconds

  onMount(() => {
    const subscription = errorNotification$.subscribe((error) => {
      let caption = showTechnicalError ? `<p>${error.error}</p>` : '';
      if (error.message !== error.error || !showTechnicalError) {
        caption += `<p>${error.message}</p>`;
      }
      const title = showTechnicalError
        ? `${error.status} - ${getReasonPhrase(error.status)}`
        : 'Error'; // TODO show a better error title when not technical
      const subtitle = showTechnicalError ? error.errorCode : undefined;
      notifications = [
        ...notifications,
        {
          caption,
          id: v4(),
          subtitle,
          title,
          timeout:
            (caption.length + (subtitle ?? '').length + title.length) *
              MS_PER_TOKEN_TIMEOUT +
            FIXED_TIMEOUT_MS,
        },
      ];
    });
    return () => {
      subscription.unsubscribe();
    };
  });
</script>

{#if notifications.length}
  <div class="notifications">
    {#each notifications as notification (notification.id)}
      <ToastNotification
        lowContrast
        kind="error"
        title={notification.title}
        subtitle={notification.subtitle}
        timeout={notification.timeout}
        fullWidth
        on:close={() => onCloseNotification(notification.id)}
      >
        <svelte:fragment slot="caption">
          {@html notification.caption}
        </svelte:fragment>
      </ToastNotification>
    {/each}
  </div>
{/if}

<style lang="scss">
  .notifications {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }
</style>
