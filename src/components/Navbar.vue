<template>
  <b-navbar toggleable="md" type="dark" variant="dark">

    <b-navbar-brand href="#">ToDo</b-navbar-brand>

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">

      <b-nav-form>
        <b-form-input size="sm" class="mr-sm-auto" type="text" placeholder="Search"/>
        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
      </b-nav-form>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="!status" @click="$emit('loginFb')"> Login <i class="fa fa-facebook-f"></i> </b-nav-item>
        <b-nav-item v-else-if="status" @click="logout"> Logout </b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  props: {
    status: Boolean
  },

  methods: {
    logout () {
      delete localStorage.token
      this.$router.push('/')
    }
  }
}
</script>
