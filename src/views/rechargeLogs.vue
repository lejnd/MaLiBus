<template>
<div class='recharge-logs bg-f5'>
    <topbar title="充值记录"></topbar>
    <div class="container">
        <div class="nothing" v-if="nothing">
            <img src="../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <p class="datetime">{{item.rechage_time}}</p>
            <div class="content">
                <strong>充值金额</strong>
                <span>{{item.money}}元</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common';

export default {
    name: 'RechargeLogs',
    components: { Topbar },
    data() {
        return {
            items: [],
            nothing: false,
        };
    },
    methods: {
        getLogs() {
            this.$fly.post('/api/CompanyOption/GetReChargeList', {
                appId: localStorage.getItem('appid'),
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data || [];
                    this.items = list.map(item => Object.assign({}, item, {
                        rechage_time: common.formatTime(item.rechage_time)
                    }));
                    this.nothing = this.items.length == 0
                } else {
                    this.nothing = true;
                    this.$toast(returnMsg)
                }
            })
        }
    },
    mounted() {
        this.getLogs();
    },
}
</script>

<style lang='less'>
.recharge-logs {
    .container {
        padding: 15px;
        .item {
            margin-bottom: 15px;
            .datetime {
                text-align: center;
                font-size: 12/11rem;
                color: #666;
                margin-bottom: 3px;
            }
            .content {
                padding: 12px 15px;
                background-color: #fff;
                border-radius: 6px;
                box-shadow: 0 0 6px #e3e3e3;
                font-size: 14/11rem;
                display: flex;
                justify-content: space-between;
                strong {
                    font-weight: 700;
                    margin: 0 3px;
                }
                span {
                    margin: 0 3px;
                    color: #f40;
                }
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