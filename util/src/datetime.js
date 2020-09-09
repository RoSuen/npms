/**
 * 日期辅助类
 */
export default class DateTime {
  baseDate = new Date;
  currentDate = new Date(this.baseDate);

  // 变化量
  // deltaDay = 0;
  // 启用年月步进时释放
  // deltaMonth = 0; (无需使用)
  // deltaYear = 0;

  // 格式化输出日期月份
  format = this.$format;

  // 计算属性
  get $format() {
    return {
      day:      DateTime.formatDate(this.currentDate),
      month:    DateTime.formatMonth(this.currentDate),
      dotMonth: DateTime.formatDate(this.currentDate).slice(0, -3)
                        .replace('/', '.'),
    }
  }

  constructor(datetime = null) {
    if ( !datetime ) return;

    // 复制 DateTime 对象
    this.baseDate = new Date(datetime.baseDate);
    this.currentDate = new Date(datetime.currentDate);
    this.format = this.$format;
  }

  // 自然日时间段
  getDayRange() {
    // 当天0:0:0.0的数值
    let begin = new Date(this.currentDate);
    begin.setHours(0, 0, 0, 0);
    begin = begin.valueOf() / 1000;   // 当天0:0:0的ts

    return {
      begin,
      end: begin + 86400,             // 一天的秒数，次日0:0:0
    }
  }

  // 前后切换日
  nextDay() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.format = this.$format;
    return this
  }

  prevDay() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.format = this.$format;
    return this
  }

  resetDay() {
    this.currentDate = new Date(this.baseDate);
    this.format = this.$format
  }

  // 自然月时间段
  getMonthRange() {
    let year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth();

    let begin = new Date(year, month);
    let end   = new Date(year, month + 1);

    return {
      begin:   begin.getTime() / 1000,
      end:     end.getTime() / 1000,
    }
  }

  // 前后切换月
  nextMonth() {
    this.currentDate.setDate(1);    // 避免月末切换跳进次月
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.format = this.$format;
    return this
  }

  prevMonth() {
    this.currentDate.setDate(1);    // 避免月末切换跳进次月
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.format = this.$format;
    return this
  }

  resetMonth = () => this.resetDay();

  /**
   * 切换年
   *
  nextYear() { this.deltaYear++ }
  prevYear() { this.deltaYear-- }
  resetYear() { this.deltaYear = 0 }
  */

  // 格式化显示时间 HH:MM:SS
  static formatTime(date) {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [hour, minute, second].map(DateTime.formatNumber).join(':')
  }

  // 格式化显示日期 YYYY/MM/DD
  static formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(DateTime.formatNumber).join('/')
  }

  // 格式化显示月份 YYYY年M月
  static formatMonth(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    return `${year}年${month}月`
  }

  // 格式化为2位或4位数字字符串
  static formatNumber = n => n > 1000 ? `${n}` : `0${n}`.slice(-2);

  // 日期时间对象转换为json结构
  static _convertToJSON(date) {
    if ( !(date instanceof Date) ) return {};

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      milliSecond: date.getMilliseconds(),
    }
  }

  // 日期时间的json结构转换为对象
  static _convertToDate(json) {
    if ( !json ) return new Date();

    return new Date( json.year, json.month - 1, json.day,
      json.hour, json.minute, json.second, json.milliSecond )
  }
}