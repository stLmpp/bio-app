<script lang="ts">
  import AdminMasterDataList from '$lib/components/AdminMasterDataList.svelte';
  import { httpClient } from '$lib/http-client';
  import { z } from 'zod';
  import type { PageData } from './$types';
  import Seo from '$lib/components/Seo.svelte';

  export let data: PageData;
  async function deleteMode(modeId: string) {
    const oldMode = data.modes.find((mode) => mode.modeId === modeId);
    if (!oldMode) {
      console.warn(`Could not find mode with id ${modeId}`);
      return;
    }
    data.modes = data.modes.filter((mode) => mode.modeId !== modeId);
    const [error] = await httpClient(`/api/mode/${modeId}`, {
      schema: z.void(),
      method: 'DELETE',
    });
    if (error) {
      data.modes = [...data.modes, oldMode];
    }
  }
</script>

<Seo title="Mode list" description="List with all Modes" />

<AdminMasterDataList
  data={data.modes}
  idKey="modeId"
  headers={[
    { key: 'modeId', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'playerQuantity', value: 'Player quantity' },
  ]}
  title="Modes"
  description="All modes"
  addHref="/a/mode/add"
  editHref={(mode) => `/a/mode/${mode.modeId}/edit`}
  filterKeys={['name']}
  on:delete={(event) => deleteMode(String(event.detail))}
/>
