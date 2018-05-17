<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <RadioGroup v-model="loginRole">
                                <Radio label="监管用户"></Radio>
                                <Radio label="企业用户"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                            <Button @click="handleTest" type="primary" long>ceshi</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">请选择对应的角色进行登录</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import {corp_user_login} from '@/api/login'
import {get_corp} from '@/api/corp'
export default {
    data () {
        return {
            form: {
                username: '',
                password: ''
            },
            loginRole: '监管用户',
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // Cookies.set('user', this.form.userName);
                    // Cookies.set('password', this.form.password);
                    // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    // if (this.form.userName === 'iview_admin') {
                    //     Cookies.set('access', 0);
                    // } else {
                    //     Cookies.set('access', 1);
                    // }
                    // this.$router.push({
                    //     name: 'home_index'
                    // });
                    console.log('进来了111')
                    corp_user_login(this.form.username, this.form.password).then(
                        res => {
                            console.warn(`res.status=${JSON.stringify(res)}`)
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
            });
        },
        handleTest () {
            get_corp('431a2d4c-3efa-471c-ad60-866e1708505b').then(
                res => {
                    console.warn(`res.status=${JSON.stringify(res)}`)
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
    }
};
</script>

<style>

</style>
