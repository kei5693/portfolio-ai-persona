import dayjs from'dayjs'
import Vue from 'vue'

/**
 * 숫자에 콤마를 붙이기
 * 
 * @method comma
 * @param {Number} val 숫자 정보
 * @return {String} result 콤마가 들어간 숫자
 */
Vue.filter('comma', val => {
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})

/**
 * 현재 날짜로 몇시간 전인지 구하기(24시간 넘어간 경우 날짜로 반환)
 * @param value 업로드한 날짜
 */
Vue.filter('timeForToday', value => {
  const today = dayjs();
  const timeValue = dayjs(value);

  const diffMinute = Math.floor(today.diff(timeValue, 'minute', true))
  if(diffMinute < 1) return '방금전';
  if(diffMinute < 60) return `${diffMinute}분전`;

  const diffHour = Math.floor(today.diff(timeValue, 'hour', true))
  if(diffHour < 24) return `${diffHour}시간전`

  const diffDay = Math.floor(diffHour / 24)
  if(diffDay < 7) return `${diffDay}일전`
  if(diffDay < 28){
    return `${Math.floor(diffDay/7)}주전`
  }
  
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}개월전`;

  return `${Math.floor(diffMonth / 12)}년전`;
})

/**
 * 현재 날짜로 몇시간 전인지 구하기(24시간 넘어간 경우 날짜로 반환)
 * 
 * @method beforeTime
 * @param {String} strDate 현재 날짜
 * @return {String} result 몇시간 전 날짜
 */
Vue.filter('beforeTime', strDate => {
  const strDates = strDate.split(' ')
  const dates = strDates[0]
  const times = strDates[1]

  const year = parseInt(dates.substring(0, 4), 10)
  const month = parseInt(dates.substring(5, 7), 10) - 1
  const day = parseInt(dates.substring(8, 10), 10)

  const hour = parseInt(times.substring(0, 2), 10)
  const min = parseInt(times.substring(3, 5), 10)
  const sec = parseInt(times.substring(6, 8), 10)

  let currentDate = new Date()
  let date = new Date(year, month, day, hour, min, sec)
  let diffTime = Math.round((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60)

  console.log(strDate + "    =    " + date)

  return diffTime > 24 ? strDate : `${diffTime}시간 전`
})

/**
 * 배열을 콤마 문자열로 반환
 * 
 * @method arrayToCommaStr
 * @param {Array} array 배열
 * @return {String} result 배열을 콤마 문자열로 반환
 */
Vue.filter('arrayToCommaStr', array => {
  return array === undefined || array === null ? '' : array.join()
})

/**
 * 날짜를 콘텐츠 뷰에 맞는 날짜로 변경
 * 
 * @method contentViewDate
 * @param {String} value 날짜(예. 2021-07-29 16:00:00)
 * @return {String} result 콘텐츠 뷰 날짜 타입(YY.MM.DD)
 */
Vue.filter('contentDate', value => {
  let year = value.substring(2, 4)
  let month = value.substring(5, 7)
  let day = value.substring(8, 10)

  return `${year}.${month}.${day}`
})