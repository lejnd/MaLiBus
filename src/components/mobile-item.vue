<template>
<div class='mobile-item'>
    <div class="header">
        <h3>[{{index+1}}] {{item.phone}}</h3>
        <span>{{item.thirdparty_status}}</span>
    </div>
    <p class="row">执行辅助时间：{{item.assist_Time}}</p>
    <p class="row">注册有效期：{{item.register_Time}}</p>
    <div class="btn-wp">
        <van-button class="btn" size="small" v-if="item.status == 0 && item.api_count == 0" type="primary" :loading="processAssistLoading" @click="processAssist">执行辅助</van-button>
        <van-button class="btn" size="small" type="danger" @click="setTaskDeleted" :loading="setTaskDeletedLoading">删除数据</van-button>
        <van-button class="btn" size="small" v-if="item.status == 1" @click="setTaskRegisted" :loading="setTaskRegistedLoading" :disabled="item.is_register">{{item.is_register ? '已注册' : '未注册'}}</van-button>
    </div>
</div>
</template>

<script>

export default {
    name: 'MobileItem',
    components: {},
    props: {
        index: {
            type: Number,
            default: () => 0,
        },
        item: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            processAssistLoading: false,
            setTaskDeletedLoading: false,
            setTaskRegistedLoading: false,
        };
    },
    methods: {
        getColor(status) {
            switch (status) {
                case 0:
                    return '#1989fa'
                    break;
                case 1:
                    return '#07c160'
                    break;
                case 6:
                    return '#f40'
                    break;
                default:
                    break;
            }
        },
        processAssist() {
            this.processAssistLoading = true;
            this.$fly.post(`/api/TelAssist/ProcessAssist?taskId=${this.item.task_id}`)
            .then((res) => {
                this.processAssistLoading = false;
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                    this.$emit('replay')                   
                } else {
                    this.$notify(returnMsg)
                }
            })
        },
        setTaskDeleted() {
            this.setTaskDeletedLoading = true;
            this.$fly.get(`/api/TelAssist/SetTaskDeleted?taskId=${this.item.task_id}`)
            .then((res) => {
                this.setTaskDeletedLoading = false;
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                    this.$emit('replay')                   
                } else {
                    this.$notify(returnMsg)
                }
            })
        },
        setTaskRegisted() {
            this.setTaskRegistedLoading = true;
            this.$fly.get(`/api/TelAssist/SetTaskRegisted?taskId=${this.item.task_id}`)
            .then((res) => {
                this.setTaskRegistedLoading = false;
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                    this.$emit('replay')
                } else {
                    this.$notify(returnMsg)
                }
            })
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.mobile-item {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 5px;
    border-radius: 6px;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h3 {
            color: #545454;
            font-size: 14/11rem;
            font-weight: 700;
        }
        span {
            font-size: 13/11rem;
            color: #1989fa;
        }
    }
    p.row {
        color: #808080;
        font-size: 12/11rem;
    }
    .btn-wp {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
        .btn {
            margin: 0 5px;
        }
    }
}
</style>