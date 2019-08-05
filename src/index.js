//layer.layui.com/
const vconsole = new VConsole();

var filters = ['grayscale', 'sepia', 'blur', 'brightness', 'contrast', 'hue-rotate',
  'hue-rotate2', 'hue-rotate3', 'saturate', 'invert', ''];

//访问用户媒体设备的兼容方法
function getUserMedia(constrains, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
    //最新标准API
    navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
  } else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    navigator.webkitGetUserMedia(constrains).then(success).catch(error);
  } else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    navagator.mozGetUserMedia(constrains).then(success).catch(error);
  } else if (navigator.getUserMedia) {
    //旧版API
    navigator.getUserMedia(constrains).then(success).catch(error);
  }
}

function gotSources(sourceInfos) {
  for (var i = 0; i < sourceInfos.length; i++) {
    var sourceInfo = sourceInfos[i];

    if (sourceInfo.kind == 'video') {
      // console.log(sourceInfo);
    }
  }
}


var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


var hasUserMedia = Boolean(navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

// 设备 有媒体
if (hasUserMedia) {
  if (typeof MediaStreamTrack.getSources !== 'undefined') {
    MediaStreamTrack.getSources(gotSources);
  }
}

var exArray = [];
let mediaOption = null;
if (hasUserMedia) {
  // 获取媒体 设备源
  navigator.mediaDevices.enumerateDevices()
           .then(function (sources) {
             var videoSources = sources.forEach(function (source) {
               if (source.kind === 'videoinput') {
                 exArray.push(source)
               }
             });

             // 输入设备id
             let id = exArray[1] && exArray[1].deviceId;

             // mediaOption = {
             //   'video': {
             //     //  deviceId:id,
             //     'optional': [{
             //       sourceId: id//0为前置摄像头，1为后置  deviceId groupId
             //     }]
             //   },
             // }

             mediaOption = {
               'video':true
             }

             console.log('设备源 => ', JSON.stringify(mediaOption));
           })
    .catch((error)=>{
      console.log('获取设备源失败')
    })
} else {
  alert("你的浏览器不支持访问用户媒体设备");
}

//成功的回调函数
function success(stream) {
  //兼容webkit内核浏览器
  var CompatibleURL = window.URL || window.webkitURL;
  //将视频流设置为video元素的源
  try {
    // 此处的代码将会报错  解决的办法是将video的srcObject属性指向stream即可
    video.src = CompatibleURL.createObjectURL(stream);
  } catch (err) {
    video.srcObject = stream
  }
  //播放视频
  video.play();

}

//异常的回调函数
function error(error) {

  let tipStr = '';

  switch (error.name) {
    case 'AbortError':
      tipStr = '硬件问题';
      break;
    case 'NotAllowedError':
      tipStr = '用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。';
      break;
    case 'NotFoundError':
      tipStr = '找不到满足请求参数的媒体类型。'
      break;
    case 'NotReadableError':
            tipStr = '操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。'
      break;
    case 'OverConstrainedError':
            tipStr = '指定的要求无法被设备满足。'
      break;
    case 'SecurityError':
            tipStr = '安全错误，在getUserMedia() 被调用的 Document上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。'
      break;
    case 'TypeError':
            tipStr = '类型错误，constraints对象未设置［空］，或者都被设置为false。'
      break;
  }

  console.log("访问用户媒体设备失败 => "+ error.name+'\n'+'失败原因 => '+ tipStr+'('+error.message+'+)\n');


  // AbortError：硬件问题
  // NotAllowedError：用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。
  // NotFoundError：找不到满足请求参数的媒体类型。
  // NotReadableError：操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。
  // OverConstrainedError：指定的要求无法被设备满足。
  // SecurityError：安全错误，在getUserMedia() 被调用的 Document上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。
  // TypeError：类型错误，constraints对象未设置［空］，或者都被设置为false。
}

// var idx = 0;
// document.getElementById('video').addEventListener('click', function (e) {
//   var el = e.target;
//   el.className = '';
//   var effect = filters[idx++ % filters.length]; // loop through filters.
//   if (effect) {
//     el.classList.add(effect);
//   }
// })


//注册拍照按钮的单击事件
document.getElementById("capture").addEventListener("click", function () {

  if(mediaOption){
    getUserMedia(
      mediaOption,
      success,
      error
    );
  }

  // //绘制画面
  // let ratio = getPixelRatio(context);
  // context.drawImage(video, 0, 0, 300 * ratio, 400 * ratio);
  // sendBase64(canvas.toDataURL("image/jpg", 1))
});


function getPixelRatio(context) {
  let backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

function createReUi(data) {
  let group = ["A", "B", "C", "D", "E"];
  // console.log(data)
  let userResUi = data.bonusRes.map((item, idx) => {
    return `<li class="res-item clear-fix">
         <div class="no fl">${ group[idx] } : </div>
         <p class="ball-list fl">
             ${ item.red.map(redball => {
      return `<span ${ redball.isTrue ? 'true' : '' }>${ redball.num }</span>`
    }).join('') }
             ${ item.blue.map(blueball => {
      return `<span class="blue ${ blueball.isTrue ? 'true' : '' }">${ blueball.num }</span>`
    }).join('') }
         </p>
         <div class="res-text fr">${ item.message }</div>
     </li>`
  }).join('');

  let realResUi = `<b class="label">开奖号码：</b>
        ${ data.realRes.red.map(redball => {
    return `<span>${ redball }</span>`
  }).join('') }
        <span   class="blue">${ data.realRes.blue }</span>`;

  document.querySelector('#success_layer .res-real').innerHtml = realResUi
  document.querySelector('#success_layer .res-list').innerHtml = userResUi

}


function sendBase64(base64) {

  let loader = layer.load(1, { time: 10 * 1000 })
  // console.log(+new Date)

  let param = {
    base64
  };

  console.log(`http://${ location.hostname }:3369/analysis`)
  // $.ajax({
  //   type:'post',
  //   url:`http://${ location.hostname }:3369/analysis`,
  //   data:{
  //     base64
  //   },
  //   success(res){
  //     console.log(res);
  //   },
  //   error(err){
  //     console.log(err)
  //   }
  // });

  axios.post(`http://${ location.hostname }:3369/analysis`, param).then((res) => {
    console.timeEnd('base64')

    console.log(res.data)
    layer.close(loader);

    if (res.data && res.data.code === 0) {

      let { data } = res.data;
      createReUi(data);

      layer.open({
        title: `扫描结果：${ data.version }期`,
        type: 1,
        content: $('#success_layer_warp').html()
      });
    } else {

      layer.open({
        title: '信息',
        content: res.data.message
      });
    }

  }).catch((err, res, c) => {
    console.log(err);
    layer.close(loader);
    layer.open({
      title: '信息',
      content: '请求出错请重试'
    });

  })
}