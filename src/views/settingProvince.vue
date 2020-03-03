<template>
<div class='setting-province'>
    <topbar title="设置省份"></topbar>
    <div class="container">
        <div class="region-row">
            <h3>省份类型：</h3>
            <van-radio-group v-model="type" class="radio-wp">
                <van-radio name="1">api下单</van-radio>
                <van-radio name="2">手机辅助</van-radio>
            </van-radio-group>
        </div>
        <div class="region-row" v-if="type=='1'">
            <h3>省份：</h3>
            <van-dropdown-menu class="flex1">
                <van-dropdown-item v-model="region" :options="regionOpt"/>
            </van-dropdown-menu>
        </div>
        <van-cell-group v-if="type=='2'">
            <van-field v-model="regionStrs" label="省份：" placeholder="请选择省份（多选）" readonly @click="showDialog=true" />
        </van-cell-group>
        <div class="region-row" v-if="type=='1'">
            <h3>是否定向省份：</h3>
            <van-radio-group v-model="direct" class="radio-wp">
                <van-radio name="1">定向</van-radio>
                <van-radio name="2">非定向</van-radio>
            </van-radio-group>
        </div>
        <div class="region-row" v-if="type=='2'">
            <h3>自动分配下单省份：</h3>
            <van-radio-group v-model="is_allocation" class="radio-wp">
                <van-radio name="0">否</van-radio>
                <van-radio name="1">是</van-radio>
            </van-radio-group>
        </div>
        <div class="region-row" v-if="type=='1'">
            <h3>省份确认：</h3>
            <van-radio-group v-model="api" class="radio-wp">
                <van-radio name="0">省份已商户设置为准</van-radio>
                <van-radio name="1">省份以下单传进来的参数为准</van-radio>
            </van-radio-group>
        </div>
        <!-- <div class="region-row" v-if="type=='2'">
            <h3>区号：</h3>
            <van-dropdown-menu class="flex1">
                <van-dropdown-item v-model="area" :options="areaCode"/>
            </van-dropdown-menu>
        </div> -->
        <div class="btn-wp">
            <van-button class="btn" type="info" @click="settingProvince">确定设置</van-button>
        </div>
        <van-dialog v-model="showDialog" title="选择省份" show-cancel-button @cancel="initMobile">
            <div class="sheet-wp">
                <!-- <h3 class="sheet-wp-title">选择省份</h3> -->
                <div class="sheet-wp-content">
                    <van-button
                        class="item"
                        v-for="(item, index) in sheetItems"
                        :key="item.value"
                        :plain="checked(item.text)"
                        @click="checkedHandler(item)"
                        hairline
                        type="warning"
                    >
                        {{item.text}}
                    </van-button>
                </div>
            </div>
        </van-dialog>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common'
import config from '@/config'
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'SettingProvince',
    components: { Topbar },
    data() {
        return {
            region: '',
            regionOpt: config.regions,
            type: '1',
            direct: '1',
            is_allocation: '0',
            api: '0',

            regionStrs: '',   // 多选省份text的字符串
            regionCodes: '',   // 多选省份code的字符串
            regionArr: [],
            showDialog: false,

            areaCode: config.areaCode,
            area: '86',
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return this.userInfo || {};
        },
        sheetItems() {
            return this.regionOpt.filter(item => item.value != '1' && item.value != '0');
        },
    },
    watch: {
        type() {
            if (this.type == 1) {
                this.initApi();
            } else {
                this.initMobile();
            }
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        settingProvince() {
            this.$fly.post('/api/CompanyOption/SetProvince', {
                provcodes: this.regionCodes,
                provcode: this.region || 0,
                type: this.type,
                direct: parseInt(this.direct) - 1,
                area: this.area,
                is_allocation: this.is_allocation,
                api: this.api,
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
        // getRegionList() {
        //     return this.$fly.get('/api/CompanyOption/GetProvince')
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.regionOpt = data.map(item => ({
        //                 text: item.province_name,
        //                 value: item.province_code,
        //             }))
        //         } else {
        //             this.$toast(returnMsg);
        //         }
        //     })
        // },
        checked(text) {
            return !this.regionArr.map(item => item.text).includes(text);
        },
        checkedHandler(item) {
            if (this.regionArr.includes(item)) {
                this.regionArr = this.regionArr.filter(obj => obj.text != item.text);
            } else {
                this.regionArr.push(item);
            }
            this.regionStrs = this.regionArr.map(item => item.text).join(',');
            this.regionCodes = this.regionArr.map(item => item.value).join(',');
        },
        initMobile() {
            if (!this.user.tel_provcodes) {
                return false
            }
            let codes = this.user.tel_provcodes.split(',');
            this.is_allocation = this.user.is_allocation.toString();
            this.regionArr = codes.map(code => {
                return this.sheetItems.find(item => item.value == code)
            });
            this.regionStrs = this.regionArr.map(item => item.text).join(',');
            this.regionCodes = this.regionArr.map(item => item.value).join(',');
        },
        initApi() {
            this.api = this.user.api.toString();
            this.region = this.user.api_provcode.toString();
        },
    },
    mounted() {
        this.type = this.$route.query.type || '1';
        // this.getRegionList();
        this.getUserInfo().then(() => {
            this.direct = (this.user.direct + 1).toString();
            if (this.type == 1) {
                this.initApi();
            } else {
                this.initMobile();
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
            .radio-wp {
                flex: 1;
                display: flex;
                height: 60px;
                .van-radio {
                    margin-left: 15/11rem;
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
    .sheet-wp {
        padding: 5px 0;
        &-title {
            text-align: center;
            padding: 10px;
            font-size: 15px;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            color: #666;
        }
        &-content {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            .item {
                // border-radius: 6px;
                margin: 0 8px 8px 0;
                height: 36px;
                line-height: 34px;
                padding: 0 12px;
            }
        }
    }
}
</style>