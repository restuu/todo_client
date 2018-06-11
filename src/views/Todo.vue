<template>
  <div id="todo">
    <Navbar :status="true"/>
    <div class="">
      <List/>
    </div>
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
    let token = localStorage.getItem('token')
    if (!token) {
      alert('please login first')
      this.$router.push({name: 'home'})
    } 
  }
}
</script>
