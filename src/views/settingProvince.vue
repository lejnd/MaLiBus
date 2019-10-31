<template>
<div class='setting-province'>
    <topbar title="设置省份"></topbar>
    <div class="container">
        <div class="region-row">
            <h3>{{type==1?'api发布省份':'手机号辅助省份'}}</h3>
            <van-dropdown-menu class="flex1">
                <van-dropdown-item v-model="region" :options="regionOpt"/>
            </van-dropdown-menu>
        </div>
        <div class="btn-wp">
            <van-button class="btn" type="info" @click="settingProvince">确定设置</van-button>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common'
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'SettingProvince',
    components: { Topbar },
    data() {
        return {
            region: '',
            regionOpt: [],
            type: 1,
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return this.userInfo || {};
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        settingProvince() {
            this.$fly.post('/api/CompanyOption/SetProvince', {
                provcode: this.region,
                type: this.type,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg);
                    this.type == 1 ?
                    this.$router.replace('/') :
                    this.$router.replace('/mobileOrder')
                } else {
                    this.$notify(returnMsg);
                }
            })
        },
        getRegionList() {
            return this.$fly.get('/api/CompanyOption/GetProvince')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.regionOpt = data.map(item => ({
                        text: item.province_name,
                        value: item.province_code,
                    }))
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
    },
    mounted() {
        this.type = this.$route.query.type || '';
        this.getRegionList();
        this.getUserInfo().then(() => {
            if (this.type == 1) {
                this.region = this.user.api_provcode.toString();
            } else {
                this.region = this.user.tel_provcode.toString();
            }
        });
    },
}
</script>

<style lang='less'>
.setting-province {
    min-height: 100vh;
    background-color: #fff;
    .tip {
        background-color: #f40;
        color: #fff;
    }
    .container {
        padding: 15px 0;
        .region-row {
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
        .btn-wp {
            display: flex;
            justify-content: center;
            .btn {
                width: 70%;
                margin-top: 20px;
            }
        }
    }
}
</style>