//表头
export const rolesList = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        title: '角色名称',
        align: 'center',
        key: 'names',
        editable: true,
        editRender:0
    },
    {
        title: '状态',
        align: 'center',
        key: 'status',
        editable: true,
        editRender:1
    },
    {
       
        title: '创建人',
        align: 'center',
        key: 'creator'
    },
    {
        
        title: '创建时间',
        align: 'center',
        key: 'createtime'
    }
];

//数据
export const rolesListData = [
    {
         id: 1,
        names: '超级管理员',
        status: '0',
        creator: 'caidan',
        createtime:'2018-01-08'
    },
    {
         id: 2,
        names: '测试人员',
        status: '0',
        creator: 'caidan',
        createtime:'2018-01-08 23:59:59'
    },
    {
        id: 3,
        names: '开发人员',
        status: '1',
        creator: 'caidan',
        createtime:'2018-01-08'
    }
];



const tableData = {
    rolesList: rolesList,
    rolesListData: rolesListData,
    
};

export default tableData;
