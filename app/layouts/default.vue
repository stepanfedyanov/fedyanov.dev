<template>
  <main>
    <slot />

    <footer>
      <h2>{{ $t('index.social_networks.title') }}</h2>
      <div class="link-container">
        <a
          v-for="social in $tm('index.social_networks.items')"
          :key="$rt(social.name)"
          :href="resolveLinkUrl($rt(social.url))"
          :target="resolveLinkTarget(social)"
        >
          {{ $rt(social.name) }}
        </a>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

const resolveLinkUrl = (url: string) => url.startsWith('/') ? localePath(url) : url;
const resolveLinkTarget = (link: unknown) => {
  const target = (link as { target?: unknown }).target;

  return typeof target === 'string' ? target : undefined;
};
</script>

<style lang="scss">
@font-face {
  font-family: 'PT Serif';
  src: local('PT Serif Bold'), local('PTSerif-Bold'),
      url('fonts/PTSerif-Bold.woff2') format('woff2'),
      url('fonts/PTSerif-Bold.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PT Serif';
  src: local('PT Serif Bold Italic'), local('PTSerif-BoldItalic'),
       url('fonts/PTSerif-BoldItalic.woff2') format('woff2'),
       url('fonts/PTSerif-BoldItalic.woff') format('woff');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'PT Serif';
  src: local('PT Serif Italic'), local('PTSerif-Italic'),
       url('fonts/PTSerif-Italic.woff2') format('woff2'),
       url('fonts/PTSerif-Italic.woff') format('woff');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'PT Serif';
  src: local('PT Serif'), local('PTSerif-Regular'),
       url('fonts/PTSerif-Regular.woff2') format('woff2'),
       url('fonts/PTSerif-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PT Sans';
  src: local('PT Sans Bold'), local('PTSans-Bold'),
       url('fonts/PTSans-Bold.woff2') format('woff2'),
       url('fonts/PTSans-Bold.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PT Sans';
  src: local('PT Sans Bold Italic'), local('PTSans-BoldItalic'),
       url('fonts/PTSans-BoldItalic.woff2') format('woff2'),
       url('fonts/PTSans-BoldItalic.woff') format('woff');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'PT Sans';
  src: local('PT Sans Italic'), local('PTSans-Italic'),
       url('fonts/PTSans-Italic.woff2') format('woff2'),
       url('fonts/PTSans-Italic.woff') format('woff');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'PT Sans';
  src: local('PT Sans'), local('PTSans-Regular'),
       url('fonts/PTSans-Regular.woff2') format('woff2'),
       url('fonts/PTSans-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --default-font-size: 16px;
}

* {
  font-family: 'PT Sans', serif;
  line-height: 1.4;
  backface-visibility: hidden;
}

h1, h2, h3, h4, h5, h6, a {
  font-family: 'PT Serif', serif;
  font-weight: normal;
  margin: 0;
}

a {
  font-size: var(--default-font-size);
  color: #000;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 25%;
  text-decoration-skip: none;
  text-decoration-skip-ink: none;
}

h1 {
  font-size: calc(var(--default-font-size) * 2.5);
}

h2 {
  font-size: calc(var(--default-font-size) * 2);
}

h3 {
  font-size: var(--default-font-size);
}

p {
  margin: 0;
}

body {
  padding: 80px 100px;

  @media (max-width: 900px) {
    padding: 40px 20px;
  }
}

main {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

section, footer, header {
  display: flex;
  flex-direction: column;
  gap: calc(var(--default-font-size) * 1.5)
}

.link-container {
  display: flex;
  gap: calc(var(--default-font-size) * 1.5);
  flex-wrap: wrap;
}

footer {
  .link-container {
    max-width: 345px;
  }
}
</style>
