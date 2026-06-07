<template>
  <section class="admin-page vinyl-admin">
    <header class="admin-page__header">
      <div>
        <h1>Vinyl</h1>
        <p>{{ records.length }} records</p>
      </div>
      <button type="button" class="admin-button" @click="startCreate">New record</button>
    </header>

    <p v-if="errorMessage" class="admin-message admin-message--error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="admin-message admin-message--success">{{ successMessage }}</p>

    <div class="vinyl-admin__layout">
      <div class="vinyl-admin__list">
        <article
          v-for="record in records"
          :key="record.id"
          class="vinyl-admin-card"
          :class="{ 'vinyl-admin-card--selected': selectedRecord?.id === record.id }"
        >
          <button type="button" class="vinyl-admin-card__main" @click="editRecord(record)">
            <img
              v-if="record.cover_image_url"
              :src="record.cover_image_url"
              :alt="record.album"
              class="vinyl-admin-card__cover"
            >
            <span v-else class="vinyl-admin-card__placeholder">No cover</span>
            <span>
              <strong>{{ record.artist }}</strong>
              <span>{{ record.album }}</span>
              <small>{{ record.album_release_year }} · {{ record.is_published ? 'Published' : 'Hidden' }}</small>
            </span>
          </button>
          <div class="vinyl-admin-card__actions">
            <button type="button" @click="togglePublished(record)">
              {{ record.is_published ? 'Hide' : 'Publish' }}
            </button>
            <button type="button" class="danger" @click="deleteRecord(record)">Delete</button>
          </div>
        </article>
      </div>

      <form class="admin-form vinyl-admin__form" @submit.prevent="saveRecord">
        <h2>{{ selectedRecord ? 'Edit record' : 'New record' }}</h2>

        <fieldset>
          <legend>Basic information</legend>
          <label>
            Artist
            <input v-model="form.artist" required>
          </label>
          <label>
            Album
            <input v-model="form.album" required>
          </label>
          <div class="admin-form__grid">
            <label>
              Album release year
              <input v-model.number="form.album_release_year" type="number" min="1900" max="2100" required>
            </label>
            <label>
              Edition release year
              <input v-model.number="form.edition_release_year" type="number" min="1900" max="2100">
            </label>
          </div>
          <label>
            Genres
            <textarea v-model="genresText" rows="2" placeholder="One per line or comma-separated" />
          </label>
          <label>
            Cover
            <input type="file" accept="image/*" @change="uploadCover">
          </label>
          <label>
            Cover path
            <input v-model="form.cover_image_path" placeholder="Supabase storage path">
          </label>
        </fieldset>

        <fieldset>
          <legend>Collecting information</legend>
          <div class="admin-form__grid">
            <label>
              Label
              <input v-model="form.label">
            </label>
            <label>
              Country
              <input v-model="form.country">
            </label>
          </div>
          <div class="admin-form__grid">
            <label>
              Vinyl color
              <input v-model="form.vinyl_color">
            </label>
            <label>
              Disc count
              <input v-model.number="form.disc_count" type="number" min="1">
            </label>
          </div>
          <div class="admin-form__grid">
            <label>
              Speed
              <select v-model="form.speed">
                <option :value="null">Unknown</option>
                <option value="33_1_3">33⅓ RPM</option>
                <option value="45">45 RPM</option>
              </select>
            </label>
            <label>
              Copy number
              <input v-model="form.copy_number" placeholder="123/500">
            </label>
          </div>
          <label class="admin-checkbox">
            <input v-model="form.limited_edition" type="checkbox">
            Limited edition
          </label>
          <label>
            Discogs URL
            <input v-model="form.discogs_url" type="url">
          </label>
        </fieldset>

        <fieldset>
          <legend>Personal information</legend>
          <div class="admin-form__grid">
            <label>
              Rating
              <input v-model.number="form.rating" type="number" min="1" max="10">
            </label>
            <label>
              Purchased at
              <input v-model="form.purchased_at" type="date">
            </label>
          </div>
          <label>
            Favorite tracks
            <textarea v-model="favoriteTracksText" rows="3" placeholder="One per line" />
          </label>
          <label>
            Purchased from
            <input v-model="form.purchased_from">
          </label>
          <label>
            Why it is in collection
            <textarea v-model="form.collection_reason" rows="3" />
          </label>
          <label>
            Comment
            <textarea v-model="form.comment" rows="3" />
          </label>
        </fieldset>

        <fieldset>
          <legend>Publishing</legend>
          <div class="admin-form__grid">
            <label>
              Sort order
              <input v-model.number="form.sort_order" type="number">
            </label>
            <label class="admin-checkbox admin-checkbox--inline">
              <input v-model="form.is_published" type="checkbox">
              Published
            </label>
          </div>
        </fieldset>

        <div class="admin-form__actions">
          <button type="submit" class="admin-button" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" class="admin-button admin-button--secondary" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VinylRecord, VinylRecordInput } from '~/types/vinyl';

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
});

const emptyForm = (): VinylRecordInput => ({
  artist: '',
  album: '',
  album_release_year: new Date().getFullYear(),
  edition_release_year: null,
  genres: [],
  cover_image_path: null,
  label: null,
  country: null,
  vinyl_color: null,
  disc_count: 1,
  speed: null,
  limited_edition: false,
  copy_number: null,
  discogs_url: null,
  rating: null,
  favorite_tracks: [],
  purchased_at: null,
  purchased_from: null,
  collection_reason: null,
  comment: null,
  is_published: false,
  sort_order: 0,
});

const records = ref<VinylRecord[]>([]);
const selectedRecord = ref<VinylRecord | null>(null);
const form = reactive<VinylRecordInput>(emptyForm());
const genresText = ref('');
const favoriteTracksText = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isSaving = ref(false);
const apiHeaders = import.meta.server ? useRequestHeaders(['cookie']) : undefined;
const apiMutationHeaders = {
  ...apiHeaders,
  'x-admin-request': '1',
};

function syncArrayText() {
  form.genres = splitText(genresText.value);
  form.favorite_tracks = splitText(favoriteTracksText.value);
}

function splitText(value: string) {
  return value
    .split('\n')
    .flatMap((line) => line.split(','))
    .map((item) => item.trim())
    .filter(Boolean);
}

function setForm(record: VinylRecordInput) {
  Object.assign(form, structuredClone(record));
  genresText.value = record.genres.join('\n');
  favoriteTracksText.value = record.favorite_tracks.join('\n');
}

function resetForm() {
  selectedRecord.value = null;
  setForm(emptyForm());
}

function startCreate() {
  resetForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function editRecord(record: VinylRecord) {
  selectedRecord.value = record;
  setForm(record);
}

async function loadRecords() {
  const response = await $fetch<{ records: VinylRecord[] }>('/api/admin/vinyl', {
    headers: apiHeaders,
  });
  records.value = response.records;
}

async function saveRecord() {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  syncArrayText();

  try {
    if (selectedRecord.value) {
      const response = await $fetch<{ record: VinylRecord }>(`/api/admin/vinyl/${selectedRecord.value.id}`, {
        method: 'PUT',
        body: form,
        headers: apiMutationHeaders,
      });
      records.value = records.value.map((record) => record.id === response.record.id ? response.record : record);
      selectedRecord.value = response.record;
    } else {
      const response = await $fetch<{ record: VinylRecord }>('/api/admin/vinyl', {
        method: 'POST',
        body: form,
        headers: apiMutationHeaders,
      });
      records.value = [response.record, ...records.value];
      selectedRecord.value = response.record;
    }

    successMessage.value = 'Saved.';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save record.';
  } finally {
    isSaving.value = false;
  }
}

async function togglePublished(record: VinylRecord) {
  const payload: VinylRecordInput = {
    ...record,
    is_published: !record.is_published,
  };

  const response = await $fetch<{ record: VinylRecord }>(`/api/admin/vinyl/${record.id}`, {
    method: 'PUT',
    body: payload,
    headers: apiMutationHeaders,
  });

  records.value = records.value.map((item) => item.id === record.id ? response.record : item);

  if (selectedRecord.value?.id === record.id) {
    selectedRecord.value = response.record;
    setForm(response.record);
  }
}

async function deleteRecord(record: VinylRecord) {
  if (!confirm(`Delete "${record.album}"?`)) {
    return;
  }

  await $fetch(`/api/admin/vinyl/${record.id}`, {
    method: 'DELETE',
    headers: apiMutationHeaders,
  });

  records.value = records.value.filter((item) => item.id !== record.id);

  if (selectedRecord.value?.id === record.id) {
    resetForm();
  }
}

async function uploadCover(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const body = new FormData();
  body.append('file', file);

  const response = await $fetch<{ path: string; public_url: string | null }>('/api/admin/vinyl/covers', {
    method: 'POST',
    body,
    headers: apiMutationHeaders,
  });

  form.cover_image_path = response.path;
  successMessage.value = 'Cover uploaded.';
}

await loadRecords();

useSeoMeta({
  title: 'Vinyl Admin',
});
</script>

<style lang="scss">
.vinyl-admin {
  &__layout {
    display: grid;
    grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
    gap: 24px;
    align-items: start;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.vinyl-admin-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  padding: 10px;
  border: 1px solid #d7d7d0;
  border-radius: 8px;
  background: #fff;

  &--selected {
    border-color: #171717;
  }

  &__main {
    min-width: 0;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;

    span {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }

  &__cover,
  &__placeholder {
    width: 64px;
    aspect-ratio: 1;
    border-radius: 4px;
    object-fit: cover;
    background: #ecece7;
  }

  &__placeholder {
    display: grid;
    place-items: center;
    color: #777;
    font-size: 12px;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 6px;

    button {
      padding: 7px 9px;
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

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid #d7d7d0;
  border-radius: 8px;
  background: #fff;

  fieldset {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 16px;
    border: 1px solid #e1e1dc;
    border-radius: 8px;
  }

  legend {
    padding: 0 6px;
    font-weight: bold;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: bold;
  }

  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 10px;
    border: 1px solid #c9c9c3;
    border-radius: 6px;
    background: #fff;
    font: inherit;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 680px) {
      grid-template-columns: 1fr;
    }
  }

  &__actions {
    display: flex;
    gap: 10px;
  }
}

.admin-checkbox {
  flex-direction: row !important;
  align-items: center;

  input {
    width: auto;
  }

  &--inline {
    align-self: end;
    min-height: 40px;
  }
}

.admin-button {
  padding: 10px 13px;
  border: 0;
  border-radius: 6px;
  background: #171717;
  color: #fff;
  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  &--secondary {
    border: 1px solid #c9c9c3;
    background: #fff;
    color: #171717;
  }
}

.admin-message {
  padding: 10px 12px;
  border-radius: 6px;

  &--error {
    background: #fff0f0;
    color: #a31515;
  }

  &--success {
    background: #edf8ef;
    color: #25622f;
  }
}
</style>
