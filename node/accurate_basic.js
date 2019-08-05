const request = require('request');
const qs = require('querystring');

const https = require('https');


module.exports = function (image) {
    image = image.split('data:image/png;base64,')[1];
    let param = qs.stringify({
        access_token: '24.e8f0a9320b0b181e40618e54582ff5ce.2592000.1564810598.282335-16711549',
    })
    return new Promise((resolve, reject) => {

        request({
            url:'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            form: {
                access_token: '24.e8f0a9320b0b181e40618e54582ff5ce.2592000.1564810598.282335-16711549',
                image,
                detect_direction: true,
                probability: true
            }
        }, function (err, res, body) {
            if (!err && res.statusCode === 200) {
                resolve(body)
            } else {
                reject(body)
            }
        })


    })




}
