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
      <article v-for="record in records" :key="record.title" class="vinyl-card">
        <img :src="record.cover" :alt="record.title" class="vinyl-card__cover" />
        <div class="vinyl-card__content">
          <a :href="record.url" target="_blank">{{ record.title }}</a>
          <p>{{ record.artist }}, {{ record.year }} ({{ record.albumType }})</p>
          <p v-if="record.variant">{{ record.variant }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="vinyl__details vinyl__page-block">
    <div>
      <h2>{{ $t('vinyl.top_albums.title') }}</h2>
      <table class="vinyl-table">
        <tbody>
          <tr v-for="album in topAlbums" :key="album.title">
            <td>
              <a :href="album.url" target="_blank">{{ album.title }}</a>
            </td>
            <td>{{ album.artist }}</td>
            <td>{{ album.rating }}</td>
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
const {t, locale} = useI18n();
const localePath = useLocalePath();

const records = [
  {
    title: 'Brat And It’s Completely Different But Also Still Brat',
    artist: 'Charli XCX',
    year: '2025',
    albumType: 'Album',
    variant: 'Green Translucent',
    cover: '/images/vinyl-brat.svg',
    url: 'https://open.spotify.com/album/0PIR7PK8DMB4pgoxqN0F5m',
  },
  {
    title: 'MAYHEM',
    artist: 'Lady Gaga',
    year: '2025',
    albumType: 'Album',
    variant: 'Clear Vinyl',
    cover: '/images/vinyl-mayhem.svg',
    url: 'https://open.spotify.com/album/2MHUaRi9OCyTN02SoyRRBJ',
  },
  {
    title: 'The Rise and Fall of a Midwest Princess',
    artist: 'Chappell Roan',
    year: '2023',
    albumType: 'Album',
    variant: 'Pink Pony Club Edition',
    cover: '/images/vinyl-midwest-princess.svg',
    url: 'https://open.spotify.com/album/0EiI8ylL0FmWWpgHVTsZjZ',
  },
];

const topAlbums = [
  {
    title: 'MAYHEM',
    artist: 'Lady Gaga',
    rating: '10/10',
    url: 'https://open.spotify.com/album/2MHUaRi9OCyTN02SoyRRBJ',
  },
  {
    title: 'Brat And It’s Completely Different But Also Still Brat',
    artist: 'Charli XCX',
    rating: '9/10',
    url: 'https://open.spotify.com/album/0PIR7PK8DMB4pgoxqN0F5m',
  },
  {
    title: 'The Rise and Fall of a Midwest Princess',
    artist: 'Chappell Roan',
    rating: '9/10',
    url: 'https://open.spotify.com/album/0EiI8ylL0FmWWpgHVTsZjZ',
  },
];

const statistics = computed(() => [
  {
    label: t('vinyl.statistics.items.collected.label'),
    value: t('vinyl.statistics.items.collected.value'),
  },
  {
    label: t('vinyl.statistics.items.total_duration.label'),
    value: t('vinyl.statistics.items.total_duration.value'),
  },
  {
    label: t('vinyl.statistics.items.live_albums.label'),
    value: t('vinyl.statistics.items.live_albums.value'),
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
