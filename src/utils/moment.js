import moment from 'moment'

moment.defineLocale('zh-tw', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsParseExact: true,
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'A h 點 mm 分',
    LTS: 'A h 點 m 分 s 秒',
    L: 'YYYY 年 MMM D 日',
    LL: 'YYYY 年 MMM D 日',
    LLL: 'YYYY 年 MMM D 日 Ah 點 mm 分',
    LLLL: 'YYYY 年 MMM D 日 dddd A h 點 mm 分',
    l: 'YYYY 年 MMM D 日',
    ll: 'YYYY 年 MMM D 日',
    lll: 'YYYY 年 MMM D 日 A h 點 mm 分',
    llll: 'YYYY 年 MMM D 日 dddd A h 點 mm 分'
  },
  calendar: {
    sameDay: '[今天]LT',
    nextDay: '[明天]LT',
    nextWeek: '[下]ddddLT',
    lastDay: '[昨天]LT',
    lastWeek: '[上]ddddLT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s內',
    past: '%s前',
    s: '1 秒',
    ss: '%d 秒',
    m: '1 分鐘',
    mm: '%d 分鐘',
    h: '1 小時',
    hh: '%d 小時',
    d: '1 天',
    dd: '%d 天',
    M: '1 個月',
    MM: '%d 個月',
    y: '1 年',
    yy: '%d 年'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
  ordinal(number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '日'
      case 'M':
        return number + '月'
      case 'w':
      case 'W':
        return number + '週'
      default:
        return number
    }
  },
  meridiemParse: /早上|上午|中午|下午|晚上/,
  meridiem(hour, minute, isLower) {
    if (hour < 9) {
      return '早上'
    } else if (hour < 11 && minute < 30) {
      return '上午'
    } else if (hour < 13 && minute < 30) {
      return '中午'
    } else if (hour < 18) {
      return '下午'
    }
    return '晚上'
  },
  isPM(input) {
    return input === '下午' || input === '晚上'
  }
})
