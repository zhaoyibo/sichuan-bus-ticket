<template>
  <div class="hello">
    <row type="flex" justify="center" align="middle">
      <i-col :xs="18" :sm="10" :md="10" :lg="8">
        <h1>四川汽车票</h1>
        <h2>订票助手</h2>
        <h3>使用说明</h3>
        <div class="content">
          <p v-for="(val, key) in content" :key="key">
            <row type="flex" justify="start" align="top">
              <i-col :xs="3" :sm="3" :md="2" :lg="2">
                <span v-html="key"></span>
              </i-col>
              <i-col :xs="21" :sm="21" :md="22" :lg="22">
                <span v-html="val"></span>
              </i-col>
            </row>
          </p>
        </div>
        <p class="copyright">
          <a href="https://ideassea.com">Ideas Sea</a> © 2017
        </p>
        <i-button type="ghost" class="btn-go" @click="letsgo">我已清楚明白</i-button>

        <div class="donate">
          <p>您的支持将鼓励我继续创作！</p>
          <i-button type="error" @click="handleBtn">Donate</i-button>
          <div class="qr-code" v-show="qrshow">
            <div class="wechat inline-block">
              <img src="https://ws1.sinaimg.cn/mw690/6e3b2269ly1fjlav4vktkj20go0gowma.jpg" />
              <p>WeChat Pay</p>
            </div>
            <div class="alipay inline-block">
              <img src="https://ws1.sinaimg.cn/mw690/6e3b2269ly1fjlav4w9igj20go0gotgu.jpg" />
              <p>Alipay</p>
            </div>
          </div>
        </div>
      </i-col>
    </row>
  </div>
</template>

<script>
/* eslint-disable space-before-function-paren */
import Util from '../libs/util'
export default {
  name: 'hello',
  data() {
    return {
      qrshow: false,
      isLogin: false,
      content: {
        '- 零 -': '本助手基于<a href="https://www.scqcp.com" target="_blank">四川汽车票务网</a>，只是在其基础上简化了并增加了一些不可描述的功能。',
        '- 壹 -': '由于【零】中所述，本助手需要登录后才能使用，登录的账号和密码要使用四川汽车票务网的，没有的话先去<a href="https://www.scqcp.com/reg/index.html" target="_blank">注册</a>一个吧。',
        '- 贰 -': '本助手的工作流程上有点类似于用于抢火车票的某些软件，使用过程中不要修改密码，否则刷到票后无法锁定车票。',
        '- 叁 -': '所有费用均为四川汽车票务网收取，最后支付也是要去其官网支付的。',
        '- 伍 -': '功能还在完善当中，如果使用中遇到问题请及时反馈。',
        '&nbsp;': '&nbsp;',
        '- 無 -': '本助手系业余之作，博主精力资金有限，目前托管于免费空间。如后期无精力维护，还请谅解。'
      }
    }
  },
  created() {
    let token = localStorage.getItem('token') || ''
    if (token !== '') {
      Util.ajax.get('/user/login', { params: { token: token } })
        .then(resp => {
          // console.log(resp)
          // this.$router.push({ path: '/ticket' })
          this.isLogin = true
        })
        .catch(error => {
          // console.log(error.response.status)
          switch (error.response.status) {
            case 400:
              break
            case 401:
              localStorage.removeItem('token')
              break
            case 500:
              // todo
              break
          }
        })
    }
  },
  methods: {
    letsgo() {
      if (this.isLogin) {
        this.$router.push({ path: '/ticket' })
      } else {
        this.$router.push({ path: '/login' })
      }
    },
    handleBtn() {
      this.qrshow = !this.qrshow
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  text-shadow: 3px 3px 0 rgba(0, 0, 0, .05);
  margin-bottom: 10px;
  line-height: 1.1;
  font-weight: 500;
}

h2, h3 {
  margin-top: 20px;
}

h3 {
  text-align: start;
  margin-bottom: 10px;
}

h1 {
  font-size: 46px;
}

h2 {
  font-size: 28px;
}

.content {
  text-align: start;
}

.inline-block {
  display: inline-block;
}

.btn-go {
  margin-top: 20px;
  padding: 10px 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.copyright {
  text-align: center;
  margin-top: 20px;
}

a {
  color: #42b983;
}

.donate {
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 14px;
}

@media (max-width: 767px) {
  .donate img {
    width: 120px;
    height: 120px;
    margin: 10px 10px 0px;
  }
}

@media (min-width: 767px) {
  h1 {
    margin-top: 20px;
  }
  .donate img {
    width: 150px;
    height: 150px;
    margin: 20px 20px 0px;
  }
}
</style>
