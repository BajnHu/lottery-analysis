let testArr = [{ words: '中国福利彩票' },
    { words: ' 62D76CDC 9072 EF0C 5SEEDCB7' },
    {
        words: '站号:310906182019.07.03-19:04:57操作员:1',
        probability: [Object]
    },
    { words: ' No' },
    { words: '双色球' },
    { words: '期号:2019077序号:00156单式' },
    { words: '蓝球' },
    { words: 'A>040714202627-01' },
    { words: 'B>051113182127-06' },
    { words: 'C>081422242533-06' },
    { words: '+' },
    { words: '---------------' },
    { words: 'E>-' },
    { words: '-------' },
    { words: '开奖日:2019-07-04倍数:001金额:6元' },
    { words: '站址:张东路2201弄72号' },
    { words: '感谢您为社会福利事业贡献2.16元' },
    { words: ' E6376AB3 DDES B892' },
    { words: '上海市福利彩票发行中心承销' }]

let str = testArr.reduce((prev, item) => {
    return prev + item.words
}, '');


const types = [
    '双色球',
    '大乐透'
]

function typeCheck() {

    const doubleReg = /(双|色)(球)?/.test(str) || /福利/.test(str);
    const daletouReg = /(大乐透|乐透)/.test(str) || /体育/.test(str);

    if (doubleReg) {
        return 0
    } else if (daletouReg) {
        return 1
    }
}

function numberCheck() {
    let reg = /[A-Z]?>?(\d{12}-?\d{2})/ig;
    let res = str.match(reg);
    if (res) {
        let allBalls = res.map((item) => {
            let ballSplit = item.split('-');
            // 判断 识别出的字符中是否带 “-”
            let blue = ballSplit[1];
            // 将球两个两个的分隔开
            let ballReg = /(\d{2})/ig
            let balls = ballSplit[0].match(ballReg);
            // 直接识别出蓝球说明  将蓝球和红球 合到一块去
            if (blue) {
                balls = balls.concat(blue);
            }
            return balls
        })
        return allBalls;
    } else {
        return null
    }
}

const type = types[typeCheck()] //彩票类型
if (!type) {
    console.log('请把整张彩票放入镜头.')
}

const site = '' // 站号
const date = '' // 打印时间
const version = '' // 期号
const way = '' // 玩法
const ballArr = numberCheck();

if(!ballArr){
    console.log('请把整张彩票放入镜头,尝试在背景深色的地方识别')
}

const multiple = 1






