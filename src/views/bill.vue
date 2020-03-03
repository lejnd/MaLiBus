<template>
<div class='bill-wp bg-f5'>
    <home-top title="账单" handler-name="刷新" @onClickRight="getTaskCenter">
        <span class="icon-loop2 van-icon" style="font-size:14px;"></span>
    </home-top>
    <date-select @getDate="getDate"></date-select>
    <div class="status-wp">
        <div class="status-row">
            <h3>任务状态</h3>
            <van-dropdown-menu class="flex1">
                <van-dropdown-item v-model="task_status" :options="statusOpt" @change="getTaskCenter" />
            </van-dropdown-menu>
        </div>
    </div>
    <div class="container">
        <p class="tip">
            <span class="title">提示：</span>
            {{tip}}
        </p>
        <div class="nothing" v-if="nothing">
            <img src="../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <bill-item v-for="item in items" :key="item.id" :item="item" @replay="getTaskCenter"></bill-item>
    </div>
    <van-pagination
        v-if="totalNum > PAGE_SIZE"
        v-model="currentPage" 
        :page-count="pageCount"
        @change="getTaskCenter"
        mode="simple"
    />
    <tab-bar :active="1"></tab-bar>
</div>
</template>

<script>
import HomeTop from '@/components/home-top.vue';
import TabBar from '@/components/tab-bar.vue';
import common from '../components/common';
import DateSelect from '@/components/date-select.vue';
import BillItem from '@/components/bill-item.vue';

const PAGE_SIZE = 10;

const statusOpt = [
    { text: '全部', value: '-1' },
    { text: '未接单', value: '0' },
    { text: '正在扫码', value: '2' },
    { text: '扫码失败', value: '3' },
    { text: '未接单退款', value: '4' },
    { text: '任务失败', value: '6' },
    { text: '任务成功', value: '1' },
    { text: '自动完成', value: '5' },
    { text: '正在申诉', value: '8' },
    { text: '商家胜诉', value: '9' },
    { text: '地推胜诉', value: '10' },
    { text: '申诉失败', value: '11' },
]

const mockData = [{
    task_id: 22222,
    tel: 15894586066,
    create_time: '2019/09/19 13:41:00',
    price: 7.8,
    task_status_des: '接单中',
    status: 1,
}, {
    task_id: 33333,
    tel: 15894586066,
    create_time: '2019/09/19 13:41:40',
    price: 7.8,
    task_status_des: '接单中',
    status: 8,
    upload_img: ''
}]

export default {
    name: 'Bill',
    components: { HomeTop, TabBar, DateSelect, BillItem },
    data() {
        return {
            formDate: '',
            items: [],
            nothing: false,
            tip: '',
            currentPage: 1,
            PAGE_SIZE,
            totalNum: null,
            task_status: '-1',
            statusOpt,
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.totalNum / PAGE_SIZE);
        }
    },
    methods: {
        getDate(date) {
            this.formDate = date;
            this.getTaskCenter();
        },
        getTaskCenter() {
            const toast = this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
            });
            this.$fly.get('/api/CompanyOption/GetTaskCenterPageV2', {
                dateTime: this.formDate,
                task_status: this.task_status,
                pageIndex: this.currentPage,
                pageSize: PAGE_SIZE,
                // appid: localStorage.getItem('appid'),
                // appid: '1164431027884658688',
            }).then((res) => {
                toast.clear();
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data.items || [];
                    this.totalNum = data.totalNum || 0;
                    this.items = list.map(item => Object.assign({}, item, {
                        create_time: common.formatTime(item.create_time)
                    }));
                    // this.items = mockData
                    this.nothing = this.items.length == 0
                } else {
                    this.nothing = true;
                    this.$toast(returnMsg);
                }
            })
        },
        getTip() {
            this.$fly.get('/api/CompanyOption/GetNotice', { type: 3 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                this.tip = data ? data.content : '';
            })
        }
    },
    mounted() {
        this.getTip();
    },
}
</script>

<style lang='less'>
.bill-wp {
    .status-wp {
        background-color: #fff;
        .status-row {
            padding: 0 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14/11rem;
            border-bottom: 1px solid #f5f5f5;
            .flex1 {
                flex: 1;
                .van-dropdown-menu__title {
                    width: 90%;
                    text-align: center;
                }
            }
        }
    }
    .container {
        padding: 15px;
        .tip {
            font-size: 12/11rem;
            padding: 5px 0 15px 0;
            color: #888;
            .title {
                color: #f40;
            }
        }
        .nothing {
            text-align: center;
            padding: 40px 0;
            img {
                width: 100px;
                opacity: .4;
            }
            p {
                padding: 10px;
                font-size: 14/11rem;
                color: #999;
            }
        }
    }
}
</style>