<template>
  <section class="admin-page">
    <header class="admin-page__header">
      <div>
        <h1>Admin</h1>
        <p>Manage vinyl records and admin users.</p>
      </div>
    </header>
    <div class="admin-actions">
      <NuxtLink to="/admin/vinyl">Open vinyl records</NuxtLink>
      <NuxtLink to="/admin/users">Open users</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
});

useSeoMeta({
  title: 'Admin',
});
</script>

<style lang="scss">
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
}

.admin-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  a {
    padding: 10px 12px;
    border-radius: 6px;
    background: #171717;
    color: #fff;
    font-family: 'PT Sans', serif;
    text-decoration: none;
  }
}
</style>
