<template>
  <div>
    <h1>Paraphase Question</h1>
    <form @submit.prevent="paraphase">
      <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label>Please enter a question</label>
            <input type="text" class="form-control" v-model="post.question">
          </div>
        </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="form-group">
              <label>Entities:</label>
              <input type="text" class="form-control" v-model="post.entities">
            </div>
          </div>
        </div><br />
        <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label>New Question:</label>
              <input type="text" class="form-control" v-model="post.newQuestion">
          </div>
        </div>
        </div><br />
        <div class="form-group">
          <button class="btn btn-primary">Submit</button>
        </div>
    </form>
  </div>
</template>

<script>
    export default {
        data(){
        return {
          post:{}
        }
    },
    methods: {
      paraphase(){
        let uri = 'http://localhost:8090/paraphase';
        this.axios.post(uri, this.post).then((response) => {
          this.post = response.data;
        });
      }
    }
  }
</script>