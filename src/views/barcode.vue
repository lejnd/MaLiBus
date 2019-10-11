<template>
    <div class="scan">
        <div class="header">
            <van-icon name="arrow-left" size="24px" @click="goBack" />
            <span class="right-btn" @click="galleryImg">相册</span>
        </div>
        <div id="bcid">
            <div style="height:40%"></div>
            <p class="tip">...载入中...</p>
        </div>
        <!-- <footer>
            <van-button class="btn" :loading="isStart" @click="start" type="default">开始扫描</van-button>
            <van-button class="btn" @click="goBack" type="default">结束扫描</van-button>
        </footer> -->
    </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters, mapActions } from 'vuex';
import common from '../components/common';
let scan = null;

export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
        user() {
            return this.userInfo || {};
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        // 相册扫码
        galleryImg(){
            let that = this;
            if (!window.plus) return;
            // 从相册中选择图片，获取到图片地址path
            plus.gallery.pick(function(path){
                //识别二维码图片
                plus.barcode.scan(path, onmarked, function(error){
                    plus.nativeUI.alert('无法识别此图片');
                });
            }, function(err){
                console.log('Failed: '+err.message);
            });
            function onmarked(type, result, file) {
                switch (type) {
                    case plus.barcode.QR:
                        type = "QR";
                        break;
                    case plus.barcode.EAN13:
                        type = "EAN13";
                        break;
                    case plus.barcode.EAN8:
                        type = "EAN8";
                        break;
                    default:
                        type = "其它" + type;
                        break;
                }
                that.onSubmit(result);
            }
        },
        //创建扫描控件
        startRecognize() {
            let that = this;
            if (!window.plus) return;
            scan = new plus.barcode.Barcode("bcid");
            scan.onmarked = onmarked;
            function onmarked(type, result, file) {
                switch (type) {
                    case plus.barcode.QR:
                        type = "QR";
                        break;
                    case plus.barcode.EAN13:
                        type = "EAN13";
                        break;
                    case plus.barcode.EAN8:
                        type = "EAN8";
                        break;
                    default:
                        type = "其它" + type;
                        break;
                }
                that.onSubmit(result);
            }
        },
        //开始扫描
        startScan() {
            if (!window.plus) return;
            scan.start();
        },
        //关闭扫描
        cancelScan() {
            if (!window.plus) return;
            scan.cancel();
        },
        //关闭条码识别控件
        closeScan() {
            if (!window.plus) return;
            scan.close();
        },
        goBack() {
            this.closeScan();
            this.$router.replace('/')
        },
        start() {
            this.startRecognize();
            this.startScan();
        },
        /////////////
        onSubmit(result) {
            result = result.replace(/\n/g, "");
            if (result.indexOf('weixin110.qq.com') != -1) {
                this.createTask(result)
            } else {
                this.$notify('二维码不符合扫码要求')
            }
            this.goBack();
        },
        createTask(url) {
            return this.$fly.post('/api/CompanyOption/CreateTaskByBusiness', common.connectObj({
                appId: this.user.appid,
                type: 1,
                qrCodeInfo: url,
                expireTime: 300,
                provCode: localStorage.getItem('region') || '0',
                remark: this.$route.query.remark || '',
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg);
                    this.getUserInfo();
                } else {
                    this.$notify(returnMsg);
                }
            })
        },
        // testCreateTask(url) {
        //     return this.$fly.post('/api/CompanyOption/CreateTaskByBusiness', common.connectObj({
        //         appId: this.user.appid,
        //         type: 1,
        //         qrCodeInfo: 'http://weixin110.qq.com/wqw122',
        //         expireTime: 300,
        //         provCode: localStorage.getItem('region') || '0',
        //         remark: this.$route.query.remark || '',
        //     })).then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.$toast(returnMsg);
        //             this.getUserInfo();
        //         } else {
        //             this.$notify(returnMsg);
        //         }
        //     })
        // }
    },
    mounted () {
        this.start();
        // this.testCreateTask();
    }
};
</script>
<style lang="less">
.scan {
    height: 100%;
    #bcid {
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 44px;
        bottom: 0;
        text-align: center;
        color: #fff;
        background: #777;
    }
    .header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        color: #fff;
        background-color: rgba(0, 0, 0, .66);
        z-index: 10;
        .right-btn {
            font-size: 15px;
            padding: 0 5px;
        }
    }
    footer {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 50px;
        width: 100%;
        z-index: 2;
        display: flex;
        .btn {
            flex: 1;
            height: 50px;
            background-color: rgba(0, 0, 0, .66);
            border-color: #777;
            color: #fff;
            border-radius: 0;
        }
    }
}
</style>