
<template>
    <Modal v-model="tranData.visible" :title="title" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="saveForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="所属劳务队" prop="laborTeamId">
                <Select v-model="saveForm.laborTeamId" placeholder="请选择所属劳务队" clearable>
                    <Option v-for="item in laborTeamList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="姓名" prop="name">
                <Input v-model="saveForm.name" placeholder="请输入劳务人员姓名"/>
            </FormItem>
            <FormItem label="职位" prop="position">
                <Select v-model="saveForm.position" placeholder="请选择职位" clearable>
                    <Option v-for="item in laborPositions" :value="item.value" :key="item.value">{{ item.value }}</Option>
                </Select>
            </FormItem>
            <FormItem label="年龄" prop="age">
                <InputNumber
                style="width:200px;"
                :max="100"
                v-model="saveForm.age"
                ></InputNumber>
            </FormItem>
            <FormItem label="性别" prop="gender">
                <Select v-model="saveForm.gender" placeholder="请选择性别" clearable>
                    <Option v-for="item in genders" :value="item.value" :key="item.value">{{ item.value }}</Option>
                </Select>
            </FormItem>
            <FormItem label="身份证号" prop="idCardNum">
                <Input v-model="saveForm.idCardNum" placeholder="请输入身份证号"/>
            </FormItem>
            <FormItem label="银行卡号" prop="bankCardNum">
                <Input v-model="saveForm.bankCardNum" placeholder="请输入银行卡号"/>
            </FormItem>
            <FormItem label="考勤卡号" prop="attendCardNum">
                <Input v-model="saveForm.attendCardNum" placeholder="请输入考勤卡号"/>
            </FormItem>
            <FormItem label="入职日期" prop="entryDate">
                <DatePicker type="date" v-model="saveForm.entryDate" placeholder="请输入入职日期"></DatePicker>
            </FormItem>
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import {query_laborteam} from '../../api/laborteam.js'
import {save_labor, get_labor}  from '@/api/labor.js'
import Cookies from 'js-cookie'
import { query_dic } from '@/api/dictionary.js'
export default {
    data () {
        return {
            currentCorpId: JSON.parse(Cookies.get('user')).corpId,
            saveForm: { // 保存的form对象
                corpId: '',
                laborTeamId: '',
                name: '',
                position: '',
                age: 0,
                gender: '',
                idCardNum: '',
                bankCardNum: '',
                attendCardNum: '',
                entryDate: new Date()
            },
            
            laborTeamList: [],
            laborPositions: [],
            genders: [{value:'男', label: '男'},{value:'女', label: '女'}],
            ruleValidate: {
                laborTeamId: [
                    { required: true, message: '所属劳务队不能为空', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '劳务人员名字不能为空', trigger: 'blur' }
                ],
                position: [
                    { required: true, message: '劳务人员职位不能为空', trigger: 'blur' }
                ],
                age: [
                    { required: true, type: 'number', message: '年龄不能为空', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '性别不能为空', trigger: 'change' }
                ],
                idCardNum: [
                    { required: true, message: '身份证号不能为空', trigger: 'blur' }
                ],
                bankCardNum: [
                    { required: true, message: '银行卡号不能为空', trigger: 'blur' }
                ],
                attendCardNum: [
                    { required: true, message: '考勤卡号不能为空', trigger: 'blur' }
                ],
                entryDate: [
                    { required: true, type: 'date', message: '入职日期不能为空', trigger: 'change' }
                ]
            },
            modal_loading: true
        }
    },
    props: {
        tranData: {
            type: Object,
            default: () => {
                return {visible: false, edit: false, title: '', id: ''}
            }
        }
    },
    computed: {
        title () {
            return this.tranData.edit ? `修改${this.tranData.title}` : `添加${this.tranData.title}`
        }
    },
    created () {
        this.getLaborteamList()
        this.getlaborPositions()
        // this.getGenders()
    },
    methods: {
        getLaborteamList () {
            console.log(this.currentCorpId)
            query_laborteam({corpId: this.currentCorpId}).then(
                res => {
                    this.laborTeamList = res.rows
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
        getlaborPositions () {
            // 加载职位类型选择条件
            query_dic({key: 'laborPosition'}).then(
                res => {
                    console.log(res.rows)
                    this.laborPositions = res.rows
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
        getGenders () {
            // 加载职位类型选择条件
            query_dic({key: 'gender'}).then(
                res => {
                    console.log(res.rows)
                    this.genders = res.rows
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
        handleSave () {
            console.warn('save')
            this.saveForm.corpId = this.currentCorpId
            console.log('saveForm', this.saveForm)
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    console.warn('验证通过')
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要保存该条记录吗？</p>',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            save_labor(this.saveForm).then(
                                res => {
                                    this.$Message.success('保存成功')
                                    this.$emit('success')
                                    this.tranData.visible = false
                                }
                            ).catch(
                                err => {
                                    if (err.response.status === 400) {
                                        this.$Message.error('保存失败， 原因：' + err.response.data.message)
                                    } else {
                                        this.$Message.error('保存失败')
                                        console.error(`err=${JSON.stringify(err)}`)
                                    }
                                    this.tranData.visible = false
                                }
                            )
                        },
                        onCancel: () => {
                            this.modal_loading = false
                        }
                    })
                } else {
                    this.$Message.warning('验证不通过')
                    console.warn('验证不通过')
                    this.modal_loading = false
                }
            })
        },
        handleCancel () {
            this.$refs['saveForm'].resetFields()
        },
        visibleChange (visible) {
            console.warn(visible?'显示了':'隐藏了')
            if (visible) { // 当模态框显示时
                if (this.tranData.edit) { // 当父组件传来编辑是true时，表明将要修改，则需获取到该编辑对象
                    this.getObjectById()
                }
            } else { // 当模态框关闭时,重置表单
                this.$refs['saveForm'].resetFields()
                this.saveForm = { 
                    corpId: '',
                    laborTeamId: '',
                    name: '',
                    position: '',
                    age: 0,
                    gender: '',
                    idCardNum: '',
                    bankCardNum: '',
                    attendCardNum: '',
                    entryDate: new Date()
            },
                console.warn('重置了')
            }
        },
        getObjectById () { // 通过父组件传来的id,获取到该对象
            get_labor(this.tranData.id).then(
                res => {
                    console.warn(`res=${JSON.stringify(res)}`)
                    console.log(res)
                    this.saveForm = res
                }
            ).catch (
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        }
    }
}
</script>
