<style scoped>
.demo-table-info-cell-age span:before {
    content: "hah" !important;
}

.index {
    text-align: start;
    padding-top: 20px;
}

.welcome {
    padding-bottom: 20px;
    font-size: 20px;
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

.history-card span {
    font-size: 12px;
}

.ivu-spin {
    display: inline-block;
}

@media (min-width:767px) {
    .ivu-form-inline .ivu-form-item {
        width: 31%;
    }
    #fieldset-passengers .ivu-form-item {
        width: 48%;
    }
    .history-card .ivu-card-body p {
        display: inline-block;
        width: 40%;
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
                <div class="welcome">{{formModel.username}}，欢迎使用</div>
                <tabs value="buy-ticket" @on-click="handleHistory">
                    <tab-pane label="开始订票" name="buy-ticket">
                        <i-form ref="formModel" :model="formModel" :rules="ruleValidate" inline>
                            <fieldset>
                                <legend>车票信息{{flights.data.length > 0 ? '（共' + flights.data.length + '个班次）' : ''}}</legend>
                                <form-item label="出发城市" prop="binding.idx1">
                                    <i-select v-model="formModel.binding.idx1" filterable remote clearable @on-change="handleSelect1" :remote-method="ajaxFrom" :loading="binding.loading">
                                        <i-option v-for="(v, k) in fcs" :value="k" :key="v.id+'-'+v.name+'-'+v.pinyin">{{v.name}}</i-option>
                                    </i-select>
                                </form-item>
                                <form-item label="到达城市" prop="binding.idx2">
                                    <i-select v-model="formModel.binding.idx2" filterable remote clearable @on-change="handleSelect2" :remote-method="ajaxTarget" :loading="binding.loading" :disabled="binding.disabled">
                                        <i-option v-for="(v, k) in tcs" :value="k" :key="v.id+'-'+v.name+'-'+v.pinyin">{{v.name}}</i-option>
                                    </i-select>
                                </form-item>
                                <form-item label="选择日期" prop="binding.date">
                                    <date-picker v-model="formModel.binding.date" type="date" placeholder="选择日期" :options="afterToday" @on-change="pickDate"></date-picker>
                                </form-item>

                                <i-table v-show="binding.tableShow" :height="binding.tableHeight" size="small" highlight-row :columns="flights.columns" :data="flights.data" @on-current-change="tableSelect" no-data-text="没有班次"></i-table>
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

                            <fieldset id="fieldset-passengers">
                                <legend>乘客信息 x{{formModel.passengers.length}}</legend>
                                <div>
                                    常用乘客：
                                    <checkbox v-model="checkGroup[index]" v-for="(item, index) in userCommon" :key="item.id" @on-change="handleCheck" :true-value="index + 1" :false-value="-(index + 1)">
                                        <span>{{item.name}}</span>
                                    </checkbox>
                                </div>

                                <form-item v-for="(item, index) in formModel.passengers" :key="item.index" :label="'乘客' + (item.index + 1)" :prop="'passengers.' + item.index">
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
                            <poptip confirm transfer cancel-text="确认" ok-text="取消" @on-cancel="handleReset('formModel')" title="您确认清空所有内容吗？">
                                <i-button type="ghost" style="margin-left: 8px">重置</i-button>
                            </poptip>
                        </div>
                    </tab-pane>
                    <tab-pane label="历史订单" name="order-history">
                        <div v-if="history.length > 0">
                            <div v-for="(item, index) in history" :key="item.objectId">
                                <card :bordered="true" class="history-card">
                                    <p slot="title">
                                        <icon type="android-bus"></icon> {{item.ticket.fromCity.Name}} - {{item.ticket.toCity.Name}}
                                        <icon type="android-time"></icon> {{item.ticket.date}}
                                        <span v-if="item.status == 0" style="color:#2d8cf0;">&nbsp;&nbsp;&nbsp;
                                            <spin></spin>正在抢票</span>
                                        <span v-else-if="item.status == 1" style="color:#19be6b;">&nbsp;&nbsp;&nbsp;
                                            <icon type="checkmark-round"></icon> 已完成</span>
                                        <span v-else style="color:gray;">&nbsp;&nbsp;&nbsp;
                                            <icon type="close-round"></icon> 已取消</span>
                                        <!-- {{item.status == 0 ? "正在抢票中" : item.status == 1 ? "已完成" : "已取消" }} -->
                                        <poptip confirm transfer cancel-text="确认" ok-text="取消" @on-cancel="handleCancel(index, item.objectId)" title="您确认要取消这个抢票任务吗？">
                                            <i-button size="small" v-if="item.status == 0" type="text">取消</i-button>
                                        </poptip>
                                    </p>
                                    <a v-if="item.status != 0" href="javascript:void(0)" slot="extra" @click.prevent="handleDelete(index, item.objectId)">
                                        <icon type="trash-b"></icon>
                                        删除
                                    </a>
                                    <p>
                                        <b>乘车车站：</b>{{item.scheduleInfo.city}} {{item.scheduleInfo.carryStaName}}
                                    </p>
                                    <p>
                                        <b>终点站：</b>{{item.scheduleInfo.endStaName}}
                                    </p>
                                    <p>
                                        <b>发车时间：</b>{{item.scheduleInfo.drvTime}}
                                    </p>
                                    <p>
                                        <b>里程：</b>{{item.scheduleInfo.mile}}
                                    </p>
                                    <p>
                                        <b>班次类型：</b>{{item.scheduleInfo.schTypeName}}
                                    </p>
                                    <p>
                                        <b>车型：</b>{{item.scheduleInfo.busTypeName}}
                                    </p>
                                </card>
                            </div>
                        </div>
                    </tab-pane>
                </tabs>
            </i-col>
        </row>
    </div>
</template>

<script>
import Util from '../libs/util';

export default {
    data() {
        return {
            t: undefined,
            i: undefined,
            binding: {
                loading: false,
                disabled: true,
                tableShow: false,
                tableHeight: "",
            },
            fcs: [{ id: 255, jianpin: "cds", name: "成都市", pinyin: "chengdushi" }],
            tcs: [],
            flights: {
                columns: [{ title: '乘车车站', key: 'CarryStaName' }, { title: '终点站', key: 'EndStaName' }, { title: '发车时间', key: 'DrvTime' }, { title: '里程', key: 'Mile' }, { title: '车型', key: 'BusTypeName' }, { title: '票价', key: 'FullPrice' }],
                data: []
            },
            userCommon: [],
            checkGroup: [],
            relMap: {},
            afterToday: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            formModel: {
                username: localStorage.getItem("username"),
                status: 0,
                // session: localStorage.getItem("jsessionid"),
                binding: {
                    idx1: undefined,
                    idx2: undefined,
                    date: undefined,
                },
                ticket: {
                    fromCity: {},
                    toCity: {},
                    date: '',
                    schId: ''
                },
                contact: {
                    name: "",
                    phone: "",
                    email: ""
                },
                passengers: [{
                    index: 0,
                    name: "",
                    id: ""
                }],
                scheduleInfo: {}
            },
            ruleValidate: {
                "binding.idx1": [{ type: 'number', required: true, message: '请选择出发城市', trigger: 'change' }],
                "binding.idx2": [{ type: 'number', required: true, message: '请选择到达城市', trigger: 'change' }],
                "binding.date": [{ required: true, type: 'date', message: '请选择出发日期', trigger: 'change' }],
                "passengers.0": [{
                    required: true, type: 'object', trigger: 'blur',
                    fields: {
                        name: [
                            { type: 'string', message: '请填写乘客1的姓名', required: true },
                            { type: 'string', min: 2, max: 10, message: '名字长度应在2-10字符之间' }
                        ],
                        id: [
                            { type: 'string', message: '请填写乘客1的身份证号', required: true },
                            { pattern: /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)$/, message: "请填写正确的身份证号" }
                        ]
                    }
                }],
                "contact.name": [
                    { required: true, message: '请填写联系人姓名', trigger: 'blur' },
                    { type: 'string', min: 2, max: 10, message: '名字长度应在2-10字符之间', trigger: 'blur' }
                ],
                "contact.phone": [
                    { required: true, message: '请填写联系人手机号', trigger: 'blur' },
                    { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/, message: '请填写正确的手机号码', trigger: 'blur' }
                ],
                "contact.email": [
                    { required: true, message: '请填写联系人邮件地址', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
            },
            history: []
        }
    },
    created() {
        let session = localStorage.getItem('jsessionid') || ''
        if (session != '') {
            Util.ajax.get("/user/login", { params: { session: session } })
                .then(resp => {
                    // console.log(resp)
                    this.i = setInterval(() => {
                        Util.ajax.get("/user/login", { params: { session: session } })
                            .catch(error => {
                                this.$router.push({ path: "/login" })
                            })
                    }, 60000)
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
                            this.$router.push({ path: "/login" })
                    }
                })

            Util.ajax.get("/ticket/" + this.formModel.username + "/history")
                .then(resp => {
                    this.history = resp.data
                })
                .catch(error => {
                    console.log(error)
                })
            Util.ajax.get("/user/contact", { params: { session: session } })
                .then(resp => {
                    console.log(resp.data)
                    this.formModel.contact = resp.data.contact
                    this.userCommon = resp.data.passengers
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            this.$router.push({ path: "/login" })
        }
    },
    methods: {
        ajaxFrom(query) {
            query = query.trim();
            if (query.length > 0) {
                this.binding.loading = true;
            } else {
                if (this.t) {
                    clearTimeout(this.t)
                }
                this.fcs = []
                this.binding.loading = false;
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
                        this.binding.loading = false;
                        this.tcs = []
                        this.t = undefined
                    })
            }, 500)
        },
        ajaxTarget(query) {
            query = query.trim();
            if (query.length > 0) {
                this.binding.loading = true;
            } else {
                if (this.t) {
                    clearTimeout(this.t)
                }
                this.tcs = []
                this.binding.loading = false;
                this.clear2()
                return
            }
            if (this.t) {
                clearTimeout(this.t)
            }
            this.t = setTimeout(() => {
                let fromCity = this.formModel.ticket.fromCity
                Util.ajax.get("/city", { params: { to: query, id: fromCity.id, from: fromCity.pinyin } })
                    .then(resp => {
                        this.tcs = resp.data;
                        this.binding.loading = false;
                        this.t = undefined

                    })
            }, 500)
        },
        handleSelect1(val) {
            this.binding.disabled = false
            this.formModel.ticket.fromCity = this.fcs[val]
        },
        handleSelect2(val) {
            this.formModel.ticket.toCity = this.tcs[val]
            this.findFlight()
        },
        pickDate(str) {
            if (!str) {
                this.binding.tableShow = false
                this.binding.tableHeight = ''
                this.flights.data = []
                this.formModel.ticket.schId = ""
                this.formModel.scheduleInfo = {}
                return
            }
            this.formModel.ticket.date = str
            this.findFlight(str)
            console.log(this.formModel)
        },
        findFlight(str) {
            str = str || this.formModel.ticket.date
            if (!str) {
                return
            }
            let fromCity = this.formModel.ticket.fromCity, toCity = this.formModel.ticket.toCity
            if (!fromCity || !toCity) {
                console.log("from city or to city is empty")
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
                        let now = new Date()
                        now.setDate(now.getDate() + 1)
                        let date = now.toISOString().substr(0, 10)
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
                    let hasResult = resp.data.Data.length > 0
                    if (hasResult) {
                        let data = resp.data.Data
                        for (let i = 0, len = data.length; i < len; i++) {
                            let x = data[i]
                            if (i === 0) {
                                this.formModel.ticket.schId = x.SchId
                                this.formModel.scheduleInfo = x
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
                        this.binding.tableShow = true
                        if (this.flights.data.length > 3) {
                            this.binding.tableHeight = 175
                        } else {
                            this.binding.tableHeight = ''
                        }
                    }
                    resolve(hasResult)
                })
        }
        ,
        clear1() {
            this.fcs = []
            this.formModel.ticket.fromCity = {}
            // clear target city
            this.formModel.binding.idx2 = ""
            this.clear2()
            this.binding.disabled = true
        },
        clear2() {
            this.tcs = []
            this.formModel.ticket.toCity = {}
            // this.formModel.ticket.date = undefined
            this.binding.tableShow = false
            this.binding.tableHeight = ''
            this.formModel.ticket.schId = ""
            this.formModel.scheduleInfo = {}
        },

        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let data = {
                        task: this.formModel
                    }
                    Util.ajax.post('/ticket', data)
                        .then(resp => {
                            console.log(resp)
                            this.history.unshift(this.formModel)
                        })
                        .catch(error => {
                            switch (error.response.status) {
                                case 403:
                                    this.$Message.error('非法操作!');
                                    localStorage.clear()
                                    this.$router.push({ path: "/login" })
                                    break
                                case 400:
                                    this.$Message.error('请求有误，请刷新重试!');
                                    break
                            }
                        })
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
            let len = this.formModel.passengers.length
            if (len >= 5) {
                this.$Message.error("一次最多添加5位乘客")
                return
            }
            this.$refs["formModel"].validate((valid) => {
                if (!valid) {
                    this.$Message.error("请先完善信息")
                } else {
                    let index = this.formModel.passengers[len - 1].index + 1
                    this.formModel.passengers.push({
                        index: index,
                        name: '',
                        id: ''
                    });
                    let key = 'passengers.' + index

                    this.ruleValidate[key] = [{
                        required: true, type: 'object', trigger: 'blur',
                        fields: {
                            name: [
                                { type: 'string', message: '请填写乘客' + (index + 1) + '的姓名', required: true },
                                { type: 'string', min: 2, max: 10, message: '名字长度应在2-10字符之间' }
                            ],
                            id: [
                                { type: 'string', message: '请填写乘客' + (index + 1) + '的身份证号', required: true },
                                { pattern: /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)$/, message: "请填写正确的身份证号" }
                            ]
                        }
                    }]
                }
            })



        },
        handleRemove(index) {
            if (this.formModel.passengers.length == 1) {
                this.$Message.error("至少需要一个乘客")
                return
            }
            // console.log("remove before", this.relMap)
            let p = this.formModel.passengers[index]
            this.formModel.passengers.splice(index, 1);
            for (let k in this.relMap) {
                if (this.relMap[k] === p.index) {
                    this.checkGroup[k] = 0 - this.checkGroup[k]
                    delete this.relMap[k]
                }
            }
            // console.log("remove after", this.relMap)
        },
        tableSelect(currentRow, oldRow) {
            this.formModel.ticket.schId = currentRow.SchId
            this.formModel.scheduleInfo = currentRow
            // console.log(this.formModel)
        },
        handleHistory(name) {
            if (name == "order-history") {

            }
        },
        handleCancel(index, id) {
            // console.log(id)
            Util.ajax.delete("/ticket/" + id)
                .then(resp => {
                    // console.log(resp.data)
                    this.history[index].status = 2
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleDelete(index, id) {

        },
        handleCheck(index) {
            // console.log(index)
            if (index > 0) {
                let i = index - 1
                let len = this.formModel.passengers.length
                if (len >= 5) {
                    this.$Message.error("一次最多添加5位乘客")
                    return
                }
                let p = this.userCommon[i]
                let id = p.id + ''
                let pi
                if (!this.formModel.passengers[0].name) {
                    let p0 = this.formModel.passengers[0]
                    p0.name = p.name
                    p0.id = id
                    pi = 0
                } else {
                    pi = this.formModel.passengers[len - 1].index + 1
                    let pn = { index: pi, name: p.name, id: id }
                    this.formModel.passengers.push(pn)
                }
                this.relMap[i] = pi
                // console.log("check check", this.relMap, this.formModel.passengers)
            } else {
                let i = (0 - index) - 1
                let pi = this.relMap[i]
                let len = this.formModel.passengers.length
                for (let j in this.formModel.passengers) {
                    if (pi === this.formModel.passengers[j].index) {
                        if (len == 1) {
                            this.formModel.passengers[0].index = 0
                            this.formModel.passengers[0].name = ''
                            this.formModel.passengers[0].id = ''
                        } else {
                            this.formModel.passengers.splice(j, 1);
                        }
                        delete this.relMap[i]
                    }
                }
                // console.log("check uncheck", this.relMap, this.formModel.passengers)
            }
        }
    },
    destroyed() {
        clearTimeout(this.t)
        clearInterval(this.i)
    }
}
</script>
