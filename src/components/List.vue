<template>
  <div class="list">

    <h3 class="mt-3"> Welcome {{ name }} </h3>
    <p v-if="todos.length === 0"> You don't have any todo list yet </p>

    <b-form class="mt-2">

      <div class="mx-auto">
        <label for="newTitle">Title:</label>
        <b-form-input id="newTitle" v-model="newTitle" placeholder="enter todo title" required/>
      </div>
      <div class="mx-auto">
        <label for="newDesc">Desc:</label>
        <b-form-input id="newDesc" v-model="newDesc" placeholder="enter todo description"/>
      </div>
      <b-button variant="primary" @click="addNewTodo">Submit</b-button>

    </b-form>

    <div class="mt-3">
      <b-list-group class="row" v-for="todo in todos" :key="todo">
        <b-list-group-item 
          class="col-6 col-lg-5 mx-auto text-left"
          :class="{ completed: todo.isCompleted }"
          @click="completeTodo(todo._id)"
          > 
          <h5>{{ todo.title }}</h5>
          <small class="text-muted">{{ todo.desc }}</small>
        </b-list-group-item>
      </b-list-group>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

let handlingErr = function (err) {
  if (err.response) {
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (err.request) {
    console.log(err.request)
  } else {
    console.log(err.message)
  }
}

export default {
  data () {
    return {
      name: '',
      todos: [],
      newTitle: '',
      newDesc: ''
    }
  },


  methods: {
    getTodos () {
      let self = this
      axios({
        method: 'get',
        url: 'http://localhost:3000/todos',
        headers: {
          'token': localStorage.token
        }
      })
        .then(response => {
          console.log('-----response',response.data)
          self.name = response.data.user.name
          self.todos = response.data.user.todos
        })
      .catch(err => {
        handlingErr(err)
      })
    },

    addNewTodo () {
      let self = this
      axios({
        url: 'http://localhost:3000/todos/add',
        method: 'post',
        data: {
          title: self.newTitle,
          desc: self.newDesc,
          token: localStorage.token
        }
      })
        .then(response => {
          console.log(response.data)
          self.newTitle = ''
          self.newDesc = ''
          self.getTodos()
        })
      .catch(err => {
        handlingErr(err)
      })
    },

    completeTodo (todoId) {
      let self = this
      axios({
        url: 'http://localhost:3000/todos/complete',
        method: 'put',
        data: {
          token: localStorage.token,
          todoId
        }
      })
        .then(({data}) => {
          console.log(data)
          self.getTodos()
        })
      .catch(err => {
        handlingErr(err)
      })
    }
  },

  created () {
    this.getTodos()
  }
}
</script>


<style lang="scss">
  .list {
    max-width: 50rem;
  }

  .completed {
    text-decoration: line-through
  }
</style>
