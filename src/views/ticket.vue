<style scoped>
.demo-table-info-cell-age span:before {
    content: "hah" !important;
}

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
            <i-col :xs="22" :sm="20" :md="15" :lg="15">
                <tabs value="buy-ticket">
                    <tab-pane label="开始抢票" name="buy-ticket">
                        <i-form ref="formModel" :model="formModel" :rules="ruleValidate" inline>
                            <fieldset>
                                <legend>车票信息{{flights.data.length > 0 ? '（共' + flights.data.length + '个班次）' : ''}}</legend>
                                <form-item label="出发城市" prop="ticket.idx1">
                                    <i-select v-model="formModel.ticket.idx1" filterable remote clearable @on-change="handleSelect1" :remote-method="ajaxFrom" :loading="loading">
                                        <i-option v-for="(v, k) in fcs" :value="k" :key="v.id+'-'+v.name+'-'+v.pinyin">{{v.name}}</i-option>
                                    </i-select>
                                </form-item>
                                <form-item label="到达城市" prop="ticket.idx2">
                                    <i-select v-model="formModel.ticket.idx2" filterable remote clearable @on-change="handleSelect2" :remote-method="ajaxTarget" :loading="loading" :disabled="disabled">
                                        <i-option v-for="(v, k) in tcs" :value="k" :key="v.id+'-'+v.name+'-'+v.pinyin">{{v.name}}</i-option>
                                    </i-select>
                                </form-item>
                                <form-item label="选择日期" prop="ticket.date">
                                    <date-picker v-model="formModel.ticket.date" type="date" placeholder="选择日期" :options="afterToday" @on-change="pickDate"></date-picker>
                                </form-item>

                                <i-table v-show="tableshow" :height="tableheight" size="small" highlight-row :columns="flights.columns" :data="flights.data" @on-current-change="tablechange" no-data-text="没有班次"></i-table>
                            </fieldset>

                            <fieldset>
                                <legend>联系人信息</legend>
                                <form-item label="姓名" prop="contact.name">
                                    <i-input v-model="formModel.contact.name" type="text"></i-input>
                                </form-item>
                                <form-item label="手机号" prop="contact.phone">
                                    <i-input v-model="formModel.contact.phone" type="text"></i-input>
                                </form-item>
                                <form-item label="邮箱" prop="contact.email">
                                    <i-input v-model="formModel.contact.email" type="text"></i-input>
                                </form-item>
                            </fieldset>

                            <fieldset id="fieldset-users">
                                <legend>乘客信息 x{{formModel.users.length}}</legend>
                                <form-item v-for="(item, index) in formModel.users" :key="item.index" :label="'乘客' + (item.index + 1)" :prop="'users.' + item.index">
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
                                <i-button type="ghost" style="display: block;" @click="handleAdd" icon="plus-round">新增乘客</i-button>
                            </fieldset>
                        </i-form>

                        <div class="form-btns">
                            <i-button type="primary" @click="handleSubmit('formModel')">提交</i-button>
                            <i-button type="ghost" @click="handleReset('formModel')" style="margin-left: 8px">重置</i-button>
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
import Util from '../libs/util';

export default {
    data() {
        return {
            t: undefined,
            loading: false,
            disabled: true,
            tableshow: false,
            tableheight: "",
            ok: false,
            fcs: [{ id: 255, jianpin: "cds", name: "成都市", pinyin: "chengdushi" }],
            tcs: [],
            flights: {
                columns: [{ title: '乘车车站', key: 'CarryStaName' }, { title: '终点站', key: 'EndStaName' }, { title: '发车时间', key: 'DrvTime' }, { title: '里程', key: 'Mile' }, { title: '车型', key: 'BusTypeName' }, { title: '票价', key: 'FullPrice' }],
                data: []
            },
            afterToday: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            formModel: {
                ticket: {
                    idx1: "",
                    idx2: "",
                    date: '',
                    schId: '',
                    dateStr: ''
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
            query = query.trim();
            if (query.length > 0) {
                this.loading = true;
            } else {
                if (this.t) {
                    clearTimeout(this.t)
                }
                this.fcs = []
                this.loading = false;
                this.clear1()
                return
            }
            if (this.t) {
                clearTimeout(this.t)
            }
            this.t = setTimeout(() => {
                Util.ajax.get("/city", { params: { from: query } })
                    .then(resp => {
                        this.fcs = resp.data;
                        this.loading = false;
                        this.tcs = []
                        this.t = undefined
                    })
            }, 500)
        },
        ajaxTarget(query) {
            query = query.trim();
            if (query.length > 0) {
                this.loading = true;
            } else {
                if (this.t) {
                    clearTimeout(this.t)
                }
                this.tcs = []
                this.loading = false;
                this.clear2()
                return
            }
            if (this.t) {
                clearTimeout(this.t)
            }
            this.t = setTimeout(() => {
                var fromCity = this.fcs[this.formModel.ticket.idx1]
                Util.ajax.get("/city", { params: { to: query, id: fromCity.id, from: fromCity.pinyin } })
                    .then(resp => {
                        this.tcs = resp.data;
                        this.loading = false;
                        this.t = undefined

                    })
            }, 500)
        },
        handleSelect1(val) {
            this.disabled = false
        },
        handleSelect2(val) {
            this.findFlight()
        },
        pickDate(str) {
            if (!str) {
                this.tableshow = false
                this.tableheight = ''
                this.formModel.ticket.schId = ''
                this.flights.data = []
                return
            }
            this.formModel.ticket.dateStr = str
            this.findFlight(str)
        },
        findFlight(str) {
            str = str || this.formModel.ticket.dateStr
            if (!str) {
                return
            }
            var fromCity = this.fcs[this.formModel.ticket.idx1], toCity = this.tcs[this.formModel.ticket.idx2]
            if (!fromCity || !toCity) {
                return
            }

            let _this = this
            let prefun = function() {
                return new Promise(function(resolve, reject) {
                    _this.doFindFlight(fromCity.name, fromCity.id, toCity.name, str, resolve)
                })
            }

            let nextfun = function(prevalue) {
                return new Promise(function(resolve, reject) {
                    if (!prevalue) {
                        var now = new Date()
                        now.setDate(now.getDate() + 1)
                        var date = now.toISOString().substr(0, 10)
                        _this.doFindFlight(fromCity.name, fromCity.id, toCity.name, date, resolve)
                        _this.$Message.warning({
                            title: '提醒',
                            content: '所查日期（' + str + '）没有班次信息，拉取明天（' + date + '）的班次信息作为参考',
                            duration: 10,
                            closable: true
                        });
                        if (_this.flights.columns.length == 7) {
                            _this.flights.columns.splice(6, 1)
                        }
                    } else {
                        if (_this.flights.columns.length == 6) {
                            _this.flights.columns.push({ title: '余票', key: 'SAmount' })
                        }
                    }
                })
            }

            prefun().then((value) => {
                nextfun(value)
            }).catch()

        },
        doFindFlight(fname, fid, tname, date, resolve) {
            Util.ajax("/ticket/flight", { params: { to: tname, id: fid, from: fname, date: date } })
                .then(resp => {
                    var hasResult = resp.data.Data.length > 0
                    if (hasResult) {
                        var data = resp.data.Data
                        for (var i = 0, len = data.length; i < len; i++) {
                            var x = data[i]
                            if (i === 0) {
                                this.formModel.ticket.schId = x.SchId
                                x._highlight = true
                            }
                            x.DrvTime = x.DrvDateTime.substr(11, 5)

                            if (x.SchTypeName != "固定班") {
                                if (x.SchTypeName == "流水班") {
                                    x.DrvTime = x.DrvTime + "前"
                                } else {
                                    x.DrvTime = x.DrvTime + x.SchTypeName.substr(0, 2)
                                }
                            }
                        }
                        this.flights.data = resp.data.Data
                        this.tableshow = true
                        if (this.flights.data.length > 3) {
                            this.tableheight = 175
                        } else {
                            this.tableheight = ''
                        }
                    }
                    resolve(hasResult)
                })
        }
        ,
        clear1() {
            this.fcs = []
            // clear target city
            this.formModel.ticket.idx2 = ""
            this.clear2()
            this.disabled = true
        },
        clear2() {
            this.tcs = []
            // this.formModel.ticket.date = undefined
            this.formModel.ticket.schId = ''
            this.tableshow = false
            this.tableheight = ''
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
            var len = this.formModel.users.length
            var index = this.formModel.users[len - 1].index + 1
            this.formModel.users.push({
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
            if (this.formModel.users.length == 1) {
                this.$Message.error("至少需要一个乘客")
                return
            }
            this.formModel.users.splice(index, 1);
        },
        tablechange(currentRow, oldRow) {
            this.formModel.ticket.schId = currentRow.SchId
        }
    }
}
</script>
