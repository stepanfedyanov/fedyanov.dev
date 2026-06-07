<template>
  <header class="vinyl__page-block">
    <NuxtLink :to="localePath('/')">{{ $t('vinyl.back_link') }}</NuxtLink>
    <h1>{{ $t('vinyl.hero.title') }}</h1>
    <div class="vinyl__intro">
      <p>{{ $t('vinyl.hero.text') }}</p>
    </div>
  </header>

  <section class="vinyl__page-block">
    <h2>{{ $t('vinyl.collection.title') }}</h2>
    <div class="vinyl__collection">
      <article v-for="record in records" :key="record.id" class="vinyl-card">
        <img :src="record.cover_image_url ?? fallbackCoverUrl" :alt="record.album" class="vinyl-card__cover" />
        <div class="vinyl-card__content">
          <a v-if="record.discogs_url" :href="record.discogs_url" target="_blank" rel="noopener">{{ record.album }}</a>
          <span v-else>{{ record.album }}</span>
          <p>{{ record.artist }}, {{ record.album_release_year }}</p>
          <p v-if="formatRecordVariant(record)">{{ formatRecordVariant(record) }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="vinyl__details vinyl__page-block">
    <div>
      <h2>{{ $t('vinyl.top_albums.title') }}</h2>
      <table class="vinyl-table">
        <tbody>
          <tr v-for="album in topAlbums" :key="album.id">
            <td>
              <a v-if="album.discogs_url" :href="album.discogs_url" target="_blank" rel="noopener">{{ album.album }}</a>
              <span v-else>{{ album.album }}</span>
            </td>
            <td>{{ album.artist }}</td>
            <td>{{ t('vinyl.top_albums.rating', { rating: album.rating }) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>{{ $t('vinyl.statistics.title') }}</h2>
      <table class="vinyl-table vinyl-table--statistics">
        <tbody>
          <tr v-for="statistic in statistics" :key="statistic.label">
            <td>{{ statistic.label }}</td>
            <td>{{ statistic.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PublicVinylRecord, VinylStatistics } from '~/types/vinyl';

const {t, locale} = useI18n();
const localePath = useLocalePath();

const fallbackCoverUrl = '/images/vinyl-brat.svg';

const {data: vinylData} = await useFetch<{
  records: PublicVinylRecord[];
  top_albums: PublicVinylRecord[];
}>('/api/vinyl');

const {data: statisticsData} = await useFetch<{ statistics: VinylStatistics }>('/api/vinyl/statistics');

const records = computed(() => vinylData.value?.records ?? []);
const topAlbums = computed(() => vinylData.value?.top_albums ?? []);

const formatRecordVariant = (record: PublicVinylRecord) => [
  record.vinyl_color,
  record.edition_release_year ? String(record.edition_release_year) : null,
  record.limited_edition ? t('vinyl.collection.limited_edition') : null,
].filter(Boolean).join(' · ');

const statistics = computed(() => [
  {
    label: t('vinyl.statistics.items.releases.label'),
    value: t('vinyl.statistics.items.releases.value', {
      count: statisticsData.value?.statistics.release_count ?? 0,
    }),
  },
  {
    label: t('vinyl.statistics.items.discs.label'),
    value: t('vinyl.statistics.items.discs.value', {
      count: statisticsData.value?.statistics.disc_count ?? 0,
    }),
  },
  {
    label: t('vinyl.statistics.items.average_rating.label'),
    value: statisticsData.value?.statistics.average_rating === null
      ? t('vinyl.statistics.items.average_rating.empty')
      : t('vinyl.statistics.items.average_rating.value', {
        rating: statisticsData.value?.statistics.average_rating ?? 0,
      }),
  },
]);

useSeoMeta({
  title: t('seo.vinyl.title'),
  ogTitle: t('seo.vinyl.title'),
  description: t('seo.vinyl.description'),
  ogDescription: t('seo.vinyl.description'),
  ogImage: `/og-fedyanov-${locale.value}.png`,
  twitterCard: 'summary_large_image',
});
</script>

<style lang="scss">
.vinyl {
  &__page-block {
    width: 100%;
    max-width: calc(290px * 3 + 24px * 2);
  }

  &__intro {
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__collection {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  &__details {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;

    > div {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: calc(var(--default-font-size) * 1.5);
    }

    @media (max-width: 820px) {
      grid-template-columns: 100%;
      gap: 36px;
    }
  }
}

.vinyl-card {
  width: 290px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 640px) {
    width: 100%;
    max-width: 290px;
  }

  &__cover {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}

.vinyl-table {
  width: 100%;
  table-layout: fixed;

  td {
    padding-bottom: 10px;
    padding-top: 10px;
    vertical-align: top;
  }

  td:first-child {
    width: 38%;

    a {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      text-decoration-skip: none;
      text-decoration-skip-ink: none;
      white-space: nowrap;
    }
  }

  td:nth-child(2) {
    width: 42%;
  }

  td:last-child {
    width: 20%;
    text-align: right;
  }

  &--statistics {
    td:first-child {
      width: 58%;
    }

    td:last-child {
      width: 42%;
    }
  }

  @media (max-width: 520px) {
    td {
      display: block;
      width: 100% !important;
      padding-bottom: 4px;
      padding-top: 0;
    }

    td:first-child {
      padding-top: 10px;
    }

    td:last-child {
      text-align: left;
    }
  }
}
</style>
