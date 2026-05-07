<template>
  <header>
    <h1>{{ $t('index.hero.title') }}</h1>

    <div class="hero__container">
      <NuxtPicture class="hero__avatar" src="/images/hero-fedyanov-avatar.jpg" />
      
      <div class="hero__container-text">
        <p>{{ $t('index.hero.about_me') }}</p>
        <p>{{ $t('index.hero.about_me_headline') }}</p>

        <div class="link-container">
          <a v-for="link in $tm('index.hero.links')" :key="$rt(link.name)" :href="$rt(link.url)">
            {{ $rt(link.name) }}
          </a>
        </div>
      </div>
    </div>
  </header>

  <section>
    <h2>{{ $t('index.work_experience.title') }}</h2>
    <div class="work-experience__container">
      <table>
        <tbody>
          <tr v-for="experience in $tm('index.work_experience.items')" :key="$rt(experience.position)">
            <td>
              <h3>{{ $rt(experience.position) }}</h3>
            </td>
            <td>
              <a :href="$rt(experience.company_link)" target="_blank">{{ $rt(experience.company) }}</a>
            </td>
            <td>
              {{ $rt(experience.period) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-for="experience in $tm('index.work_experience.items')" :key="$rt(experience.position)" class="work-experience__mobile-item">
        <h3>{{ $rt(experience.position) }}</h3>
        <a :href="$rt(experience.company_link)" target="_blank">{{ $rt(experience.company) }}</a>
        <p>{{ $rt(experience.period) }}</p>
      </div>
    </div>
  </section>

  <section>
    <h2>{{ $t('index.videos.title') }}</h2>
    <div class="videos__container">
      <div v-for="video in $tm('index.videos.items')" :key="$rt(video.title)">
        <a :href="$rt(video.url)" target="_blank">
          <video :src="$rt(video.thumnail_video)" :poster="$rt(video.thumbnail_image)" autoplay muted loop />
          <h3>{{ $rt(video.title) }}</h3>
        </a>
        <p>{{ $rt(video.place) }}</p>
      </div>  
    </div>
  </section>

  <footer>
    <h2>{{ $t('index.social_networks.title') }}</h2>
    <div class="link-container">
      <a v-for="social in $tm('index.social_networks.items')" :key="$rt(social.name)" :href="$rt(social.url)" target="_blank">
        {{ $rt(social.name) }}
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const {t, locale} = useI18n();

useSeoMeta({
  title: t('seo.index.title'),
  ogTitle: t('seo.index.title'),
  description: t('seo.index.description'),
  ogDescription: t('seo.index.description'),
  ogImage: `/og-fedyanov-${locale.value}.png`,
  twitterCard: 'summary_large_image',
});
</script>

<style lang="scss">
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(1turn);
  }
}

.hero {
  &__container {
    display: flex;
    gap: 28px;

    @media (max-width: 425px) {
      flex-direction: column;
    }
  }

  &__container-text {
    max-width: 475px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__avatar {
    position: relative;

    img {
      position: relative;
      z-index: 1;
      width: 88px;
      height: 88px;
    }

    &::after {
      animation: rotate 4s linear 0s infinite;
      background: linear-gradient(90deg, #ff75c3, #ffa647 20%, #ffe83f, #9fff5b, #70e2ff 80%, #cd93ff);
      content: "";
      filter: blur(20px);
      height: 80px;
      left: 0;
      position: absolute;
      top: 0;
      width: 80px;
      z-index: 0;
    }
  }
}

.work-experience {
  &__container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    table {
      max-width: 700px;

      @media (max-width: 700px) {
        display: none;
      }

      td {
        padding-bottom: 10px;
        padding-top: 10px;

        h3 {
          font-family: 'PT Sans', serif;
        }
      }
    }
  }
  &__mobile-item {
    display: none;

    @media (max-width: 700px) {
      display: block;
    }
  }
}

.videos {
  &__container {
    display: grid;
    grid-template-columns: 290px 290px 290px;

    @media (max-width: 1120px) {
      grid-template-columns: 290px 290px;
    }

    @media (max-width: 600px) {
      grid-template-columns: 100%;
    }

    gap: 24px;

    video {
      width: 100%;
      aspect-ratio: 16 / 9;
      margin-bottom: 8px;
    }

    h3 {
      padding-bottom: 5px;
    }

    p {
      text-decoration: none;
    }
  }
}

footer {
  .link-container {
    max-width: 345px;
  }
}
</style>