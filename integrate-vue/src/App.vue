<template>
  <div id="app">
    <md-app>
      <md-app-toolbar class="md-primary">
        <h3 class="md-title" style="flex: 1; text-align: left;">Title</h3>
        <md-button to="/">Home</md-button>
        <md-button to="/about" class="md-primary">About</md-button>
      </md-app-toolbar>
    </md-app>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
