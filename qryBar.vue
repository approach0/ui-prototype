<template>
<div>
  <vs-button vs-type="filled" @click="active = !active">Click me!</vs-button>
  <img src="https://www.iwantwallpaper.co.uk/images/muriva-bluff-embossed-brick-effect-wallpaper-j30309-p711-1303_image.jpg"/>
  <vs-sidebar :vs-active.sync="active">
    <vs-sidebar-item vs-icon="build">
    Settings
    </vs-sidebar-item>
    <vs-sidebar-item vs-icon="favorite">
    Stared queries
    </vs-sidebar-item>
    <vs-sidebar-item vs-icon="exit_to_app">
    Exit
    </vs-sidebar-item>
  </vs-sidebar>
</div>
</template>
<script>
export default {
	data: function () {
		return {
			'active': true
		}
	},
	created: function () {
    console.log('created!');
	},
	methods: {
  }
}
</script>

<style>
</style>
