<style scoped>
.index {
    text-align: start;
}

.form-btns {
    margin-top: 20px;
    text-align: center;
}

.ivu-date-picker {
    width: 100%;
}

fieldset {
    border: 0;
    padding: 10px;
    margin-bottom: 10px;
    background: #EEE;
    /* border-radius: 8px;
    background: -webkit-linear-gradient(top, #EEE, #FFF);
    background: -moz-linear-gradient(top, #EEE, #FFF); */
}

legend {
    padding: 5px 10px;
    background-color: #4F709F;
    color: #FFF;
    /* border-radius: 3px; */
}

@media (min-width:767px) {
    .ivu-form-inline .ivu-form-item {
        width: 31%;
    }
    #fieldset-users .ivu-form-item {
        width: 48%;
    }
}

@media (max-width:767px) {
    .ivu-form-inline .ivu-form-item {
        width: 100%;
    }
}
</style>

<template>
    <div class="index">
        <row type="flex" justify="center" align="top">
            <i-col :xs="22" :sm="20" :md="14" :lg="14">
                <tabs value="buy-ticket">
                    <tab-pane label="开始抢票" name="buy-ticket">
                        <i-form ref="formDynamic" :model="formDynamic" :rules="ruleValidate" inline>
                            <fieldset>
                                <legend>车票信息</legend>
                                <form-item label="出发城市" prop="ticket.idx1">
                                    <i-select v-model="formDynamic.ticket.idx1" filterable remote clearable @on-change="handleSelect1" :remote-method="ajaxFrom" :loading="loading">
                                        <i-option v-for="(v, k) in fcs" :value="k" :key="v.id+'-'+v.name+'-'+v.pinyin">{{v.name}}</i-option>
                                    </i-select>
                                </form-item>
                                <form-item label="到达城市" prop="ticket.idx2">
                                    <i-select v-model="formDynamic.ticket.idx2" filterable remote clearable @on-change="handleSelect2" :remote-method="ajaxTarget" :loading="loading" :disabled="disabled">
                                        <i-option v-for="(v, k) in tcs" :value="k" :key="v.id+'-'+v.name+'-'+v.pinyin">{{v.name}}</i-option>
                                    </i-select>
                                </form-item>
                                <form-item label="选择日期" prop="ticket.date">
                                    <date-picker v-model="formDynamic.ticket.date" type="date" placeholder="选择日期" :options="afterToday" @on-change="pickDate"></date-picker>
                                </form-item>
                            </fieldset>

                            <fieldset>
                                <legend>联系人信息</legend>
                                <form-item label="姓名" prop="contact.name">
                                    <i-input v-model="formDynamic.contact.name" type="text"></i-input>
                                </form-item>
                                <form-item label="手机号" prop="contact.phone">
                                    <i-input v-model="formDynamic.contact.phone" type="text"></i-input>
                                </form-item>
                                <form-item label="邮箱" prop="contact.email">
                                    <i-input v-model="formDynamic.contact.email" type="text"></i-input>
                                </form-item>
                            </fieldset>

                            <fieldset id="fieldset-users">
                                <legend>乘客信息</legend>
                                <form-item v-for="(item, index) in formDynamic.users" :key="item.index" :label="'乘客' + (item.index + 1)" :prop="'users.' + item.index">
                                    <i-button size="small" class="trash-btn" type="ghost" @click="handleRemove(index)" icon="trash-a"></i-button>
                                    <row>
                                        <i-col :xs="24" :md="8">
                                            <i-input type="text" v-model="item.name" placeholder="姓名"></i-input>
                                        </i-col>
                                        <i-col :xs="24" :md="{span: 16, offset: 0}">
                                            <i-input type="text" v-model="item.id" placeholder="身份证号"></i-input>
                                        </i-col>
                                        <!-- <i-col :xs="2" :md="{span: 2, offset: 1}">
                                                                                            <i-button class="trash-btn" type="ghost" @click="handleRemove(index)" icon="trash-a"></i-button>
                                                                                        </i-col> -->
                                    </row>
                                </form-item>
                                <i-button type="dashed" long @click="handleAdd" icon="plus-round">新增乘客</i-button>
                            </fieldset>
                        </i-form>

                        <div class="form-btns">
                            <i-button type="primary" @click="handleSubmit('formDynamic')">提交</i-button>
                            <i-button type="ghost" @click="handleReset('formDynamic')" style="margin-left: 8px">重置</i-button>
                        </div>
                    </tab-pane>
                    <TabPane label="历史订单" name="order-history">
                        <p>敬请期待</p>
                    </TabPane>
                </tabs>
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            ok1: false,
            ok2: false,
            loading: false,
            disabled: true,
            fcs: [],
            tcs: [],
            afterToday: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            formDynamic: {
                ticket: {
                    idx1: "",
                    idx2: "",
                    date: ""
                },
                contact: {
                    name: "",
                    phone: "",
                    email: ""
                },
                users: [{
                    index: 0,
                    name: "",
                    id: ""
                }]
            },
            ruleValidate: {
                "ticket.idx1": [{ type: 'number', required: true, message: '请选择出发城市', trigger: 'change' }],
                "ticket.idx2": [{ type: 'number', required: true, message: '请选择到达城市', trigger: 'change' }],
                "ticket.date": [{ required: true, type: 'date', message: '请选择出发日期', trigger: 'change' }],
                "users.0": [{
                    required: true, type: 'object',
                    fields: {
                        name: { type: 'string', message: '请完善乘客1的信息', required: true },
                        id: { type: 'string', message: '请完善乘客1的信息', required: true }
                    }
                }],
                "contact.name": [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
                "contact.phone": [{ required: true, message: '请输入联系人手机号', trigger: 'blur' }],
                "contact.email": [{ required: true, message: '请输入联系人邮件地址', trigger: 'blur' }],
            }
        }
    },
    methods: {
        ajaxFrom(query) {
            if (this.ok1) {
                return
            }
            var fc = query.trim();
            if (fc.length > 0) {
                this.loading = true;
                var url = "http://127.0.0.1:18087/city";
                axios.get(url, { params: { f: query } })
                    .then(resp => {
                        this.fcs = resp.data;
                    })
                setTimeout(() => {
                    this.loading = false;
                }, 1000)
                this.tcs = []
            } else {
                this.fcs = []
                this.loading = false;
            }
        },
        ajaxTarget(query) {
            if (!this.ok2) {
                query = query.trim();
                if (query.length > 0) {
                    this.loading = true;
                    var url = "http://127.0.0.1:18087/city";
                    var fromCity = this.fcs[this.formDynamic.ticket.idx1]
                    axios.get(url, { params: { t: query, i: fromCity.id, f: fromCity.pinyin } })
                        .then(resp => {
                            this.tcs = resp.data;
                        })
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000)
                } else {
                    this.tcs = []
                    this.loading = false;
                }
            }
        },
        handleSelect1(val) {
            var idx = parseInt(val)
            if (!isNaN(idx)) {
                this.ok1 = true
                this.disabled = false
            } else {
                this.clear1()
            }
        },
        handleSelect2(val) {
            var idx = parseInt(val)
            if (!isNaN(idx)) {
                this.ok2 = true
            } else {
                this.clear2()
            }
        },
        pickDate(date) {
            // this.formDynamic.ticket.date = date
            console.log(this.formDynamic)
        },
        clear1() {
            this.ok1 = false
            this.fcs = []
            // clear target city
            this.formDynamic.ticket.idx2 = ""
            this.clear2()
            this.disabled = true
        },
        clear2() {
            this.ok2 = false
            this.tcs = []
        },

        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        handleAdd() {
            var len = this.formDynamic.users.length
            var index = this.formDynamic.users[len - 1].index + 1
            this.formDynamic.users.push({
                index: index,
                name: '',
                id: ''
            });
            var key = 'users.' + index
            this.ruleValidate[key] = [{
                required: true, type: 'object',
                fields: {
                    name: { type: 'string', message: '请完善乘客' + (index + 1) + '的信息', required: true },
                    id: { type: 'string', message: '请完善乘客' + (index + 1) + '的信息', required: true }
                }
            }]
        },
        handleRemove(index) {
            if (this.formDynamic.users.length == 1) {
                this.$Message.error("至少需要一个乘客")
                return
            }
            this.formDynamic.users.splice(index, 1);
        }
    }
}
</script>
