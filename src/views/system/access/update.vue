<style lang="less">
   .show-edit-btn{
        display: none;
        margin-left: -10px;
    }
    .ivu-table-cell:hover .show-edit-btn{
        display: inline-block;
    }
</style>

<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover></Table>
         <!-- 给角色分配菜单-->
        <Modal
            v-model="chooseMenu"
            id='chooseMenuId'
            title="请选择菜单">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </Modal>
    </div>
   
</template>

<script>
const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : 'primary',
            loading: currentRow.saving
        },
        style: {
            margin: '0 5px'
        },
        on: {
            'click': () => {
                if (!currentRow.editting) {
                    if (currentRow.edittingCell) {
                        for (let name in currentRow.edittingCell) {
                            currentRow.edittingCell[name] = false;
                            vm.edittingStore[index].edittingCell[name] = false;
                        }
                    }
                    vm.edittingStore[index].editting = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                } else {
                    vm.edittingStore[index].saving = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    let edittingRow = vm.edittingStore[index];
                    edittingRow.editting = false;
                    edittingRow.saving = false;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                }
            }
        }
    }, currentRow.editting ? '保存' : '编辑');
};
const deleteButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要删除这条数据吗?',
            transfer: true,
            placement:'top'
        },
        on: {
            'on-ok': () => {
                vm.thisTableData.splice(index, 1);
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '删除')
    ]);
};

const chooseButton = (vm, h, currentRow, index) => {
    return h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'info'
            }
        }, '分配菜单');
};

export default {
    name: 'canEditTable',
    props: {
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: [],
            chooseMenu: false
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.value));
            let res = [];
            res = cloneData.map((item, index) => {
                let isEditting = false;
                if (this.thisTableData[index]) {
                    if (this.thisTableData[index].editting) {
                        isEditting = true;
                    } else {
                        for (const cell in this.thisTableData[index].edittingCell) {
                            if (this.thisTableData[index].edittingCell[cell] === true) {
                                isEditting = true;
                            }
                        }
                    }
                }
                if (isEditting) {
                    return this.thisTableData[index];
                } else {
                    this.$set(item, 'editting', false);
                    let edittingCell = {};
                    editableCell.forEach(item => {
                        edittingCell[item.key] = false;
                    });
                    this.$set(item, 'edittingCell', edittingCell);
                    return item;
                }
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                               
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '22'
                                        }
                                    }, [
                                        !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '2'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                if(item.editRender == 0){
                                    return h('span', currentRow[item.key]);
                                }else if(item.editRender == 1){
                                    const row = param.row;
                                    const color = row.status === '0' ? 'blue' : 'red';
                                    const text = row.status === '0' ? '有效' : '无效';
                                    return h('Tag', {
                                        props: {
                                            type: 'dot',
                                            color: color
                                        }
                                    }, text);
                                }
                            }
                        } else {
                            if(item.editRender == 0){
                                return h('Input', {
                                            props: {
                                                type: 'text',
                                                value: currentRow[item.key]
                                            },
                                            on: {
                                                'on-change' (event) {
                                                    let key = param.column.key;
                                                    vm.edittingStore[param.index][key] = event.target.value;
                                                }
                                            }
                                        });
                            }else if(item.editRender == 1){
                                var status = currentRow[item.key];
                                return h('i-switch', { //数据库1是无效，0是有效 
                                        props: {  
                                            type: 'primary',  
                                            value: status==0?true:false //控制开关的打开或关闭状态，官网文档属性是value  
                                        },  
                                        style: {  
                                            marginRight: '5px'  
                                        },  
                                        on: {  
                                            'on-change': (value) => {//触发事件是on-change,用双引号括起来，  
                                                let key = param.column.key;
                                                if (status == 1) {  
                                                    vm.edittingStore[param.index][key] = 0;
                                                } else {  
                                                    vm.edittingStore[param.index][key] = 1;
                                                }  
                                                //this.switch(param.index) //params.index是拿到table的行序列，可以取到对应的表格值  
                                            }  
                                        }  
                                    });  
                            }
                            
                        }
                    };
                }
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let btnArr = [];
                        item.handle.forEach(function(btnItem){
                            if(btnItem === 'edit'){
                                btnArr.push(editButton(this, h, currentRowData, param.index));
                            }else if(btnItem === 'delete'){
                                btnArr.push(deleteButton(this, h, currentRowData, param.index));
                            }else if(btnItem === 'choose'){
                                btnArr.push(chooseButton(this, h, currentRowData, param.index));
                            }
                        });
                        if(btnArr.length > 0){
                            return h('div', btnArr);
                        }
                    };
                }
            });
        },
        handleBackdata (data) {
            let clonedData = JSON.parse(JSON.stringify(data));
            clonedData.forEach(item => {
                delete item.editting;
                delete item.edittingCell;
                delete item.saving;
            });
            return clonedData;
        }
    },
    watch: {
        value (data) {
            this.init();
        }
    }
};
</script>
