<template>
  <div class="container">
    <div class='chat' @click='sendMessage'>
      <div class='chat-row' v-for='(item, i) in list' :key='i'>
        <div class='chat-username'>
          {{item.username}} :
        </div>
        <div class='chat-message'>
          {{item.content}}
        </div>
      </div>
    </div>
    <div class='my-input'>
      <span>My number: {{username}}</span>
      <b-input @keyup="handleKeyUp" :value="val" placeholder='Write what your plan for this year 😁' class='my-input-box'/>
      <b-button primary class='my-button' @click="sendMessage">SEND</b-button>
    </div>
    <div class="footer">
      <a href="https://github.com/awskrug/serverless-group" target="blank">AWSKRUG Serverless Group Github</a>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
import Sockette from "sockette";

export default {
  props: {
    msg: String
  },
  data() {
    return {
      username: `${Math.floor(Math.random()*300)}`,
      ws: null,
      val: "",
      list: [
        // { username: '486', content: 'Hello world!'},
      ],
    };
  },
  created() {
    this.ws = new Sockette( "wss://272nbu8ric.execute-api.ap-northeast-2.amazonaws.com/dev/",{
      timeout: 5e3,
      maxAttempts: 1,
      onopen: e => console.log("connected:", e),
      onmessage: this.onMessage,
      onreconnect: e => console.log("Reconnecting...", e),
      onmaximum: e => console.log("Stop Attempting!", e),
      onclose: e => console.log("Closed!", e),
      onerror: e => console.log("Error:", e)
    });
  },
  methods: {
    handleKeyUp(e) {
      if(e.keyCode === 13) {
        this.sendMessage();
        return;
      }
      this.val = e.target.value;
    },
    sendMessage() {
      this.ws.json({
        action: "sendMessage",
        name: this.username,
        channelId: "General", 
        content: this.val,
      });
      this.val = "";
    },
    onMessage(e) {
      // console.log('Message received.');
      
      const data = JSON.parse(e.data);
        // {"event":"channel_message","channelId":"General","name":"johndoe","content":"hello world!"}
      const {
        name,
        content,
      } = data;
      if(!name) return;

      this.list = [
        ...this.list,
        {
          username: name,
          content: content,
        }
      ];
      var container = this.$el.querySelector(".chat");
      container.scrollTop = container.scrollHeight;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
$chat-width: 550px;
$chat-height: 550px;
$my-input-width: 550 - 40px;
.chat {
  width: $chat-width;
  height: $chat-height;
  background-color: #F2F2F2;
  margin: auto;
  border-radius: 5%;
  overflow: auto;
  overflow-x: hidden;
}
::v-deep .my-input {
  width: $my-input-width;
  margin:auto;
}
.chat-row {
  width: $chat-width;
  float: left;
  text-align: left;
  margin-left: 20px;
  margin-top: 20px;
  font-size: 1.5rem;
}
.chat-username {
  float: left;
  padding-right: 1.5rem;
  color: chocolate;
}
.chat-message {
  float: left;
}
.footer {
  width: $chat-width;
  margin: auto;
  padding-right: 90px;
}
.my-input-box,.my-button {
  float: left;
}
.my-button {
  position: relative;
  top: -38px;
  left: $chat-width - 90px;
}
</style>
