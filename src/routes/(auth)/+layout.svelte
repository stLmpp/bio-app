<script lang="ts">
  import { Tile } from 'carbon-components-svelte';
</script>

<div class="container">
  <div class="card-container">
    <Tile>
      <slot />
    </Tile>
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
