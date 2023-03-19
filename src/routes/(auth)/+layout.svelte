<script lang="ts">
  import { Paper } from '@svelteuidev/core';
</script>

<div class="container">
  <div class="card-container">
    <Paper shadow="sm">
      <slot />
    </Paper>
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
  }
  .card-container {
    width: 450px;
  }

  @media only screen and (max-width: 600px) {
    .card-container {
      width: 100%;
    }
  }
</style>
