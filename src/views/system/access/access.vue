<style lang="less">
    @import '../../../styles/css/common.less';
    @import '../../../styles/css/table.less';
</style>

<template>
    <Col span="24">
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                角色列表
            </p>
            <Row>
                <Form ref="rolesSelectFrom" :model="rolesSelectFrom" inline style="float:right;">
                    <FormItem prop="names">
                        <Input type="text" v-model="rolesSelectFrom.names" placeholder="请输入角色名称">
                        </Input>
                    </FormItem>
                    <FormItem prop="status">
                        <Select style="width:90px"  v-model="rolesSelectFrom.status">
                            <Option v-for="item in roleStateList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <span @click="handleSearch('rolesSelectFrom')" style="margin: 0 10px;"><Button type="primary" icon="search" :disabled="lookMenuList.queryRoles">查询</Button></span>
                        <Button @click="handleCancel('rolesSelectFrom')" type="ghost" :disabled="lookMenuList.cancelRoles">取消</Button>
                    </FormItem>
                </Form>
                <Button type="primary" @click="addRoles = true" :disabled="lookMenuList.addRoles">添加</Button>
            </Row>
            <Row>
                <div class="edittable-table-height-con">
                    <can-edit-table refs="roleTable" v-model="rolesListData" :columns-list="rolesList"></can-edit-table>
                </div>
            </Row>
            <Row>
                <Page :total="100" show-sizer show-elevator show-total style="float:right;"></Page>
            </Row>
        </Card>
        <!-- 添加角色 -->
        <Modal
            title="添加角色"
            v-model="addRoles"
            :mask-closable="false"
            class-name="vertical-center-modal">
            <Form ref="addRolesFormValidate" :model="addRolesFormValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="角色名称" prop="names">
                    <Input v-model="addRolesFormValidate.names" placeholder="请输入角色名称"></Input>
                </FormItem>
                <FormItem label="状态" prop="status" >
                    <Select v-model="addRolesFormValidate.status">
                       <Option v-for="item in roleStateList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('addRolesFormValidate')">保存</Button>
                    <Button type="ghost" @click="handleReset('addRolesFormValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
            <div slot="footer">
                
            </div>
        </Modal>
    </Col>
    
</template>

<script>
import canEditTable from './update.vue';
import tableData from './table_data.js';
import {addRoles,lookMenu} from '../../../api/api.js';
export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    data () {
        return {
            rolesSelectFrom: {
                names: '',
                status: '0'
            },
            lookMenuList:{
                addRoles:true,
                queryRoles:true,
                editRoles:true,
                deleteRoles:true,
                cancelRoles:true
            },
            addRolesFormValidate: {
                names: '',
                status: '0'
            },
            ruleValidate: {
                names: [
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ]
            },
            rolesList: [],
            rolesListData: [],
            selectNames: '',
            roleStateList: [{value: '0',name: '有效'}, {value: '1', name: '无效'}],
            showCurrentTableData: false,
            addRoles: false
        };
    },
    methods: {
        init(){
            this.selectRole = this.initRole = table.selectNames;
        },
        getHeader(lookMenuList){
            let handelTitle = [];
            if(!handelTitle.editRoles){
                handelTitle.push('edit');
            }
            if(!handelTitle.deleteRoles){
                handelTitle.push('delete');
            }
            handelTitle.push('choose');
            let header = {
                title: '操作',
                align: 'center',
                key: 'handle',
                handle: handelTitle
            }
            this.rolesList = tableData.rolesList;
            this.rolesList.push(header);
        },
        getData () {
            this.rolesListData = tableData.rolesListData;
        },
        handleNetConnect (state) {
            this.breakConnect = state;
        },
        handleLowSpeed (state) {
            this.lowNetSpeed = state;
        },
        getCurrentData () {
            this.showCurrentTableData = true;
        },
        handleDel (val, index) {
            this.$Message.success('删除了第' + (index + 1) + '行数据');
        },
        handleCellChange (val, index, key) {
            this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
        },
        handleChange (val, index) {
            this.$Message.success('修改了第' + (index + 1) + '行数据');
        },
        handleSearch (name) {
            this.rolesListData = this.rolesList;
            this.rolesListData = this.search(this.rolesListData, {names: this.selectNames});
        },
        handleCancel (name) {
            this.$refs[name].resetFields();
        },
        lookBtn(){
            this.logining = true; 
            var params = {
                name : 'access'
            };
            lookMenu(params).then(data => {
                this.logining = false;
                let { msg, code, lookMenu } = data.data;
                let lookList = {};
                lookMenu.forEach(function(item){
                    let name = item.name;
                    if(item.access == 1){
                        lookList[name] = false;
                    }else{
                        lookList[name] = true;
                    }
                });
                this.lookMenuList = lookList;
                this.getHeader(this.lookMenuList);
                this.getData();
            });
            
        },
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }
            return res;
        },
        handleSubmit (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.logining = true; 
                    var params = {
                        names : this.$refs[formName].model.names,
                        status : this.$refs[formName].model.status
                    };
                    addRoles(params).then(data => {
                        this.logining = false;
                        let { msg, code, user } = data;
                    });
                } else {
                    this.$Message.error('参数填写错误!');
                }
            })
        },
        handleReset (formName) {
            this.$refs[formName].resetFields();
        }
    },
    created () {
        this.lookBtn();
    }
};
</script>
