/**
 * 남는 문자열 만큼 앞에 0을 붙이는 함수
 * 
 * @param {Number} strSize 총 문장려 갯수
 * @param {String} str 0을 붙일 문자열
 * @return {String} result 0이 붙은 문자열
 */
const fillZero = (strSize, str) => {
  str = str.toString()

  return str.length >= strSize ? str : new Array(strSize - str.length + 1).join('0') + str;//남는 길이만큼 0으로 채움
}
export default { fillZero }