<style lang="less">
    @import '../styles/css/login.less';
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
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
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
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip"></p>
                </div>
            </Card>
        </div>
    </div>
    
</template>

<script>
import Cookies from 'js-cookie';
import {login} from '../api/api.js';
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
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
                    this.logining = true;
                    var params = {
                        'user':this.form.userName
                    };
                    login(params).then(data => {
                        this.logining = false;
                        let { code, message,  name} = data.data;
                        if(code === 1){
                            Cookies.set('userName', name);
                            Cookies.set('access', 1);//权限
                            Cookies.set('password', "123456");
                            this.$router.push({
                                name: 'home_index'
                            });
                        }else{
                            alert(message);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style>

</style>
