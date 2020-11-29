import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loading: true,
        filter: 'all',
        todos: [],
    },
    getters: {
        remaining(state) {
            return state.todos.filter(todo => !todo.completed).length;
        },
        anyRemaining(state, getters) {
            return getters.remaining != 0;
        },
         todosFiltered(state){
             if (state.filter == 'all') {
                 return state.todos
             } else if(state.filter == 'active') {
                 return state.todos.filter(todo => !todo.completed);
             } else if(state.filter == 'completed') {
                 return state.todos.filter(todo => todo.completed);
             }
  
             return state.todos
         },
         showClearCompletedButton(state){
             return state.todos.filter(todo => todo.completed).length > 0;
         }
    },

    mutations: {
        //ana ekleme fonksiyonu
        addTodo(state, todo) {
            state.todos.push({
                id: todo.id,
                title: todo.title,
                completed: false,
                timestamp: new Date(),
                editing: false,
            })
        },
        //güncelleme fonksiyonu
        updateTodo(state, todo){
            const index = state.todos.findIndex(item => item.id == todo.id)
            state.todos.splice(index, 1, {
                    'id': todo.id,
                    'title': todo.title,
                    'completed': todo.completed,
                    'editing': todo.editing,
            })
        },
        //silme fonksiyonu
        deleteTodo(state, id) {
            const index = state.todos.findIndex(item => item.id == id)
            
            if (index >= 0) {
                 state.todos.splice(index, 1);
            }
        },
        
        checkAll(state, checked) {
          state.todos.forEach(todo => (todo.completed = checked))
        },

        updateFilter(state, filter) {
          state.filter = filter

        },
        clearCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed)
        },
        retrieveTodos(state, todos){
            state.todos = todos
        },
          clearTodos(state) {
            state.todos = []
          },
    },
    actions: {
        //firabaseden çekilen kısım
        initRealtimeListeners(context){
             db.collection("todos").onSnapshot(snapshot => { 
              snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                //console.log("Added", change.doc.data());
                const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                if (source === 'Server') {
                    context.commit('addTodo', {
                    id: change.doc.id,
                    title: change.doc.data().title,
                    completed: false,
                })
              }
            }
            if (change.type === "modified") {
                context.commit('updateTodo', {
                    id: change.doc.id,
                    title: change.doc.data().title,
                    completed: change.doc.data().completed,
                })
            }
            if (change.type === "removed") {
                context.commit('deleteTodo', change.doc.id)
            }
        });
    });
        },
         //firabaseden çekilen kısım
        retrieveTodos(context){
            context.state.loading = true
            db.collection('todos').get()
            .then(querySnapshot => {
                let tempTodos = []
                querySnapshot.forEach(doc => {
                    console.log(doc.data())
                    const data  = {
                        id: doc.id,
                        title: doc.data().title,
                        completed: doc.data().completed,
                        timestamp: doc.data().timestamp,
                    }
                    tempTodos.push(data)
                })

                context.state.loading = false
                const tempTodosSorted = tempTodos.sort((a, b) => {
                    return a.timestamp.seconds - b.timestamp.seconds
                })

                context.commit('retrieveTodos', tempTodosSorted)
            })
        },
         //firabaseye eklenen kısım
        addTodo(context, todo) {
           db.collection('todos').add({
               title: todo.title,
               completed: false,
               timestamp: new Date(),
           })
           .then(docRef => {
               context.commit('addTodo', {
                   id: docRef.id,
                   title: todo.title,
                   completed: false,
               })
            //girilen veriyi alma
            console.log(todo)
            localStorage.setItem('todos', JSON.stringify(todo));
           })
        },
        //db'yi güncelleme
        updateTodo(context, todo){
                db.collection('todos').doc(todo.id).set({
                    id: todo.id,
                    title: todo.title,
                    completed: todo.completed,
                    //timestamp: new Date(),
                }, { merge: true })
                .then(() => {
                    context.commit('updateTodo', todo)
                })
        },
        //db'den silme
        deleteTodo(context, id) {
            db.collection('todos').doc(id).delete()
              .then(() => {
                  context.commit('deleteTodo', id)   
              })  
        },
        
        checkAll(context, checked) {
                db.collection('todos').get()
                .then(querySnapshot => [
                    querySnapshot.forEach(doc => {
                        doc.ref.update({
                            completed: checked
                        })
                        .then(() => {
                            context.commit('checkAll', checked)
                        })
                    })
                ])
        },
        

        updateFilter(context, filter) {
                context.commit('updateFilter', filter)
        },
        clearCompleted(context) {
                db.collection('todos').where('completed', '==', true).get()
                  .then(querySnapshot => {
                      querySnapshot.forEach(doc => {
                          doc.ref.delete()
                          .then(() => {
                              context.commit('clearCompleted')
                          })
                      })
                  })
        }
    }
})