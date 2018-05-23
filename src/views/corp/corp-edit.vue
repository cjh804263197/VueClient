<template>
    <Form ref="corpForm" :model="corpForm" :rules="ruleValidate" :label-width="120">
        <FormItem label="企业类型" prop="kind">
            <Select v-model="corpForm.kind" placeholder="请选择企业类型" clearable>
                <Option v-for="item in corpKinds" :value="item.value" :key="item.value">{{ item.value }}</Option>
            </Select>
        </FormItem>
        <FormItem label="企业名称" prop="title">
            <Input v-model="corpForm.title" placeholder="请输入企业名称"/>
        </FormItem>
        <FormItem label="注册地址" prop="registerAddr">
            <Input v-model="corpForm.registerAddr" placeholder="请输入企业注册地址"/>
        </FormItem>
        <FormItem label="办公地址" prop="officeAddr">
            <Input v-model="corpForm.officeAddr" placeholder="请输入企业办公地址"/>
        </FormItem>
        <FormItem label="营业执照号码" prop="businessLicenceNum">
            <Input v-model="corpForm.businessLicenceNum" placeholder="请输入营业执照号码"/>
        </FormItem>
        <FormItem label="营业执照照片" prop="businessLicenceImg">
            <select-img :id="'businessLicenceImg'" :max="1" :uploadedList="typeof(corpForm.businessLicenceImg)=='string'?['http://192.168.0.103:8090/'+corpForm.businessLicenceImg]:[]" @file-list-change="(list) => {corpForm.businessLicenceImg=list.length===0?null:list[0].file}"></select-img>
        </FormItem>
        <FormItem label="资质类型及号码">
            <Row>
                <Col span="8">
                    <FormItem prop="aptitudeKind">
                        <Select v-model="corpForm.aptitudeKind" placeholder="请选择资质类型" clearable>
                            <Option v-for="item in aptitudeKinds" :value="item.value" :key="item.value">{{ item.value }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"></Col>
                <Col span="14">
                    <FormItem prop="aptitudeCerNum">
                        <Input v-model="corpForm.aptitudeCerNum" placeholder="请输入资质证号码"/>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="资质证书照片" prop="aptitudeCerImg">
            <select-img :id="'aptitudeCerImg'" :max="1" :uploadedList="typeof(corpForm.aptitudeCerImg)=='string'?['http://192.168.0.103:8090/'+corpForm.aptitudeCerImg]:[]" @file-list-change="(list) => {corpForm.aptitudeCerImg=list.length===0?null:list[0].file}"></select-img>
        </FormItem>
        <FormItem label="安全许可证号" prop="safetyCerNum">
            <Input v-model="corpForm.safetyCerNum" placeholder="请输入安全许可证号"/>
        </FormItem>
        <FormItem label="安全许可证照片" prop="safetyCerImg">
            <select-img :id="'safetyCerImg'" :max="1" :uploadedList="typeof(corpForm.safetyCerImg)=='string'?['http://192.168.0.103:8090/'+corpForm.safetyCerImg]:[]" @file-list-change="(list) => {corpForm.safetyCerImg=list.length===0?null:list[0].file}"></select-img>
        </FormItem>
        <FormItem label="批准及生效日期">
            <Row>
                <Col span="11">
                    <FormItem prop="approveDate">
                        <DatePicker type="date" placeholder="请选择批准日期" v-model="corpForm.approveDate"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"></Col>
                <Col span="11">
                    <FormItem prop="effectiveDate">
                        <DatePicker type="date" placeholder="请选择生效日期" v-model="corpForm.effectiveDate"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="法人姓名及电话">
            <Row>
                <Col span="11">
                    <FormItem prop="corporater">
                        <Input v-model="corpForm.corporater" placeholder="请输入法人姓名"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"></Col>
                <Col span="11">
                    <FormItem prop="corporateTel">
                        <Input v-model="corpForm.corporateTel" placeholder="请输入法人电话"/>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="联系人姓名及电话">
            <Row>
                <Col span="11">
                    <FormItem prop="contactor">
                        <Input v-model="corpForm.contactor" placeholder="请输入公司联系人姓名"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"></Col>
                <Col span="11">
                    <FormItem prop="contactTel">
                        <Input v-model="corpForm.contactTel" placeholder="请输入公司联系人电话"/>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="企业邮箱" prop="email">
            <Input v-model="corpForm.email" placeholder="请输入企业邮箱"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('corpForm')">Submit</Button>
            <Button type="ghost" @click="handleReset('corpForm')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>

<script>
import selectImg from './components/select-img'
import { query_dic } from '@/api/dictionary.js'
import { save_corp, get_corp } from '../../api/corp.js'
export default {
    components: {
        selectImg
    },
    beforeCreate () {
        get_corp('6e3dff89-6288-406b-856b-12582bbfa1f0').then(
            res => {
                console.warn(`res.status=${JSON.stringify(res)}`)
                this.corpForm = res
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
    created () {
        // 加载企业类型选择条件
        query_dic({key: 'CorpKind'}).then(
            res => {
                this.corpKinds = res.rows
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
        // 加载资质类型选择条件
        query_dic({key: 'AptitudeKind'}).then(
            res => {
                this.aptitudeKinds = res.rows
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
            corpForm: {
                status: '未审核',
                kind: '',
                title: '',
                registerAddr: '',
                officeAddr: '',
                businessLicenceNum: '',
                aptitudeKind: '',
                aptitudeCerNum: '',
                safetyCerNum: '',
                approveDate: new Date(),
                effectiveDate: new Date(),
                corporater: '',
                corporateTel: '',
                contactor: '',
                contactTel: '',
                email: '',
                businessLicenceImg: null,
                aptitudeCerImg: null,
                safetyCerImg: null
            },
            ruleValidate: {
                kind: [
                    { required: true, message: '企业类型不能为空', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '企业名称不能为空', trigger: 'blur' }
                ],
                registerAddr: [
                    { required: true, message: '注册地址不能为空', trigger: 'blur' }
                ],
                officeAddr: [
                    { required: true, message: '办公地址不能为空', trigger: 'blur' }
                ],
                businessLicenceNum: [
                    { required: true, message: '营业执照号不能为空', trigger: 'blur' }
                ],
                aptitudeKind: [
                    { required: true, message: '资质类别不能为空', trigger: 'change' }
                ],
                aptitudeCerNum: [
                    { required: true, message: '资质证号不能为空', trigger: 'blur' }
                ],
                safetyCerNum: [
                    { required: true, message: '安全证号不能为空', trigger: 'blur' }
                ],
                approveDate: [
                    { required: true, type: 'date', message: '批准日期不能为空', trigger: 'change' }
                ],
                effectiveDate: [
                    { required: true, type: 'date', message: '生效日期不能为空', trigger: 'change' }
                ],
                corporater: [
                    { required: true, message: '法人姓名不能为空', trigger: 'blur' }
                ],
                corporateTel: [
                    { required: true, message: '法人电话不能为空', trigger: 'blur' }
                ],
                contactor: [
                    { required: true, message: '联系人姓名不能为空', trigger: 'blur' }
                ],
                contactTel: [
                    { required: true, message: '联系人电话不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '企业邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
                ]
            },
            corpKinds: [],
            aptitudeKinds: []
        }
    },
    methods: {
        fileChange (list) {
            list.forEach(item => {
                console.warn(`filename:${item.file.name}`)
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要保存该条企业信息吗？</p>',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            save_corp(this.corpForm).then(
                                res => {
                                    this.$Message.success('保存成功')
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
