<template>
  <div id="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Navbar 
      :status="isLogin"
      @loginFb="loginFb"
      />
    <Welcome/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '@/components/Navbar.vue'
import Welcome from '@/components/Welcome.vue'
import axios from 'axios'
import { getFbAPI } from '@/assets/js/fbApi.js'

export default {
  name: 'home',
  data () {
    return {
      isLogin: false
    }
  },
  components: {
    // HelloWorld
    Navbar,
    Welcome
  },
  methods: {
    loginFb () {
      let self = this
      FB.getLoginStatus(function (response) {
        if (response.status !== 'connected') {
          FB.login(function () {})
        }
        console.log('logged in FB')
        getFbAPI(function (profile) {
          axios
            .post(
              'http://localhost:3000/users/signin',
              {
                isFb: true,
                name: profile.name,
                email: profile.email
              }
            )
            .then(response => {
              console.log(response)
              localStorage.token = response.data.token
              self.$router.push({name: 'todos'})
            })
            .catch(err => {
              if (err.response) {
                console.log(err.response)
              } else if (err.request) {
                console.log(err.request)
              } else {
                console.log(err.message)
              }
            })
        })
      })
    }
  },
  created () {
    if (localStorage.token) {
      this.isLogin = true
      this.$router.push({name: 'todos'})
    }
  }
}
</script>
