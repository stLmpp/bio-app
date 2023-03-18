<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<svelte:head>
  <title>Login - Biomercs</title>
  <meta name="description" content="Login to Biomercs and have access to all leaderboards" />
</svelte:head>

<div class="container">
  <form method="POST" use:enhance>
    <div class="fields">
      <label for="usernameOrEmail">Username or e-mail</label>
      <input
        id="usernameOrEmail"
        name="usernameOrEmail"
        type="text"
        placeholder="Username or e-mail"
        required
        maxlength="254"
      />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" placeholder="Password" required />
    </div>
    <div class="form-actions">
      <button type="submit">Enter</button>
    </div>
  </form>
</div>

<style lang="scss">
  .container {
    display: flex;
    justify-content: center;
  }

  .fields {
    display: grid;
    grid-template-columns: minmax(0, max-content) minmax(100px, 300px);
    grid-column-gap: 0.75rem;
    grid-row-gap: 0.5rem;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
</style>
