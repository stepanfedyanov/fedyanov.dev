<template>
  <section class="admin-page users-admin">
    <header class="admin-page__header">
      <div>
        <h1>Users</h1>
        <p>{{ users.length }} admins</p>
      </div>
    </header>

    <p v-if="errorMessage" class="admin-message admin-message--error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="admin-message admin-message--success">{{ successMessage }}</p>

    <div class="users-admin__layout">
      <form class="admin-form" @submit.prevent="createUser">
        <h2>Create admin user</h2>
        <label>
          Email
          <input v-model="newUser.email" type="email" autocomplete="off" required>
        </label>
        <label>
          Password
          <input v-model="newUser.password" type="password" autocomplete="new-password" required minlength="8">
        </label>
        <button type="submit" class="admin-button" :disabled="isCreating">
          {{ isCreating ? 'Creating...' : 'Create user' }}
        </button>
      </form>

      <div class="users-admin__list">
        <article v-for="user in users" :key="user.user_id" class="user-card">
          <div>
            <strong>{{ user.email || 'No email' }}</strong>
            <small>{{ user.user_id }}</small>
            <small>Admin since {{ formatDate(user.admin_created_at) }}</small>
          </div>
          <div class="user-card__actions">
            <button type="button" @click="removeAdmin(user, false)">Remove admin</button>
            <button type="button" class="danger" @click="removeAdmin(user, true)">Delete user</button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AdminUser } from '~/types/vinyl';

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
});

const users = ref<AdminUser[]>([]);
const newUser = reactive({
  email: '',
  password: '',
});
const isCreating = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const apiHeaders = import.meta.server ? useRequestHeaders(['cookie']) : undefined;
const apiMutationHeaders = {
  ...apiHeaders,
  'x-admin-request': '1',
};

async function loadUsers() {
  const response = await $fetch<{ users: AdminUser[] }>('/api/admin/users', {
    headers: apiHeaders,
  });
  users.value = response.users;
}

async function createUser() {
  isCreating.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await $fetch<{ user: AdminUser }>('/api/admin/users', {
      method: 'POST',
      body: newUser,
      headers: apiMutationHeaders,
    });

    users.value = [response.user, ...users.value];
    newUser.email = '';
    newUser.password = '';
    successMessage.value = 'User created.';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to create user.';
  } finally {
    isCreating.value = false;
  }
}

async function removeAdmin(user: AdminUser, deleteAuthUser: boolean) {
  const action = deleteAuthUser ? 'delete this auth user' : 'remove admin access';

  if (!confirm(`Are you sure you want to ${action} for ${user.email || user.user_id}?`)) {
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  try {
    await $fetch(`/api/admin/users/${user.user_id}`, {
      method: 'DELETE',
      query: {
        deleteAuthUser,
      },
      headers: apiMutationHeaders,
    });

    users.value = users.value.filter((item) => item.user_id !== user.user_id);
    successMessage.value = deleteAuthUser ? 'User deleted.' : 'Admin access removed.';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to update user.';
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

await loadUsers();

useSeoMeta({
  title: 'Users Admin',
});
</script>

<style lang="scss">
.users-admin {
  &__layout {
    display: grid;
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
    gap: 24px;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.user-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid #d7d7d0;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 760px) {
    flex-direction: column;
  }

  div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  small {
    overflow-wrap: anywhere;
    color: #6a6a64;
  }

  &__actions {
    flex-direction: row !important;
    align-items: flex-start;
    flex-wrap: wrap;

    button {
      padding: 8px 10px;
      border: 1px solid #c9c9c3;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
    }

    .danger {
      color: #a31515;
    }
  }
}
</style>
