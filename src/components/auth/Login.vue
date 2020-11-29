<template>
  <div class="login-form">
      <h2 class="login-heading">Login</h2>
      <form action="#" @submit.prevent="submit">
          <!-- {{form}} -->
          <div class="form-control">
              <label for="email">Username/Email</label>
              <input type="email" name="username" id="username" class="login-input" v-model="form.email" >
          </div>

          <div class="form-control mb-more">
              <label for="email">Password</label>
              <input type="password" name="password" id="password" class="login-input"  v-model="form.password">
          </div>

        <div class="form-control">
            <button type="submit" class="btn-submit"> Login </button>
        </div>


      </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'signin',
    components: {

    },
    //kullanıcı email password alanı, burada sıkıntı var..
    data() {
        return {
            form: {
                email: '',
                password: ''
            }
        }
    },

    //submit olduğunda konsola göster..
    methods: {
        submit (){
            console.log('submitted');
            }
        }
    
    
}
</script>