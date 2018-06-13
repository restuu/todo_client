<template>
  <div class="row">
    <small class="col-12">{{city.name}}</small>
    <div class="col-12">
      <b-img 
        thumbnail
        fluid
        v-for="weather in weathers"
        :key="weather.dt"
        :src="`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`"
        class="col-3"
        ></b-img>
    </div>
  </div>
</template>

<script>
export default {
  props: ['city', 'weathers'],
  
}
</script>

<style>

</style>
