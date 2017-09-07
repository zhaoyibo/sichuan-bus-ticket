<style scoped>
    .index h1 {
        height: 60px;
    }

    .index h3 {
        color: #666;
        margin-bottom: 20px;
    }
    .ivu-select-dropdown{
        text-align: start;
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
    export default {
        data() {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请填写密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('请检查用户名和密码!');
                    }
                });
            }
        }
    };
</script>
