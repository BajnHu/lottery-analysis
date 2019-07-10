// let wordsArr = [{ words: '中国福利彩票' },
// { words: ' 62D76CDC 9072 EF0C 5SEEDCB7' },
// {
//     words: '站号:310906182019.07.03-19:04:57操作员:1',
//     probability: [Object]
// },
// { words: ' No' },
// { words: '双色球' },
// { words: '期号:2019077序号:00156单式' },
// { words: '蓝球' },
// { words: 'A>040714202627-01' },
// { words: 'B>051113182127-06' },
// { words: 'C>081422242533-06' },
// { words: '+' },
// { words: '---------------' },
// { words: 'E>-' },
// { words: '-------' },
// { words: '开奖日:2019-07-04倍数:001金额:6元' },
// { words: '站址:张东路2201弄72号' },
// { words: '感谢您为社会福利事业贡献2.16元' },
// { words: ' E6376AB3 DDES B892' },
// { words: '上海市福利彩票发行中心承销' }]


// var b = [
//     { "words": "中" },
//     { "words": "国" },
//     { "words": "体彩超级大透" },
//     { "words": "体" },
//     { "words": "育" },
//     { "words": "彩" },
//     { "words": "第19077期" },
//     { "words": "2019年07月06日开奖" },
//     { "words": "110310-174360-016489-644606566613 xxyfDw" },
//     { "words": "单式票" },
//     { "words": "追加投注1倍" },
//     { "words": "合计6元" },
//     { "words": "①0120242634+0610中" },
//     { "words": "②0709232532+0911" },
//     { "words": "国" },
//     { "words": "体育彩" },
//     { "words": "票" },
//     { "words": "感谢您为公益事业贡献2.16元" },
//     { "words": "周四005巴西VS巴拉圭" },
//     { "words": "关注五星体育《超G竞彩》公益体彩乐善人生" },
//     { "words": "12-012382-1010006219/07/0518:52:52" },
//     { "words": "中国体育彩票" }]


function selectRes(wordsArr) {

    // console.log(wordsArr)
    let str = wordsArr.reduce((prev, item) => {
        return prev + item.words
    }, '');

    const types = [
        '双色球',
        '大乐透'
    ]

    const keys = [
        'ssq',
        'dlt'
    ]

    function typeCheck() {

        const doubleReg = /(双|色)(球)?/.test(str) || /福利/.test(str);
        const daletouReg = /(体彩)?(大乐透|乐透)/.test(str) || /体育/.test(str);

        if (doubleReg) {
            return 0
        } else if (daletouReg) {
            return 1
        }
    }

    function numberCheck(typeIdx) {

        let reg = [
            /[A-Z]?>?(\d{12}-?\d{2})/ig,
            /(\d{10}\+?\d{4})/ig
        ]
        let splitStr = [
            "-",
            "+"
        ]
       
        let res = str.match(reg[typeIdx]);
        if (res) {
            // console.log(res)
            let allBalls = res.map((item) => {
                let ballSplit = item.split(splitStr[typeIndex]);
                // 判断 识别出的字符中是否带 “-”
                let blue = ballSplit[1];
                // 将球两个两个的分隔开
                let ballReg = /(\d{2})/ig
                let balls = ballSplit[0].match(ballReg);
                // 直接识别出蓝球说明  将蓝球和红球 合到一块去
                if (blue) {
                    blue = blue.match(ballReg)
                    balls = balls.concat(blue);
                    // console.log(balls)
                }
                return balls
            })
            return allBalls;
        } else {
            return null
        }
    }
    const typeIndex = typeCheck()
    const type = types[typeIndex] //彩票类型
    if (!type) {
        console.log('没有识别出彩票类型 => 请把整张彩票放入镜头,尝试在背景深色的地方识别')
        return '没有识别出彩票类型 => 请把整张彩票放入镜头,尝试在背景深色的地方识别'
    }
    const ballArr = numberCheck(typeIndex);

    if (!ballArr) {
        console.log('没有识别出彩票号码 => 请把整张彩票放入镜头,尝试在背景深色的地方识别')
        return '没有识别出彩票号码 => 请把整张彩票放入镜头,尝试在背景深色的地方识别'
    }

    function checkVersion(typeIndex) {
        let reg =[
            /期号:?：?(\d{7})/,
            /第\s?(\d{5})期/,
        ] ;
        let versionRes = str.match(reg[typeIndex]);

        if (!versionRes) { return null }
        let version = versionRes[1]

        let curYear = new Date().getFullYear();
        let cloneVer = version
        if(typeIndex){
            cloneVer = '20'+version;
        }
        let year = parseInt(cloneVer.split('').slice(0, 4).join(''));

        let time = parseInt(cloneVer.split('').slice(4).join(''));
        if (!year && !time) { return nul }
        if (year < 1987 || year > curYear) {
            console.log('没有正确识别出期号 => 请确认彩票的真伪');
            return '没有正确识别出期号 => 请确认彩票的真伪'
        }
        return version
    }

    const version = checkVersion(typeIndex) // 期号
    if (!version) {
        console.log('没有识别出期号 => 请把整张彩票放入镜头,尝试在背景深色的地方识别');
        return '没有识别出期号 => 请把整张彩票放入镜头,尝试在背景深色的地方识别'
    }
    const site = '' // 站号
    const date = '' // 打印时间
    const way = '' // 玩法
    const multiple = 1 // 倍数
    return {
        code: 0,
        typeIndex,
        type,
        key:keys[typeIndex],
        version,
        ballArr
    }
}

module.exports = selectRes



