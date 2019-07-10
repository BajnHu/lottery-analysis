const client_id = 'bsZ4WwxsLX2Ak0qrXwKcErvi';
const client_secret = 'FONRFfCTG1KaxoaGnbxeh7anfey3tZlw';
const request = require('request');
var https = require('https');
var qs = require('querystring');

module.exports = function () {



    const param = qs.stringify({
        'grant_type': 'client_credentials',
        client_id,
        client_secret
    });

    return new Promise((resolve, reject) => {


        request('https://aip.baidubce.com/oauth/2.0/token?'+param,{},(err,res,body)=>{
            resolve(JSON.parse(body));
        })
        // https.get(
        //     {
        //         hostname: 'aip.baidubce.com',
        //         path: '/oauth/2.0/token?' + param,
        //         agent: false
        //     },
        //     function (res) {
        //         // 在标准输出中查看运行结果
        //         resolve(res);
        //         typeof res.pipe(process.stdout)
        //         console.log('ffffffffffffffff')
        //     }
        // );
    })


}
