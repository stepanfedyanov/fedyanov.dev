<template>
  <div class="admin-shell">
    <aside class="admin-shell__sidebar">
      <NuxtLink class="admin-shell__brand" to="/admin">Vinyl Admin</NuxtLink>
      <nav class="admin-shell__nav">
        <NuxtLink to="/admin/vinyl">Vinyl</NuxtLink>
        <NuxtLink to="/admin/users">Users</NuxtLink>
        <NuxtLink to="/">Site</NuxtLink>
      </nav>
      <button type="button" class="admin-shell__logout" @click="logout">Sign out</button>
    </aside>
    <main class="admin-shell__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

async function logout() {
  await supabase.auth.signOut();
  await navigateTo('/admin/login');
}
</script>

<style lang="scss">
body:has(.admin-shell) {
  padding: 0;
  background: #f6f6f3;
}

.admin-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  color: #1d1d1b;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 28px;
    background: #171717;
    color: #fff;

    a {
      color: #fff;
      font-family: 'PT Sans', serif;
      text-decoration: none;
    }

    @media (max-width: 760px) {
      min-height: auto;
    }
  }

  &__brand {
    font-weight: bold;
    font-size: 20px;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 12px;

    a {
      padding: 9px 10px;
      border-radius: 6px;
    }

    .router-link-active {
      background: #32322f;
    }
  }

  &__logout {
    margin-top: auto;
    padding: 10px 12px;
    border: 1px solid #555;
    border-radius: 6px;
    background: transparent;
    color: #fff;
    cursor: pointer;
  }

  &__main {
    min-width: 0;
    padding: 32px;
    display: block;

    @media (max-width: 760px) {
      padding: 20px;
    }
  }
}
</style>
