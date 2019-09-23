<template>
<div class="bill-item">
    <div class="item-top">
        <h3 class="id">订单号：<span>{{item.task_id}}</span></h3>
        <span class="overtime" v-if="item.task_status == 1">{{overtime}}</span>
    </div>
    <p class="deco">
        <span>手机号：{{item.tel}}</span>
        <span>{{item.create_time}}</span>
    </p>
    <div class="flex-box">
        <div class="info">
            单价：<span class="value">¥{{item.price}}</span> （{{item.province_name}}）
        </div>
        <span class="status">{{item.task_status_des}}</span>
    </div>
    <div class="remark">备注：<span>{{item.remark || '无备注'}}</span></div>
    <div class="btn-group" v-if="item.task_status == 1">
        <!-- <van-button type="info" size="small" :disabled="disable" @click="setTaskStatus(2)">辅助失败</van-button> -->
        <van-button type="info" size="small" @click="setTaskStatus(2)">辅助失败</van-button>
        <van-button type="primary" size="small" @click="setTaskStatus(1)">辅助成功</van-button>
    </div>
</div>
</template>

<script>
import { clearInterval } from 'timers';

export default {
    name: '',
    components: {},
    props: {
        item: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            overtime: '',
            // disable: true, 
            timer: -1,  // 倒计时轮询
            timer2: -1,    // 自动成功轮询     
        };
    },
    methods: {
        getOvertime(creatTime, min) {
            let date = new Date();
            let nTime = date.getTime();
            let cTime = new Date(creatTime).getTime();
            let timing = min * 60 * 1000; // 定时
            let result = nTime - cTime;   // 当前时间 - 创建时间
            // console.log(result, timing);
            return result > timing;
        },

        setOvertime() {
            this.timer = setInterval(() => {
                let date = new Date();
                let nTime = date.getTime();
                let cTime = new Date(this.item.create_time).getTime();
                let timing = 10 * 60 * 1000; // 10分钟定时
                let result = timing - (nTime - cTime);   // 10分钟 - (当前时间 - 创建时间)
                console.log(this.item.task_id, result);
                this.overtime = this.formatSeconds(result);
                if (result <= 0) {
                    this.overtime = '超时'
                    window.clearInterval(this.timer)
                }
            }, 1000);
        },


        // setDisable() {
        //     if (this.item.task_status != 1) return;
        //     if (this.getOvertime(this.item.create_time, 5)) {
        //         this.disable = false;
        //     } else {
        //         this.timer = setInterval(() => {
        //             if (this.getOvertime(this.item.create_time, 5)) {
        //                 this.disable = false;
        //                 clearInterval(this.timer);
        //             }
        //         }, 5000)
        //     }
        // },
        autoSuccess() {
            if (this.item.task_status != 1) return;
            this.timer2 = setInterval(() => {
                if (this.getOvertime(this.item.create_time, 10)) {
                    window.clearInterval(this.timer2);
                    this.setTaskStatus(1);
                }
            }, 5000)
        },
        setTaskStatus(taskResult) {
            this.$fly.post('/api/CompanyOption/SetTaskStatus', {
                appId: localStorage.getItem('appid'),
                tel: this.item.tel,
                taskId: this.item.task_id,
                taskResult: taskResult
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$emit('replay')
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        // 时间戳格式化为00:00
        formatSeconds(mss) {
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = parseInt((mss % (1000 * 60)) / 1000);
            hours = hours < 10 ? ('0' + hours) : hours;
            minutes = minutes < 10 ? ('0' + minutes) : minutes;
            seconds = seconds < 10 && seconds >= 0 ? ('0' + seconds) : seconds;
            return  minutes + " : " + seconds;
        }
    },
    mounted() {
        this.setOvertime();
        this.autoSuccess();
    },
}
</script>

<style lang='less'>
.bill-item {
    padding: 15px 15px 15px 15px;
    border-radius: 6px;
    box-shadow: 0 0 8px #eee;
    background-color: #fff;
    margin-bottom: 10px;
    .flex-box {
        display: flex;
        align-items: center;
        padding: 5px 0 0 0;
        .status {
            font-size: 14/11rem;
            color: #f40;
            padding-left: 30px;
            font-weight: 700;
            text-align: center;
        }
        .info {
            width: 60%;
            border-right: 1px solid #eee;
            font-size: 14/11rem;
            .value {
                color: #f40;
                font-weight: 700;
            }
        }
    }
    .remark {
        span {
            color: #999;
        }
    }
    // .row {
    //     line-height: 22px;
    //     display: flex;
    //     padding: 0 20px;
    //     color: #787878;
    //     span {
    //         // flex: 1;
    //         // text-align: center;
    //         padding-left: 10px;
    //     }
    // }
    .item-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .id {
            font-size: 14/11rem;
            span {
                font-weight: 700;
            }
        }
        .overtime {
            color: #f40;
            font-size: 12/11rem;
        }
    }
    .deco {
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
    }
    .btn-group {
        padding-top: 10px;
        display: flex;
        justify-content: space-evenly;
    }
}
</style>