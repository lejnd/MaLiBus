<template>
<div class='user-transfer-logs bg-f5'>
    <topbar title="转移明细"></topbar>
    <van-tabs v-model="active" @change="getLogs">
        <van-tab title="转出明细"></van-tab>
        <van-tab title="转入明细"></van-tab>
    </van-tabs>
    <div class="container">
        <div class="nothing" v-if="nothing">
            <img src="../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <p class="datetime">{{item.create_time}}</p>
            <div class="content" v-if="active=='0'">向账户<strong>{{item.transfer_to}}</strong>转出<span>{{item.transfer_money}}</span>元</div>
            <div class="content" v-else>账户<strong>{{item.transfer_to}}</strong>转入<span>{{item.transfer_money}}</span>元</div>
        </div>
        <van-pagination
            v-if="totalNum > PAGE_SIZE"
            v-model="currentPage" 
            :page-count="pageCount"
            @change="getLogs"
            mode="simple"
        />
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
import { mapActions, mapGetters } from 'vuex';

const PAGE_SIZE = 10;

export default {
    name: 'UserTransferLogs',
    components: { Topbar },
    data() {
        return {
            active: '0',
            items: [],
            nothing: false,
            // 分页
            currentPage: 1,
            PAGE_SIZE,
            totalNum: null,
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.totalNum / PAGE_SIZE);
        }
    },
    methods: {
        getLogs() {
            this.$fly.post(`/api/CompanyOption/GetCardbusinessTransfersListPage?dateTime=&pageIndex=${this.currentPage}&pageSize=${PAGE_SIZE}&InOrOut=${this.active}`)
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data.items || [];
                    this.totalNum = data.totalNum || 0;
                    this.items = list.map((item) => Object.assign({}, item, {
                        create_time: common.formatTime(item.create_time)
                    }))
                    this.nothing = this.items.length == 0
                } else {
                    this.$notify(returnMsg);
                }
            })
        },
    },
    mounted() {
        this.getLogs();
    },
}
</script>

<style lang='less'>
.user-transfer-logs {
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
                padding: 10px 15px 20px 15px;
                background-color: #fff;
                border-radius: 6px;
                box-shadow: 0 0 6px #e3e3e3;
                font-size: 13/11rem;
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