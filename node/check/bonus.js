module.exports = (data, lottery_history) => {
  let { version, key } = data;
  console.log(data)
  let curData = lottery_history[key][version];
  if (!curData) {
    return '开奖历史获取失败'
  }

  let splitNum = key === 'ssq' ? 6 : 5;

  let curBalls = curData.lottery_res.split(',');
  let curRedBalls = curBalls.slice(0, splitNum);
  let curBlueBalls = curBalls.slice(splitNum);

  if (!data.ballArr || !(data.ballArr instanceof Array)) {
    return '没有识别出彩票号码'
  }

  let redBalls = item.slice(0, splitNum)
  let blueBalls = item.slice(splitNum)


  let blueArr = []; // 包含号码 以及是否正确 数组对象

  let blueNum = blueBalls.reduce((total, item) => {
    let isTrue = curBlueBalls.indexOf(item) !== -1
    let num = curBlueBalls.indexOf(item) !== -1 ? 1 : 0
    blueArr.push({
      num: item,
      isTrue
    });
    return total + num
  }, 0)

  let redArr = [];// 包含号码 以及是否正确 数组对象
  let redNum = redBalls.reduce((total, item) => {
    let isTrue = curRedBalls.indexOf(item) !== -1
    let num = isTrue ? 1 : 0;
    redArr.push({
      num: item,
      isTrue
    });
    return total + num
  }, 0)


  let bonusRes;
  if (key === 'ssq') {
    bonusRes = data.ballArr.map(item => {
      let message = '';
      if (blueNum === 1 && redNum === 6) {
        message = '一等奖  浮动奖金'
      } else if (blueNum === 0 && redNum === 6) {
        message = '二等奖 浮动奖金'
      } else if (blueNum === 1 && redNum === 5) {
        message = '三等奖 浮动奖金'
      } else if (blueNum === 1 && redNum === 4 || blueNum === 0 && redNum === 5) {
        message = '四等奖  200元'
      } else if (blueNum === 0 && redNum === 4 || blueNum === 1 && redNum === 3) {
        message = '五等奖  10元'
      } else if (blueNum === 1 && redNum === 0 || blueNum === 1 && redNum === 1 || blueNum === 1 && redNum === 2 || blueNum === 0 && redNum === 3) {
        message = '六等奖  5元'
      } else {
        message = '没中奖'
      }
      return {
        message,
        red: redArr,
        blue: blueArr,
        blueNum,
        redNum
      }
    });
  } else {
    bonusRes = data.ballArr.map(item => {

      let message = '';

      if (blueNum === 2 && redNum === 5) {
        message = '一等奖  浮动奖金'
      } else if (blueNum === 1 && redNum === 5) {
        message = '二等奖 浮动奖金'
      } else if (blueNum === 0 && redNum === 5) {
        message = '三等奖 10000元'
      } else if (blueNum === 2 && redNum === 4) {
        message = '四等奖 3000元'
      } else if (blueNum === 1 && redNum === 4) {
        message = '五等奖  300元'
      } else if (blueNum === 2 && redNum === 3) {
        message = '六等奖  200元'
      } else if (blueNum === 0 && redNum === 4) {
        message = '七等奖  100元'
      } else if (blueNum === 1 && redNum === 3 || blueNum === 2 && redNum === 2) {
        message = '八等奖  15元'
      } else if (blueNum === 2 && redNum === 0 || blueNum === 1 && redNum === 2 || blueNum === 0 && redNum === 3 || blueNum === 2 && redNum === 1) {
        message = '九等奖  5元'
      } else {
        message = '没中奖'
      }

      return {
        message,
        red: redArr,
        blue: blueArr,
        blueNum,
        redNum
      }
    });
  }

  return {
    code: 0,
    version,
    realRes: {
      red: curRedBalls,
      blue: curBlueBalls
    },
    bonusRes
  }
}