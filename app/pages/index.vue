<template>
  <section>
    <h1>{{ $t('index.hero.title') }}</h1>

    <div class="hero__container">
      <NuxtPicture src="/images/hero-fedyanov-avatar.jpg" />
      <p>{{ $t('index.hero.about_me') }}</p>
      <p>{{ $t('index.hero.about_me_headline') }}</p>

      <div class="link-container">
        <a v-for="link in $tm('index.hero.links')" :key="$rt(link.name)" :href="$rt(link.url)">
          {{ $rt(link.name) }}
        </a>
      </div>
    </div>
  </section>

  <section>
    <h2>{{ $t('index.work_experience.title') }}</h2>
    <div class="work-experience__container">
      <div v-for="experience in $tm('index.work_experience.items')" :key="$rt(experience.position)">
        <h3>{{ $rt(experience.position) }}</h3>
        <a :href="$rt(experience.company_link)" target="_blank">{{ $rt(experience.company) }}</a>
        <p>{{ $rt(experience.period) }}</p>
      </div>
    </div>
  </section>

  <section>
    <h2>{{ $t('index.videos.title') }}</h2>
    <div class="videos__container">
      <a v-for="video in $tm('index.videos.items')" :key="$rt(video.title)" :href="$rt(video.url)" target="_blank">
        <video :src="$rt(video.thumnail_video)" :poster="$rt(video.thumbnail_image)" autoplay muted loop />
        <h3>{{ $rt(video.title) }}</h3>
        <p>{{ $rt(video.place) }}</p>
      </a>
    </div>
  </section>

  <section>
    <h2>{{ $t('index.social_networks.title') }}</h2>
    <div class="link-container">
      <a v-for="social in $tm('index.social_networks.items')" :key="$rt(social.name)" :href="$rt(social.url)" target="_blank">
        {{ $rt(social.name) }}
      </a>
    </div>
  </section>
</template>

<style lang="scss">

</style>