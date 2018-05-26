<template>
    <Form ref="projectForm" :model="projectForm" :rules="ruleValidate" :label-width="120">
        <FormItem label="项目名称" prop="title">
            <Input v-model="projectForm.title" placeholder="请输入项目名称"/>
        </FormItem>
        <FormItem label="施工总承包单位" prop="constructCorpId">
            <Select v-model="projectForm.constructCorpId" placeholder="请选择施工总承包单位" clearable>
                <Option v-for="item in constructCorps" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
        </FormItem>
        <FormItem label="工程结构" prop="struct">
            <Select v-model="projectForm.struct" placeholder="请选择工程结构" clearable>
                <Option v-for="item in structs" :value="item.value" :key="item.value">{{ item.value }}</Option>
            </Select>
        </FormItem>
        <FormItem label="项目地址" prop="addr">
            <Input v-model="projectForm.addr" placeholder="请输入项目地址"/>
        </FormItem>
        <FormItem label="施工许可证号码" prop="buildLicenceCerNum">
            <Input v-model="projectForm.buildLicenceCerNum" placeholder="请输入施工许可证号码"/>
        </FormItem>
        <FormItem label="建筑面积" prop="buildArea">
            <InputNumber
            style="width:200px;"
            :max="100000000"
            v-model="projectForm.buildArea"
            ></InputNumber>
            <span>㎡</span>
        </FormItem>
        <FormItem label="工程造价" prop="cost">
            <InputNumber
            style="width:200px;"
            :max="100000000000"
            v-model="projectForm.cost"
            ></InputNumber>
            <span>元</span>
        </FormItem>
        <FormItem label="合同金额" prop="contractAmount">
            <InputNumber
            style="width:200px;"
            :max="100000000000"
            v-model="projectForm.contractAmount"
            ></InputNumber>
            <span>元</span>
        </FormItem>
        <FormItem label="开工及竣工日期">
            <Row>
                <Col span="11">
                    <FormItem prop="startDate">
                        <DatePicker type="date" placeholder="请选择开工日期" v-model="projectForm.startDate"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"></Col>
                <Col span="11">
                    <FormItem prop="completeDate">
                        <DatePicker type="date" placeholder="请选择竣工日期" v-model="projectForm.completeDate"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('projectForm')">提交</Button>
            <Button type="ghost" @click="handleReset('projectForm')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
import { query_dic } from '@/api/dictionary.js'
import { query_corp } from '@/api/corp.js'
import { save_project, get_project } from '@/api/project.js'
import Cookies from 'js-cookie'
export default {
    beforeCreate () {
        window.addEventListener("beforeunload", function(event) {
            event.returnValue = "表单内容尚未保存，是否要离开？"
        })
        if (this.$route.params.id) { // 当路由参数中id为undefine,则为添加，否则为修改
            get_project(this.$route.params.id).then(
                res => {
                    console.warn(`res.status=${JSON.stringify(res)}`)
                    this.projectForm = res
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
        }
    },
    created () {
        // 加载施工总工程包单位选择条件
        query_corp({kind: '施工总承包单位', status: '已审核'}).then(
            res => {
                this.constructCorps = res.rows
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
        // 加载项目结构选择条件
        query_dic({key: 'Struct'}).then(
            res => {
                this.structs = res.rows
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
    data () {
        return {
            projectForm: {
                buildCorpId: JSON.parse(Cookies.get('user')).corpId,
                status: '未审核',
                title: '',
                constructCorpId: '',
                addr: '',
                buildLicenceCerNum: '',
                buildArea: 0,
                struct: '',
                cost: 0,
                contractAmount: 0,
                startDate: new Date(),
                completeDate: new Date()
            },
            ruleValidate: {
                title: [
                    { required: true, message: '项目名称不能为空', trigger: 'blur' }
                ],
                constructCorpId: [
                    { required: true, message: '施工总承包单位不能为空', trigger: 'change' }
                ],
                addr: [
                    { required: true, message: '项目地址不能为空', trigger: 'blur' }
                ],
                buildLicenceCerNum: [
                    { required: true, message: '施工许可证号不能为空', trigger: 'blur' }
                ],
                buildArea: [
                    { required: true, type: 'number', message: '建筑面积不能为空', trigger: 'change' }
                ],
                struct: [
                    { required: true, message: '项目结构不能为空', trigger: 'change' }
                ],
                cost: [
                    { required: true, type: 'number', message: '工程造价不能为空', trigger: 'change' }
                ],
                contractAmount: [
                    { required: true, type: 'number', message: '合同金额不能为空', trigger: 'change' }
                ],
                startDate: [
                    { required: true, type: 'date', message: '开工日期不能为空', trigger: 'change' }
                ],
                completeDate: [
                    { required: true, type: 'date', message: '竣工日期不能为空', trigger: 'change' }
                ]
            },
            constructCorps: [], // 存放所有施工总承包单位的数组
            structs: [] // 存放所有建筑结构的数组
        }
    },
    methods: {
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要提交该条项目信息吗？</p>',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            save_project(this.projectForm).then(
                                res => {
                                    this.$Message.success('保存成功')
                                    // this.$router.push({
                                    //     name: 'corp-list'
                                    // })
                                }
                            ).catch(
                                err => {
                                    if (err.response.status === 400) {
                                        this.$Message.error('保存失败， 原因：' + err.response.data.message)
                                    } else {
                                        this.$Message.error('保存失败')
                                        console.error(`err=${JSON.stringify(err)}`)
                                    }
                                }
                            )
                        }
                    })
                } else {
                    this.$Message.warning('验证不通过')
                }
            })
        }
    }
}
</script>
