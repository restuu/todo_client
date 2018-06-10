<template>
  <div id="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Navbar 
      :status="isLogin"
      @login="login"
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
import { firebase, providerFB } from '@/assets/js/firebase.js'

export default {
  name: 'home',
  data () {
    return {
      isLogin: false,
      user: {}
    }
  },
  components: {
    // HelloWorld
    Navbar,
    Welcome
  },
  methods: {
    login (e) {
      switch (e) {
        case 'fb':
          this.loginFb()
          break;
      
        default:
          break;
      }
    },

    loginFb () {
      let self = this

      firebase
        .auth().signInWithPopup(providerFB)
        .then(result => {
          let token = result.credential.accessToken
          self.user = { 
            name: result.user.displayName,
            email: result.user.email,
            socmedId: result.user.uid
          }
          self.loginBySocmed()
        })
        .catch(err => {
          // Handle Errors here.
          let errorCode = err.code;
          let errorMessage = err.message;
          // The email of the user's account used.
          let email = err.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = err.credential;
          console.log('error code', errorCode)
          console.log('errorMessage', errorMessage)
        })
    },

    loginBySocmed () {
      this.user.isSocmed = true
      let self = this
      axios({
        url: 'http://localhost:3000/users/signin',
        method: 'post',
        data: self.user
      })
      .then(({data}) => {
        console.log(data)
        localStorage.setItem('token', data.token)
        this.$router.push({name: 'todos'})
      })
      .catch(err => {
        console.log('error',err)
      })
    }
  },
  created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.isLogin = true
      this.$router.push({name: 'todos'})
    }
  }
}
</script>
