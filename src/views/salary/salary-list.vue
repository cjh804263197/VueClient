<template>
    <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="yearAndMonth">
                    <DatePicker type="month" v-model="filter.yearAndMonth" format="yyyy-MM" @on-change="yearMonthChange" placeholder="年月筛选" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem prop="project">
                    <Select v-model="filter.projectId" clearable placeholder="项目筛选" style="width: 200px;">
                        <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="laborCorp">
                    <Select v-model="filter.laborCorpId" :clearable="laborCorpClearable" @on-change="laborCorpChange" placeholder="劳务公司筛选" style="width: 200px;">
                        <Option v-for="item in laborCorps" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="laborTeam">
                    <Select v-model="filter.laborTeamId" placeholder="劳务队筛选" clearable style="width: 200px;">
                        <Option v-for="item in laborTeams" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="filter.status" placeholder="工资状态筛选" clearable style="width: 120px;">
                        <Option v-for="item in salaryStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search-strong" @click="handleQuery()">查询</Button>
                </FormItem>
            </Form>
        </Row>

        <Row class="searchable-table-con1">
            <!-- 一个带斑马纹和加载状态的Table -->
            <Table stripe :loading="loading" :columns="columns" :data="datas"></Table>
            <!-- 分页控件 -->
            <Page style="float: right;" :transfer="true" :current.sync="currentPage" :page-size="limit" :total="total" @on-change="currentPageChange" show-total></Page>
        </Row>
        
        <salary-edit :tranData="tranData" @success="handleQuery"></salary-edit>
    </div>
</template>

<script>
import { query_project_laborteam } from '@/api/project.js'
import { query_laborteam } from '@/api/laborteam.js'
import { query_corp } from '@/api/corp.js'
import { query_salary, save_salary } from '@/api/salary.js'
import { query_dic } from '@/api/dictionary.js'
import Vue from 'vue'
import Cookies from 'js-cookie'
import salaryEdit from './salary-edit'
export default {
    components: {
        'salary-edit': salaryEdit
    },
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            filter: {
                yearAndMonth: '',
                projectId: '',
                laborCorpId: JSON.parse(Cookies.get('user')).position === '劳务公司经理' || JSON.parse(Cookies.get('user')).position === '劳资员' ? JSON.parse(Cookies.get('user')).corpId : '' ,
                laborTeamId: '',
                status: ''
            },
            tranData: {
                visible: false,
                id: ''
            },
            projects: [],
            laborCorps: [],
            laborTeams: [],
            salaryStatus: [],
            datas: [], // 存放查询结果数据
            total: 0, // 查询总记录数
            currentPage: 1, // 当前页
            limit: 10, // 页大小
            columns: [
                {
                    title: '项目名称',
                    key: 'Project',
                    render: (h, params) => {
                        return h('div', params.row.Project.title)
                    }
                },
                {
                    title: '劳务队',
                    key: 'LaborTeam',
                    render: (h, params) => {
                        return h('div', params.row.LaborTeam.title)
                    }
                },
                {
                    title: '劳务人员',
                    key: 'Labor',
                    render: (h, params) => {
                        return h('div', params.row.Labor.name)
                    }
                },
                {
                    title: '年月',
                    key: 'yearMonth',
                    render: (h, params) => {
                        return h('div', `${params.row.year}-${params.row.month}`)
                    }
                },
                {
                    title: '应出勤天数',
                    key: 'standardAttendDay'
                },
                {
                    title: '实出勤天数',
                    key: 'actualAttendDay'
                },
                {
                    title: '工资',
                    key: 'money'
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                    title: '添加时间',
                    key: 'createdAt',
                    render: (h, params) => {
                        return h('div', Vue.filter('timefmt')(params.row.createdAt))
                    }
                },
                {
                    title: '修改时间',
                    key: 'updatedAt',
                    render: (h, params) => {
                        return h('div', Vue.filter('timefmt')(params.row.updatedAt))
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 180,
                    render: (h, params) => {
                        if (params.row.status === '未审核' && this.loginUser.position === '劳资员') { // 若为待审核状态
                            return h('div', [
                                h('Button', { props: {
                                    type: 'success',
                                    size: 'small',
                                    icon: 'ios-checkmark'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleAudit(params.row.id)
                                    }
                                }
                                }, '审核'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small',
                                        icon: 'ios-compose'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEdit(params.row.id)
                                        }
                                    }
                                }, '修改')
                            ])
                        } else { // 其他人员什么都不能做
                            return h('div')
                        }
                    }
                }
            ]
        }
    },
    computed: {
        laborCorpClearable () {
            return this.loginUser.position === '监管人员'
        }
    },
    created () {
        // 加载各查询条件的数据源
        this.getProjects()
        this.getLaborCorps()
        this.getLaborTeams()
        this.getSalaryStatus()
        this.handleQuery()
    },
    methods: {
        getProjects () { // 获取可选项目的数组
            let param = {}
            if (this.loginUser.position === '劳务公司经理' || this.loginUser.position === '劳资员') {
                param = {...param, laborCorpId: this.loginUser.corpId}
            }
            query_project_laborteam(param).then(
                res => {
                    let pros = res.rows.map(item => {
                        return item.Project
                    })
                    this.projects = []
                    // 去重算法
                    pros.forEach(pro => {
                        // 在每次push之前先判断this.projects中是都存在相同id的对象,若存在则不放入，反之则放入
                        let haveRepeat = this.projects.some(item => {
                            return item.id === pro.id
                        })

                        if (!haveRepeat) { this.projects.push(pro) }
                    })
                }
            ).catch(
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        getLaborCorps () { // 获取可选劳务公司的数组
            let param = { status: '已审核', kind: '劳务公司' }
            if (this.loginUser.position === '劳务公司经理' || this.loginUser.position === '劳资员') {
                param = {...param, id: this.loginUser.corpId}
            }
            query_corp(param).then(
                res => {
                    this.laborCorps = res.rows
                }
            ).catch(
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        getLaborTeams (laborCorpId = this.filter.laborCorpId) { // 获取可选劳务队的数组
            query_laborteam({corpId: laborCorpId}).then(
                res => {
                    this.laborTeams = res.rows
                }
            ).catch(
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        getSalaryStatus () { // 获取工资状态数组
            query_dic({key: 'SalaryStatus'}).then(
                res => {
                    this.salaryStatus = res.rows
                }
            ).catch(
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        yearMonthChange (value) { // 年月值改变事件
            this.filter.yearAndMonth = value
        },
        laborCorpChange (value) { // 劳务公司改变事件
            this.getLaborTeams(value)
        },
        currentPageChange (value) { // 当前页改变事件
            this.handleQuery(value)
        },
        handleAudit (id) { // 处理审核按钮事件
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要审核该工资吗？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    save_salary({id, status: '已审核'}).then(
                        res => {
                            this.$Message.success('审核成功')
                            this.handleQuery()
                        }
                    ).catch(
                        err => {
                            if (err.response.status === 400) {
                                this.$Message.error('审核失败， 原因：' + err.response.data.message)
                            } else {
                                this.$Message.error('审核失败')
                                console.error(`err=${JSON.stringify(err)}`)
                            }
                        }
                    )
                }
            })
        },
        handleEdit (id) { // 处理编辑按钮点击事件
            console.warn('进来了')
            this.tranData.visible = true
            this.tranData.id = id
        },
        handleQuery (current = 1) { // 处理查询事件
            this.currentPage = current
            this.loading = true
            let param = {
                projectId: this.filter.projectId, 
                'LaborTeam.corpId': this.filter.laborCorpId, 
                laborTeamId: this.filter.laborTeamId,
                status: this.filter.status
            }
            if (this.filter.yearAndMonth !== '') {
                let yms = this.filter.yearAndMonth.split('-')
                param = {...param, year: parseInt(yms[0]), month: parseInt(yms[1])}
            }
            query_salary(param).then(res => {
                this.loading = false
                this.total = res.count
                this.datas = res.rows
            }).catch(err => {
                if (err.response.status === 400) {
                    this.$Message.error(err.response.data.message)
                } else {
                    console.error(`err=${JSON.stringify(err)}`)
                }
            })
        }
    }
}
</script>
