<script lang="ts">
  import AdminMasterDataList from '$lib/components/AdminMasterDataList.svelte';
  import { httpClient } from '$lib/http-client';
  import { z } from 'zod';
  import type { PageData } from './$types';
  import Seo from '$lib/components/Seo.svelte';

  export let data: PageData;

  async function deletePlatform(platformId: string) {
    const oldPlatform = data.platforms.find(
      (platform) => platform.platformId === platformId
    );
    if (!oldPlatform) {
      console.warn(`Could not find platform with id ${platformId}`);
      return;
    }
    data.platforms = data.platforms.filter(
      (platform) => platform.platformId !== platformId
    );
    const [error] = await httpClient(`/api/platform/${platformId}`, {
      schema: z.void(),
      method: 'DELETE',
    });
    if (error) {
      data.platforms = [...data.platforms, oldPlatform];
    }
  }
</script>

<Seo title="Platform list" description="List with all Platforms registered" />

<AdminMasterDataList
  data={data.platforms}
  idKey="platformId"
  headers={[
    { key: 'platformId', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'shortName', value: 'Short name' },
  ]}
  title="Platforms"
  description="List with all Platforms registered"
  addHref="/a/platform/add"
  editHref={(platform) => `/a/platform/${platform.platformId}/edit`}
  filterKeys={['name', 'shortName']}
  on:delete={(event) => deletePlatform(event.detail)}
/>
