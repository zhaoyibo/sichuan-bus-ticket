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

.index h1 {
    height: 150px;
}

.index h1 img {
    height: 100%;
}

.index h2 {
    color: #666;
    margin-bottom: 200px;
}

.index h2 p {
    margin: 0 0 50px;
}

.index .ivu-row-flex {
    height: 100%;
}

.index h3 {
    color: #666;
    margin-bottom: 20px;
}

.ivu-select-dropdown {
    text-align: start;
}
.ivu-card-extra {
    font-size: 12px !important;
}
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <i-col :xs="18" :sm="10" :md="8" :lg="6">
                <!-- <h1>登录</h1> -->
                <div>
                    <Form ref="formInline" :model="formInline" :rules="ruleInline">
                        <FormItem prop="user">
                            <i-input type="text" v-model="formInline.user" placeholder="Username">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </i-input>
                        </FormItem>
                        <FormItem prop="password">
                            <i-input type="password" v-model="formInline.password" placeholder="Password">
                                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                            </i-input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                        </FormItem>
                        <FormItem>
                            <a id="reg" href="https://www.scqcp.com/reg/index.html">没有账号？</a>
                        </FormItem>
                    </Form>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
import Util from '../libs/util';
export default {
    data() {
        return {
            formInline: {
                user: localStorage.getItem("username"),
                password: ''
            },
            ruleInline: {
                user: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        let session = localStorage.getItem('jsessionid') || ''
        if (session != '') {
            Util.ajax.get("/user/login", { params: { session: session } })
                .then(resp => {
                    console.log(resp)
                    this.$router.push({ path: "/" })
                })
                .catch(error => {
                    // console.log(error.response.status)
                    switch (error.response.status) {
                        case 400:
                            break;
                        case 401:
                            localStorage.removeItem('jsessionid')
                            break;
                        case 500:
                            //todo
                            break;
                    }
                })
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    Util.ajax.post("/user/login", { username: this.formInline.user, password: this.formInline.password })
                        .then(resp => {
                            console.log(resp)
                            localStorage.setItem("jsessionid", resp.data)
                            localStorage.setItem("username", this.formInline.user)
                            this.$Message.success('登陆成功!');
                            this.$router.push({ path: "/" })
                        })
                        .catch(error => {
                            let errMsg
                            switch (error.response.status) {
                                case 401:
                                    errMsg = "登陆失败，请检查用户名和密码!"
                                    break;
                                case 500:
                                    errMsg = "服务器 GG 了，请稍后重试"
                                    break;
                            }
                            this.$Message.error(errMsg);
                            localStorage.removeItem("username")
                        })
                } else {
                    this.$Message.error('请检查用户名和密码!');
                    localStorage.removeItem("username")
                }
            });
        }
    }
};
</script>
