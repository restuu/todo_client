<template>
  <div class="list container">

    <h3 class="mt-3"> Welcome {{ name }} </h3>

    <div class="row">

      <b-form class="mt-3 col-sm-5">

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

        <div class="mx-auto mb-2" v-show="showSetLoc">
          <label for="location" class="text-left">Where :</label>
          <b-form-input id="location" list="loc-list" class="mb-2" v-model.lazy="location"/>
          <datalist id="loc-list">
            <option v-for="city in cities" :key="city.id" :value="city.name"></option>
          </datalist>
        </div>

        <div class="mb-4">
          <a href="" @click.prevent="showSetLoc = false" v-if="showSetLoc">hide</a>
          <a href="" @click.prevent="showSetLoc = true" v-else>show loc setting</a>
        </div>

        <b-button variant="success" @click="addNewTodo">Submit</b-button>

      </b-form>
      <!-- form -->

      <div id="todo-list" class="mt-3 col-sm-5 offset-sm-2">

        <div class="d-flex justify-content-center">
          <p v-if="todos.length === 0"> You don't have any todo list yet </p>
        </div>

        <div>
          <div id="note" v-show="todos.length > 0">
            <small class="text-muted">mark task as complete before delete</small> <br>
            <small class="text-muted">click on task title to mark as complete</small>
          </div>
          
          <b-list-group class="" v-for="todo in todos" :key="todo._id" >

            <b-list-group-item 
              class="col-sm-12 mx-auto mb-2 text-left pr-0"
              :class="{ completed: todo.isCompleted }"
              > 

              <div>
                <h5 @click="completeTodo(todo._id)">
                  {{ todo.title }} 
                  <b-btn 
                    class="float-right mr-4" 
                    size="sm" 
                    @click="deleteTodo(todo._id)"
                    v-show="todo.isCompleted"
                    >delete</b-btn>
                </h5>
              </div>

              <div class="row">
                <small v-show="todo.desc" class="text-muted col-12">{{ todo.desc }}</small>
                <date-time :date="todo.remindAt.date" :time="todo.remindAt.time" class="col-12"/>
                <loc-and-weather :city="todo.locAndWeather.city" :weathers="todo.locAndWeather.list" class="col-12"/>
              </div>

            </b-list-group-item>

          </b-list-group>

        </div>
        
      </div>

    </div>


  </div>
</template>

<script>
import axios from 'axios'
import DateTime from './DateTime.vue'
import cities from '@/assets/json/city.list.json'
import LocAndWeather from './LocAndWeather.vue'

let handlingErr = function (err) {
  if (err.response) {
    console.log(err.response.data)
    console.log(err.response.status)
    console.log(err.response.headers)
  } else if (err.request) {
    console.log(err.request)
  } else {
    console.log(err.message)
  }
}

export default {
  components: {
    DateTime,
    LocAndWeather
  },

  data () {
    return {
      name: '',
      todos: [],
      newTitle: '',
      newDesc: '',
      newDate: '',
      newTime: '',
      showSetReminder: false,
      reminder: '',
      showSetLoc: false,
      cities: [],
      location: ''
    }
  },

  computed: {
    getCityId () {
      let city = this.cities.filter(city => city.name === this.location)
      if (city[0]) {
        return city[0].id
      }
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
      console.log(this.location)
      axios({
        url: 'http://localhost:3000/todos/add',
        method: 'post',
        data: {
          title: self.newTitle,
          desc: self.newDesc,
          reminder: {
            date: self.newDate,
            time: self.newTime
          },
          locId: self.getCityId
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          console.log(response.data)
          self.newTitle = ''
          self.newDesc = ''
          self.newDate = ''
          self.newTime = ''
          self.location = ''
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

    },

    fetchIdCities () {
      let self = this
      axios({
        url: `http://localhost:3000/cities`,
        method: 'get'
      })
      .then(({ data }) => {
        console.log(data)
        self.cities = data.cities
        console.log(self.cities)
      })
      .catch(err => handlingErr(err))
    }
  },

  created () {
    this.getTodos()
    this.fetchIdCities()
  }
}
</script>


<style lang="scss" scoped>

  .list {
    max-width: 50rem;
    margin: auto;
  }

  .completed {
    text-decoration: line-through;
    text-decoration-color: red;
  }

  .list-group-item.completed:hover {
    z-index: 1;
    text-decoration: line-through;
    text-decoration-color: red
  }
</style>
