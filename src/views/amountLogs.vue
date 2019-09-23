<template>
<div class='user-transfer bg-f5'>
    <topbar title="余额明细"></topbar>
    <div class="container">
        <div class="nothing" v-if="nothing">
            <img src="../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <h2 class="title">
                <span class="date">{{item.create_time}}</span>
                <span class="amount" :style="{'color': item.amount>0 ? '#34cc03' : '#f40'}">{{item.amount}}元</span>
            </h2>
            <p class="deco">{{item.business_type_desc}}</p>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'

export default {
    name: 'UserTransfer',
    components: { Topbar },
    data() {
        return {
            items: [],
            nothing: false,
        };
    },
    computed: {
    },
    methods: {
        getLogs() {
            this.$fly.post('/api/CompanyOption/GetBalanceLogList')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data || [];
                    this.items = list.map(item => Object.assign({}, item, {
                        create_time: common.formatTime(item.create_time)
                    }))
                    this.nothing = this.items.length == 0
                } else {
                    this.$toast(returnMsg);
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
.user-transfer {
    .container {
        padding: 15px;
        .item {
            padding: 10px;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 0 6px #eee;
            margin-bottom: 10px;
            width: 100%;
            .title {
                display: flex;
                align-items: center;
                font-size: 14/11rem;
                justify-content: space-between;
                .amount {
                    font-size: 15/11rem;
                }
                .date {
                    font-weight: 700;
                }
            }
            .deco {
                color: #666;
                padding: 5px 0;
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