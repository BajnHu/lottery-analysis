const app = require('express')();
const request = require('request')
const bodyParser = require('body-parser')
const qs = require('querystring');
// const multiparty = require('multiparty');
// const schedule = require('node-schedule');
//

const token = require('./getToken');
const accurate_basic = require('./accurate_basic');
const selectkRes = require('./check/normalCheck');
const bonus = require('./check/bonus');

let lottery_history =  {
    'ssq':{},
    'dlt':{}
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));



app.all("*", function (req, res, next) {
    // function originCheck(origin) {
    //     console.log(origin)
    //     switch (origin.toLowerCase()) {
    //         case '127.0.0.1':
    //         case 'localhost':
    //         case '172.18.55.71':
    //         case '192.168.51.104':
    //             return true
    //         default:
    //             return false;
    //     }
    // }

    // if (originCheck(req.hostname)) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    // }
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
})

app.get('/getToken', (req, res) => {
    token().then((data) => {
        res.send(JSON.stringify({
            code: 0,
            data,
        }))
        res.end()
    }, function () {

    })
})
app.get('/analysis', (req, res) => {
    console.log('只支持post')
    res.send(JSON.stringify({
        code: 1,
        message: "只支持post"
    }))
})

function getHistory(lottery_id) {
    // let lottery_id_arr = ['ssq', 'dlt'];
    return new Promise((resolve, reject) => {
        const param = qs.stringify({
            key: '6fdf9d3b5512c83e6fb562620a2bb672',
            lottery_id,
            page_size:50
        });

        request('http://apis.juhe.cn/lottery/history?'+param,{}, (err, res, body) => {
            if (err) {
                console.log(err,'获取开奖历史失败！！！！')
            } else {
                let be_str = lottery_id=='ssq'?'20':'';
                JSON.parse(body).result.lotteryResList.forEach((item)=>{
                    lottery_history[lottery_id][be_str+item.lottery_no]  = item
                })
            }
        })
    });
}

function scheduleCronstyle(){
//     getHistory('ssq');
//     getHistory('dlt');
//     schedule.scheduleJob('00 21 1 * * *', function(){
//         console.log('scheduleCronstyle:' + new Date());
        getHistory('ssq');
        getHistory('dlt');
//     });
}

scheduleCronstyle()


// app.post('/uploadFile',(req,res)=>{
    // const form = new multiparty.Form();
    // console.log('req');
    //
    // form.parse(req,function (err,fields,files) {
    //     console.log(files)
    //     res.send({
    //         code:0,
    //         message:'updata'
    //     })
    //     res.end();
    // })
// })


app.post('/analysis', (req, res) => {

    const image = req.body;
    console.log(image);
    console.log(+new Date)


    accurate_basic(image).then(
        (responese) => {
            let data = selectkRes(JSON.parse(responese).words_result);
            if(!data || data.code!==0){
                res.send(JSON.stringify({
                    code: 1,
                    message:data
                }));
                res.end();
                return ;
            }
            // console.log(data);

            let resData = bonus(data,lottery_history);
            let succMsg = '识别完成' ;
            let code = 0;
            // console.log(resData.code)
            if(resData.code!==0){
                succMsg = resData
                resData = null;
                code= 1;
            }

            res.send(JSON.stringify({
                code,
                data:resData,
                message:succMsg
            }));
            res.end();
        },
        (err) => {
            res.send(JSON.stringify({
                code: 1,
                message: 'error',
                err
            }));
            res.end();
        })
})


let server = app.listen('3369', (req, res) => {
    let { address, port } = server.address()
    console.log("应用实例，访问地址为 http://%s:%s", address, port)
})


