<style lang="less">
    @import '../../../styles/common.less';
    @import '../../../styles/table.less';
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
                        <span @click="handleSearch('rolesSelectFrom')" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
                        <Button @click="handleCancel('rolesSelectFrom')" type="ghost" >取消</Button>
                    </FormItem>
                </Form>
                <Button type="primary" @click="addRoles = true">添加</Button>
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
import canEditTable from './canEditTable.vue';
import tableData from './table_data.js';
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
            addRoles: false,
        };
    },
    methods: {
        init(){
            this.selectRole = this.initRole = table.selectNames;
        },
        getData () {
            this.rolesList = tableData.rolesList;
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
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        }
    },
    created () {
        this.getData();
    }
};
</script>
