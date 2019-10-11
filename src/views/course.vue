<template>
<div class='course'>
    <topbar title="使用教程"></topbar>
    <div class="container">
        <img src="../assets/img/course1.png" alt="">
        <h2>【首页】</h2>
        <p>第一步：联系客服充值金额，充值100起步，充值不能提现。</p>
        <p>第二步：设置手动发布价格【脚本商家设置API发布价格】，可以灵活变动。</p>
        <p>第三步：发布订单最好备注一下订单，方便区分，方便工作室使用。</p>
        <p>PS：手机号辅助中旬对接好，敬请期待！</p>
        <p class="ps">【重点】多关注公告，公告内容每天实时更新。</p>
        <img src="../assets/img/course2.png" alt="">
        <img src="../assets/img/course3.png" alt="">
        <h2>【账单界面】</h2>
        <p>【订单状态分类】：未接单、未接单退款、正在扫码、扫码失败、任务成功、任务失败、自动完成、卡商胜诉、正在申诉、地推胜诉。</p>
        <p>未接单：没有地推接订单，如果订单五分钟没人接单，系统默认失败，5-10分钟自动退款，商家可以重新换码上传。</p>
        <p>未接单退款：订单属于未接单状态，商家收到退款，订单状态变动为未接单退款。</p>
        <p>正在扫码：地推接单了，如果在发布的五分钟内没有辅助成功，商家就可以手动点击辅助失败【点击辅助失败时间：订单发布五分钟后，倒计时结束前面】</p>
        <p>扫码失败：地推接单了，主动放弃任务，订单金额会在30分钟内退还商家余额钱包。</p>
        <p>任务成功：地推接单并辅助成功，商家在倒计时前面点击成功，最好越快越好，能够提升地推体验度。</p>
        <p>任务失败：地推接单并扫码，没有辅助成功，时间过了发布的五分钟，商家在倒计时前面点击失败显示的任务状态【恶意点击失败引起申诉容易被系统风控冻结余额】</p>
        <p>自动完成：地推接单并辅助成功，商家忘记点击辅助成功，倒计时结束系统默认系统完成【为了让地推更快拿到佣金，提高体验度，偶尔发生商家辅助失败忘记点击商家自己承担损失，为商家主观行为】</p>
        <p>商家胜诉：地推接单，商家点击失败，地推申诉订单，商家上传失败图，客服核实地推方，判定商家胜诉，不扣除商家订单金额。</p>
        <p>正在申诉：地推接单，辅助成功商家恶意点击辅助失败，地推进行申诉，并提交成功订单，客服核实情况，进行仲裁【偶尔有地推恶意申诉，商家可以投诉】</p>
        <p>地推胜诉：地推接单并辅助成功，商家恶意点击失败，地推申诉，上传成功订单，客服核实判定地推胜诉，扣除商家余额【偶尔误判，商家联系客服解决】</p>
        <img src="../assets/img/course4.png" alt="">
        <h2>【我的】界面：</h2>
        <p>充值中心：自助充值在构建，暂时是联系客服充值，或者联系上级代理充值。</p>
        <p>下级列表：查询自己推荐的下级的订单数，方便统计数据，也方便核对代理收益明细。</p>
        <p>推荐下级：推荐下级，填写自己的邀请码成为自己的代理，可以享受代理收益，下级每辅助成功一单都有佣金奖励收益，邀请越多赚的越多，也可以成为平台大代理，私聊客服。</p>
        <p>充值记录：查询自己的充值明细，方便记账。</p>
        <p>余额转移：方便代理给下级放单方充值金额，也方便多人工作室余额分配使用，转移需要设置转移密码，账户金额转移错误或者被盗用与码力平台无关。</p>
        <p>余额明细：记录自己余额明细使用，统计自己的账单，也有下级的收益显示。</p>
        <p>账户资料：个人信息的记录，密码的记录。</p>
        <p>数据统计：查询每天自己订单数据的统计显示，一目了然。</p>
        <p>APP下载：里面有商家端的APP下载链接，安卓和苹果永久有效。</p>
        <p>商家下单端，安卓苹果通用下载链接，下载链接永久有效，不变更。http://baourl.cn/MzYz</p>
        <p>电脑端网址【主页可以下载API对接文档】http://adminmanager.mali126.com/Login/Login </p>
        <p>脚本对接：生成验签复制KEY。</p>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
export default {
    name: 'Course',
    components: { Topbar },
    data() {
        return {
            active: 0,
            htmlText: '',
            questionHtml: '',
        };
    },
    methods: {
        // // 获取接单教程文字
        // getText() {
        //     return this.$fly.get('/api/Task/GetNotice', { type: 5 })
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.htmlText = data.content;
        //         }             
        //     })
        // },
        // // 获取常见问题
        // getQuestion() {
        //     return this.$fly.get('/api/Task/GetNotice', { type: 6 })
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.questionHtml = data.content;
        //         }             
        //     })
        // }
    },
    mounted() {
        // this.getText();
        // this.getQuestion();
    },
}
</script>

<style lang='less'>
.course {
    .container {
        padding: 15px;
        img {
            width: 100%;
            margin-bottom: 10px;
        }
        p {
            font-size: 14/11rem;
            line-height: 1.5;
            padding: 3px 0;
            &.ps {
                color: #f40;
            }
        }
        h2 {
            font-size: 20/11rem;
            font-weight: 700;
            padding: 15px 0 0 0;
        }
        h3 {
            font-size: 16/11rem;
            font-weight: 600;
            margin-top: 10px;
        }
    }
}
</style>