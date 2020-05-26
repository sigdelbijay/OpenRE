<template>
  <div>
    <h1>Paraphase Question</h1>
    <div class="row">
      <div class="col-md-8">
        <form @submit.prevent="paraphase">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label>Please enter a paragraph</label>
                <textarea class="form-control" rows=5 v-model="post.paragraph"></textarea>
              </div>
            </div>
          </div>
          <div class="row" v-if="!post.finalResult">
            <div class="col-md-12">
              <div class="form-group">
                <label>Please enter array of questions from paragraph</label>
                <textarea class="form-control" v-model="post.questionArr"></textarea>
              </div>
            </div>
          </div>
          <div v-if="!post.finalResult" class="form-group">
            <button class="btn btn-primary">Paraphase</button>
          </div>
        </form>

        <div class="row col-md-12 btn-toolbar" v-if="post.finalResult">
          <button class="btn btn-success mr-1" style="margin" v-on:click= "newParaphase()">New Paraphase</button>
          <div v-for="(item, index) in post.finalResult" :key="index">
            <button class="btn btn-primary mr-1 " style="margin" v-on:click= "updateIndex(index)">Question{{index+1}}</button>
          </div>
        </div>
        <br>
        <div class="row" v-if="post.finalResult ">
          <div class="col-md-12">
            <div class="form-group">
              <h6 class="visible-md"><span class="badge badge-secondary">Question:</span>{{post.finalResult[index].question}}</h6>
            </div>
          </div>
        </div>

        <div class="row" v-if="post.finalResult">
          <div class="col-md-12">
            <div class="form-group">
              <h6><span class="badge badge-secondary">Entities: </span>{{post.finalResult[index].entities}}</h6>
            </div>
          </div>
        </div>

        <div class="row" v-if="post.finalResult">
          <div class="col-md-12">
            <div class="form-group">
              <span class="badge badge-secondary">New Questions:</span>
              <div v-for="item in post.finalResult[index].newQuestions" :key="item._id">
                <h6 class="visible-md">{{item}}</h6>
              </div>
            </div>
          </div>
        </div>

        <div class="row" v-if="post.finalResult">
          <div class="col-md-12">
            <span class="badge badge-secondary">Comparison Table</span>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>entity </th>
                <th>synonyms </th>
                <th>gloss </th>
              </tr>
              </thead>
              <tbody>
                  <tr v-for="item in post.finalResult[index].stats" :key="item._id">
                    <td>{{ item.entity }}</td>
                    <td>{{ item.synonyms }}</td>
                    <td>{{ item.gloss }}</td>

                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div  class="col-md-1"></div>
      <div class="col-md-3">
        <div class="row ">
          <label>Enter SQUAD 2.0 JSON</label>
          <textarea class = "col-md-12" rows=5 v-model="json.old"></textarea>
        </div>
        <br>
        <div class="row">
          <button class="col-md-12 btn btn-success" v-on:click= "createNewJSON()">Create new JSON file</button>
        </div>
        OR
        <br>
        <div class="row">
          <button class="col-md-12 btn btn-success" v-on:click= "downloadJSON()">Download paraphased JSON file</button>
        </div>
      </div>
    </div>
    



        <!-- <div class="row">
        <div class="col-md-8">
          <div class="form-group">
            <label>New Questions:</label>
              <input type="text" class="form-control" v-model="post.newQuestions">
          </div>
        </div>
        </div><br /> -->
      <!-- <div v-if="post.newQuestions" class="row">
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
      </div> -->
      <!-- <div v-if="!post.newQuestions" class="form-group">
        <button class="btn btn-primary">Paraphase</button>
      </div> -->
      <!-- <div class="btn-toolbar" v-if="post.newQuestions">
        <button class="btn btn-primary mr-1" v-on:click="clearFields(), seeComparison = false">Try New</button>
        <button class="btn btn-primary btn-sm" v-on:click="seeComparison = true">See Comparison</button>
      </div>
      <br/>
      <div v-if="seeComparison" class="row">
        <div class="col-md-8">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>entity </th>
              <th>synonyms </th>
              <th>gloss </th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="item in post.stats" :key="item._id">
                  <td>{{ item.entity }}</td>
                  <td>{{ item.synonyms }}</td>
                  <td>{{ item.gloss }}</td>

                </tr>
            </tbody>
          </table>
        </div>
      </div> -->
  </div>
</template>

<script>
  export default {
    data(){
      return {
        post:{},
        json:{},
        // seeComparison: false,
        index: 0

      }
    },
    methods: {
      paraphase(){
        let uri = 'http://localhost:8090/paraphase';
        this.axios.post(uri, this.post).then((response) => {
          console.log("new post", response.data);
          this.post = response.data;
          console.log("paragraph", response.data.paragraph);
          console.log("finalresult", response.data.finalResult);

        });
      },

      updateIndex(index){
        this.index = index;
      },
      createNewJSON() {
        var uri = 'http://localhost:8090/createNewJson';
        var config = {
          responseType: 'blob'
        };
        console.log("data to be ")
        this.axios.post(uri, this.json, config).then((response) => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement('a');

          fileLink.href = fileURL;
          fileLink.setAttribute('download', 'paraphased-dev-v2.0.json');
          document.body.appendChild(fileLink);

          fileLink.click();
        });

        // this.axios({
        //   url: 'http://localhost:8090/dwnldfile',
        //   method: 'POST',
        //   responseType: 'blob',
        // }).then((response) => {
        //   var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        //   var fileLink = document.createElement('a');

        //   fileLink.href = fileURL;
        //   fileLink.setAttribute('download', 'paraphased-dev-v2.0.json');
        //   document.body.appendChild(fileLink);

        //   fileLink.click();
        // });
      },
      downloadJSON() {
        this.axios({
          url: 'http://localhost:8090/dwnldfile',
          method: 'POST',
          responseType: 'blob',
        }).then((response) => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement('a');

          fileLink.href = fileURL;
          fileLink.setAttribute('download', 'paraphased-dev-v2.0.json');
          document.body.appendChild(fileLink);

          fileLink.click();
        });
      },
      newParaphase() {
        this.post = {};
      }
    }
  }
</script>