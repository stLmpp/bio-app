<script lang="ts">
  import {
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
  } from 'carbon-components-svelte';

  export let data;
</script>

<h2>Parameters selected</h2>

<StructuredList condensed class="no-margin-bottom">
  <StructuredListBody>
    <StructuredListRow>
      <StructuredListCell>Platform</StructuredListCell>
      <StructuredListCell>{data.platform.name}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Game</StructuredListCell>
      <StructuredListCell>{data.game.name}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Mini game</StructuredListCell>
      <StructuredListCell>{data.platformGameMiniGame.miniGameName}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Mode</StructuredListCell>
      <StructuredListCell>{data.platformGameMiniGameMode.modeName}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Stage</StructuredListCell>
      <StructuredListCell>
        {data.platformGameMiniGameModeStage.stageName}
      </StructuredListCell>
    </StructuredListRow>
  </StructuredListBody>
</StructuredList>

<style lang="scss">
  h2 {
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 2rem;
    margin-top: 1rem;
  }
</style>
