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
      <div class="row" v-if="post.newQuestions">
        <div class="col-md-8">
          <div class="form-group">
            <label>Entities:</label>
            <input type="text" class="form-control" v-model="post.entities">
          </div>
        </div>
      </div><br />
        <!-- <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label>New Questions:</label>
              <input type="text" class="form-control" v-model="post.newQuestions">
          </div>
        </div>
        </div><br /> -->
      <div v-if="post.newQuestions" class="row">
        <div class="col-md-8">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>Paraphased Questions</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="item in post.newQuestions" :key="item._id">
                  <td>{{ item }}</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="!post.newQuestions" class="form-group">
        <button class="btn btn-primary">Paraphase</button>
      </div>
      <div class="btn-toolbar" v-if="post.newQuestions">
        <button class="btn btn-primary mr-1" v-on:click="clearFields(), seeComparison = false">Try New</button>
        <button class="btn btn-primary" v-on:click="seeComparison = true">See Comparison</button>
      </div>
      <br/>
      <div v-if="seeComparison" class="row">
        <div class="col-md-8">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>item </th>
              <th>synonyms </th>
              <th>gloss </th>
            </tr>
            </thead>
            <tbody v-for="(value, propertyName) in post.stats" :key="value._id">
                <tr v-for="value1 in value" :key="value1._id">
                  <td>{{ propertyName }}</td>
                  <td >{{ value1.synonyms }}</td>
                  <td >{{ value1.gloss }}</td>

                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
    export default {
        data(){
        return {
          post:{},
          seeComparison: false
        }
    },
    methods: {
      paraphase(){
        let uri = 'http://localhost:8090/paraphase';
        this.axios.post(uri, this.post).then((response) => {
          this.post = response.data;
        });
      },

      clearFields(){
        this.post = {};
      }
    }
  }
</script>