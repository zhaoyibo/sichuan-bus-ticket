<style>
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  padding: 50px 10px;
}

.index .ivu-row-flex {
  height: 100%;
}

.ivu-select-dropdown {
  text-align: start;
}

.ivu-card-extra {
  font-size: 12px !important;
}

h1,
h2 {
  text-shadow: 3px 3px 0 rgba(0, 0, 0, .05);
  margin-bottom: 10px;
  line-height: 1.1;
  font-weight: 500;
}

h2,
h3 {
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
</style>
<template>
  <div class="index">
    <row type="flex" justify="center" align="middle">
      <i-col :xs="18" :sm="10" :md="8" :lg="6">
        <h1>订票助手</h1>
        <h2>{{subTitle}}</h2>
        <div>
          <i-form ref="formInline" :model="formInline" :rules="ruleInline">
            <form-item prop="username">
              <i-input type="text" v-model="formInline.username" placeholder="Username">
                <Icon type="person" slot="prepend"></Icon>
              </i-input>
            </form-item>
            <form-item prop="password">
              <i-input type="password" v-model="formInline.password" placeholder="Password" @on-enter="handleSubmit('formInline')">
                <Icon type="locked" slot="prepend"></Icon>
              </i-input>
            </form-item>
            <form-item v-if="activate" prop="invitation">
              <i-input type="text" v-model="formInline.invitation" placeholder="Invitation code" @on-enter="handleSubmit('formInline')">
                <Icon type="pound" slot="prepend"></Icon>
              </i-input>
            </form-item>
            <form-item>
              <Button type="primary" @click="handleSubmit('formInline')">{{subTitle}}</Button>
            </form-item>
            <form-item v-if="!this.activate">
              <a id="reg" href="https://www.scqcp.com/reg/index.html">没有账号？</a>
            </form-item>
          </i-form>
        </div>
      </i-col>
    </row>
  </div>
</template>
<script>
/* eslint-disable space-before-function-paren */
import Util from '../libs/util'

export default {
  data() {
    return {
      activate: false,
      subTitle: '登陆',
      formInline: {
        username: localStorage.getItem('username'),
        password: '',
        invitation: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        invitation: [
          { required: true, message: '请填写邀请码', trigger: 'blur' },
          { type: 'string', min: 6, message: '邀请码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          Util.ajax.post('/user/login', {
            username: this.formInline.username,
            password: this.formInline.password,
            invitation: this.formInline.invitation
          })
            .then(resp => {
              // console.log(resp)
              localStorage.setItem('token', resp.data)
              localStorage.setItem('username', this.formInline.username)
              this.$Message.success('登陆成功!')
              this.$router.replace({ path: '/ticket' })
            })
            .catch(error => {
              let errMsg
              switch (error.response.status) {
                case 401:
                  errMsg = '登陆失败，请检查用户名和密码!'
                  break
                case 406:
                  errMsg = '请先激活您的账号'
                  this.activate = true
                  this.subTitle = '激活'
                  break
                case 500:
                  errMsg = '服务器 GG 了，请稍后重试'
                  break
              }
              this.$Message.error(errMsg)
              // localStorage.removeItem('username')
            })
        } else {
          let msg = '请检查用户名和密码!'
          if (this.activate) {
            msg = '请检查用户名、密码和邀请码!'
          }
          this.$Message.error(msg)
          // localStorage.removeItem('username')
        }
      })
    }
  }
}
</script>
