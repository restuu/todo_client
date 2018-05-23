<template>
  <div id="todo">
    <Navbar :status="true"/>
    <List/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import List from '@/components/List.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    List
  },

  methods: {
    
  },

  created () {
    if (!localStorage.token) {
      alert('please login first')
      this.$router.push({name: 'home'})
    } 
  }
}
</script>
