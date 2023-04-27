<script lang="ts">
  import {
    Content,
    Header,
    HeaderActionLink,
    HeaderUtilities,
    SideNav,
    SideNavItems,
    SideNavLink,
  } from 'carbon-components-svelte';
  import { Home } from 'carbon-icons-svelte';

  import { page } from '$app/stores';
  import Notifications from '../../lib/components/Notifications.svelte';

  interface Route {
    href: string;
    text: string;
    isActive?: (path: string) => unknown;
  }

  const routes: Route[] = [
    {
      href: '/a',
      text: 'Home',
    },
    {
      href: '/a/platform',
      text: 'Platforms',
      isActive: (path) => /^\/a\/platform(\/\d+\/edit)?$/.test(path),
    },
    {
      href: '/a/platform/add',
      text: 'Add Platform',
    },
    {
      href: '/a/game',
      text: 'Games',
      isActive: (path) => /^\/a\/game(\/d+\/edit)?$/.test(path),
    },
    {
      href: '/a/game/add',
      text: 'Add Game',
    },
    {
      href: '/a/game-mini-game/link',
      text: 'Link Game -> Mini game',
    },
    {
      href: '/a/platform-game-mini-game/link',
      text: 'Link Platform -> Game mini game',
    },
  ];
</script>

<Header company="Biomercs">
  <HeaderUtilities>
    <HeaderActionLink href="/b" icon={Home} />
  </HeaderUtilities>
</Header>

<SideNav fixed isOpen>
  <SideNavItems>
    {#each routes as route (route.href)}
      <SideNavLink
        text={route.text}
        href={route.href}
        isSelected={route.isActive
          ? !!route.isActive($page.url.pathname)
          : $page.url.pathname === route.href}
      />
    {/each}
  </SideNavItems>
</SideNav>

<Content>
  <slot />
</Content>

<Notifications showTechnicalError />
