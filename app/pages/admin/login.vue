<template>
  <main class="admin-login">
    <form class="admin-login__form" @submit.prevent="login">
      <h1>Admin Login</h1>
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" required>
      </label>
      <label>
        Password
        <input v-model="password" type="password" autocomplete="current-password" required>
      </label>
      <p v-if="errorMessage" class="admin-login__error">{{ errorMessage }}</p>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

function getRedirectTarget() {
  const redirect = route.query.redirect;

  if (typeof redirect !== 'string' || !redirect.startsWith('/admin') || redirect.startsWith('//')) {
    return '/admin';
  }

  return redirect;
}

async function login() {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'x-admin-request': '1',
      },
      body: {
        email: email.value,
        password: password.value,
      },
    });

    await navigateTo(getRedirectTarget());
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to sign in.';
    isSubmitting.value = false;
  }
}

useSeoMeta({
  title: 'Admin Login',
});
</script>

<style lang="scss">
body:has(.admin-login) {
  padding: 0;
  background: #f6f6f3;
}

.admin-login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;

  &__form {
    width: min(100%, 380px);
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 28px;
    border: 1px solid #deded8;
    border-radius: 8px;
    background: #fff;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: bold;
  }

  input {
    padding: 10px 12px;
    border: 1px solid #c9c9c3;
    border-radius: 6px;
    font: inherit;
  }

  button {
    padding: 11px 14px;
    border: 0;
    border-radius: 6px;
    background: #171717;
    color: #fff;
    cursor: pointer;
  }

  &__error {
    color: #a31515;
  }
}
</style>
