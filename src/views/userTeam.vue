<template>
<div class='user-team bg-f5'>
    <topbar title="下级列表"></topbar>
    <date-select @getDate="getDate"></date-select>
    <p class="total">直接下级总数：{{children.length}}</p>
    <div class="container">
        <div class="item" v-for="item in children" :key="item.tel">
            <!-- <div class="title">
                <h3 class="id" v-if="item.depth==2">一级好友</h3>
                <h3 class="id" v-if="item.depth==3">二级好友</h3>
                <span class="date">直接上级：{{item.parent_id}}</span>
            </div> -->
            <div class="title">
                <h3 class="id">
                    <van-icon name="user-circle-o" />
                    {{item.tel}}
                </h3>
                <span class="date">注册时间：{{item.register_time}}</span>
            </div>
            <van-grid class="grid" :border="false" :column-num="2">
                <van-grid-item>
                    <span class="value">{{item.total_count}}</span>
                    <span class="name">总下单数</span>
                </van-grid-item>
                <van-grid-item>
                    <span class="value" style="color: #07be03;">{{item.success_count}}</span>
                    <span class="name">总成功单数</span>
                </van-grid-item>
            </van-grid>
            <van-cell v-if="item.children.length>0" :title="`下级数量：${item.children.length}`" is-link arrow-direction="down" />
            <div class="item2" v-for="sub in item.children" :key="sub.tel">
                <div class="title">
                    <h3 class="id">
                        <van-icon name="user-circle-o" />
                        {{sub.tel}}
                    </h3>
                    <span class="date">注册时间：{{formDate(sub.register_time)}}</span>
                </div>
                <van-grid class="grid" :border="false" :column-num="2">
                    <van-grid-item>
                        <span class="value">{{sub.total_count}}</span>
                        <span class="name">总下单数</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value" style="color: #07be03;">{{sub.success_count}}</span>
                        <span class="name">总成功单数</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common';
import DateSelect from '@/components/date-select.vue';

export default {
    name: 'UserTeam',
    components: { Topbar, DateSelect },
    data() {
        return {
            children: [],
            searchDate: '',
        };
    },
    methods: {
        getDate(date) {
            this.searchDate = date;
            this.getList();            
        },
        getList() {
            this.$fly.get('/api/CompanyOption/GetTreeCardInfo', { dateTime: this.searchDate })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100 && data) {
                    let list = data.children || [];
                    this.children = list.map(item => Object.assign({}, item, {
                        register_time: common.formatDate(item.register_time),
                    }))
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        formDate(date) {
            return common.formatDate(date);
        }
    },
    mounted() {

    },
}
</script>

<style lang='less'>
.user-team {
    .total {
        text-align: center;
        // background-color: #ddd;
        padding-top: 10px;
    }
    .container {
        padding: 10px 15px;
        .item {
            padding: 5px 10px 0 10px;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 0 6px #eee;
            margin-bottom: 10px;
            .title {
                display: flex;
                align-items: center;
                font-size: 14/11rem;
                padding: 6px 0;
                border-bottom: 1px solid #f5f5f5;
                .id {
                    flex: 1;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    .van-icon {
                        margin-right: 5px;
                        font-size: 18/11rem;
                        color: #fe5701;
                    }
                }
                .date {
                    color: #888;
                    font-size: 13/11rem;
                }
            }
            .grid {
                .van-grid-item__content {
                    padding: 5px 8px 10px 8px;
                }
                .value {
                    font-size: 14/11rem;
                    font-weight: 700;
                    color: #fe5701;
                }
                .name {
                    font-size: 13/11rem;
                    margin-top: 3px;
                }
            }
        }
        .item2 {
            padding: 5px 10px 0 10px;
            background-color: #fff9e2;
            border-radius: 6px;
            box-shadow: 0 0 6px #eee;
            margin-bottom: 10px;
            .van-grid-item__content {
                background-color: #fff9e2;
            }
        }
    }
}
</style>