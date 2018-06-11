<template>
  <div class="list container">

    <h3 class="mt-3"> Welcome {{ name }} </h3>
    <p v-if="todos.length === 0"> You don't have any todo list yet </p>

    <div class="row" style="border: 1px solid red">

      <b-form class="mt-3 col-sm-5" style="border: 1px solid yellow">

        <div class="mx-auto mb-2">
          <!-- <label for="newTitle">Title:</label> -->
          <b-form-input id="newTitle" v-model="newTitle" placeholder="enter todo title" required/>
        </div>
        <div class="mx-auto mb-2">
          <!-- <label for="newDesc">Desc:</label> -->
          <b-form-input id="newDesc" v-model="newDesc" placeholder="enter todo description"/>
        </div>

        <div class="mx-auto mb-2" v-show="showSetReminder">
          <label for="newDate" class="text-left">Remind me at:</label>
          <b-form-input id="newDate" class="mb-2" v-model="newDate" type="date"/>
          <b-form-input id="newTime" v-model="newTime" type="time"/>
        </div>

        <div class="mb-4">
          <a href="" @click.prevent="showSetReminder = false" v-if="showSetReminder">hide</a>
          <a href="" @click.prevent="showSetReminder = true" v-else>show time setting</a>
        </div>

        <b-button variant="primary" @click="addNewTodo">Submit</b-button>

      </b-form>
      <!-- form -->

      <div id="todo-list" class="mt-3 col-sm-5 offset-sm-2" style="border: 1px solid purple">
        
        <div id="note" v-show="todos.length > 0">
          <small class="text-muted">mark task as complete before delete</small> <br>
          <small class="text-muted">click on task title to mark as complete</small>
        </div>
        
        <b-list-group class="" v-for="todo in todos" :key="todo._id" >

          <b-list-group-item 
            class="col-sm-12 mx-auto mb-2 text-left"
            :class="{ completed: todo.isCompleted }"
            > 

            <div>
              <h5 @click="completeTodo(todo._id)">
                {{ todo.title }} 
                <b-btn 
                  class="float-right" 
                  size="sm" 
                  @click="deleteTodo(todo._id)"
                  v-show="todo.isCompleted"
                  >delete</b-btn>
              </h5>
            </div>

            <small class="text-muted">{{ todo.desc }}</small>

          </b-list-group-item>

        </b-list-group>

      </div>

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
      newDesc: '',
      newDate: '',
      newTime: '',
      showSetReminder: false
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
          self.name = response.data.user.name
          self.todos = response.data.user.todos
          self.todos.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt)
          })
        })
      .catch(err => {
        handlingErr(err)
      })
    },

    addNewTodo () {
      let self = this
      console.log(this.newDate)
      axios({
        url: 'http://localhost:3000/todos/add',
        method: 'post',
        data: {
          title: self.newTitle,
          desc: self.newDesc,
          reminder: {
            date: self.newDate,
            time: self.newTime
          }
        },
        headers: {
          token: localStorage.getItem('token')
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
    },

    deleteTodo (todoId) {
      let self = this
      axios({
        url: `http://localhost:3000/todos/delete?todoId=${todoId}`,
        method: 'delete',
        headers: {
          'token': localStorage.token
        }
      })
      .then(({data}) => {
        console.log('delete todo', data)
        self.getTodos()
      })
      .catch(err => handlingErr(err))
    },

    hide () {

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
    margin: auto;
  }

  .completed {
    text-decoration: line-through;
    text-decoration-color: red;
  }
</style>
