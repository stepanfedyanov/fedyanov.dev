<template>
  <div>
    <slot />
  </div>
</template>

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
}

h1, h2, h3, h4, h5, h6, a {
  font-family: 'PT Serif', serif;
  font-weight: normal;
  margin: 0;
}

a {
  font-size: var(--default-font-size);
  text-underline-offset: 25%;
  text-decoration-skip-ink: none;
  color: #000;
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

body {
  padding: 80px 100px;
}

section {
  display: flex;
  flex-direction: column;
  gap: calc(var(--default-font-size) * 1.5)
}

.link-container {
  display: flex;
  gap: calc(var(--default-font-size) * 1.5);
  flex-wrap: wrap;
}
</style>