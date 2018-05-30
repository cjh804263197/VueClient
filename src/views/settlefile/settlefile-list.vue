<template>
    <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="filename">
                    <Input style="width: 250px;" type="text" v-model="filter.filename" icon="search" clearable placeholder="通过文件名称检索"/>
                </FormItem>
                <FormItem prop="kind">
                    <Select v-model="filter.kind" placeholder="结算文件类型筛选" clearable style="width: 200px;">
                        <Option v-for="item in kinds" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search-strong" @click="handleQuery()">查询</Button>
                    <Button type="primary" icon="ios-box" @click="handleCreate()">生成结算文件</Button>
                    <Button type="primary" icon="ios-cloud-upload" @click="handleUpload()">上传结算报告</Button>
                </FormItem>
            </Form>
        </Row>

        <Row class="searchable-table-con1">
            <!-- 一个带斑马纹和加载状态的Table -->
            <Table stripe :loading="loading" :columns="columns" :data="datas"></Table>
            <!-- 分页控件 -->
            <Page style="float: right;" :transfer="true" :current.sync="currentPage" :page-size="limit" :total="total" @on-change="currentPageChange" show-total></Page>
        </Row>

        <settlefile-create :tranData="tranData"></settlefile-create>
    </div>
</template>

<script>
import baseUrl from '@/api/url.js'
import { query_dic } from '@/api/dictionary.js'
import { query_settlefile } from '@/api/settlefile.js'
import Vue from 'vue'
import Cookies from 'js-cookie'
import settlefileCreate from './settlefile-create'
export default {
    components: {
        'settlefile-create': settlefileCreate
    },
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            filter: {
                filename: '',
                kind: ''
            },
            tranData: {
                visible: false
            },
            kinds: [],
            datas: [], // 存放查询结果数据
            total: 0, // 查询总记录数
            currentPage: 1, // 当前页
            limit: 10, // 页大小
            columns: [
                {
                    title: '文件名称',
                    key: 'filename'
                },
                {
                    title: '文件类型',
                    key: 'kind'
                },
                {
                    title: '上传时间',
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
                    width: 150,
                    render: (h, params) => {
                        return h('Button', { props: {
                                type: 'success',
                                size: 'small',
                                icon: 'ios-cloud-download'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.handleDownLoad(params.row.url)
                                }
                            }
                            }, '下载')
                    }
                }
            ]
        }
    },
    created () {
        // 加载各查询条件的数据源
        this.getFileKinds()
        this.handleQuery()
    },
    methods: {
        getFileKinds () { // 获取工资状态数组
            query_dic({key: 'SettleFileKind'}).then(
                res => {
                    this.kinds = res.rows
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
        currentPageChange (value) { // 当前页改变事件
            this.handleQuery(value)
        },
        handleDownLoad (url) {
            window.open(baseUrl + url)
        },
        handleCreate () {
            this.tranData.visible = true
        },
        handleUpload () {

        },
        handleQuery (current = 1) { // 处理查询事件
            this.currentPage = current
            this.loading = true
            let param = {
                'like%filename': this.filter.filename,
                kind: this.filter.kind
            }
            query_settlefile(param).then(res => {
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
