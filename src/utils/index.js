/**
 * 날짜/시간을 지정된 형식의 문자열로 변환합니다.
 * @param {(Date|string|number)} time - 변환할 날짜/시간. Date 객체, 타임스탬프(문자열/숫자), ISO 8601 문자열 등을 지원합니다.
 * @param {string} [cFormat='{y}-{m}-{d} {h}:{i}:{s}'] - 출력 형식. 기본값은 '{y}-{m}-{d} {h}:{i}:{s}'
 * @returns {string | null} 형식화된 날짜/시간 문자열 또는 잘못된 입력의 경우 null
 *
 * @example
 * // ISO 8601 문자열 변환
 * parseTime('2024-12-02T12:55:03.338Z')
 * // 결과: '2024-12-02 12:55:03'
 *
 * // 타임스탬프(밀리초) 변환
 * parseTime(1548221490638)
 * // 결과: '2019-01-23 11:24:50'
 *
 * // Date 객체 변환
 * parseTime(new Date())
 * // 결과: '2024-12-06 15:30:00'
 *
 * // 커스텀 포맷 사용
 * parseTime(new Date(), '{y}년 {m}월 {d}일 {h}시 {i}분 {s}초 {a}요일')
 * // 결과: '2024년 12월 06일 15시 30분 00초 금요일'
 *
 * @supported 포맷 파라미터:
 * - {y}: 년도 (예: 2024)
 * - {m}: 월 (01-12)
 * - {d}: 일 (01-31)
 * - {h}: 시 (00-23)
 * - {i}: 분 (00-59)
 * - {s}: 초 (00-59)
 * - {a}: 요일 (일-토)
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;

  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else if (time.includes('T') && time.includes('Z')) {
        // ISO 8601 형식 처리 (2024-12-02T12:55:03.338Z)
        date = new Date(time);
        return formatDate(date, format);
      } else {
        // support safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }

  return formatDate(date, format);
}

/**
 * 날짜를 지정된 형식의 문자열로 변환합니다.
 * @param {Date} date - Date 객체
 * @param {string} format - 출력 형식 문자열
 * @returns {string} 형식화된 날짜/시간 문자열
 *
 * @example
 * // 기본 날짜 형식
 * formatDate(new Date(), '{y}-{m}-{d}')
 * // 결과: '2024-12-06'
 *
 * // 요일 포함 형식
 * formatDate(new Date(), '{y}년 {m}월 {d}일 {a}요일')
 * // 결과: '2024년 12월 06일 금요일'
 *
 * // 시간 포함 형식
 * formatDate(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
 * // 결과: '2024-12-06 15:30:25'
 *
 * @supported 포맷 파라미터:
 * - {y}: 년도 (예: 2024)
 * - {m}: 월 (01-12)
 * - {d}: 일 (01-31)
 * - {h}: 시 (00-23)
 * - {i}: 분 (00-59)
 * - {s}: 초 (00-59)
 * - {a}: 요일 (일-토)
 */
export function formatDate(date, format) {
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    if (key === 'a') {
      return ['일', '월', '화', '수', '목', '금', '토'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * 날짜를 상대적 시간 또는 지정된 형식으로 변환합니다.
 * @param {number} time - 타임스탬프
 * @param {string} [option] - 출력 형식 (옵션). 미지정시 상대적 시간 또는 기본 형식으로 출력
 * @returns {string} 형식화된 날짜/시간 문자열
 *
 * @example
 * // 상대적 시간 표시
 * formatTime(Date.now() - 1000)     // 결과: '방금 전'
 * formatTime(Date.now() - 3600000)  // 결과: '1시간 전'
 *
 * // 지정된 형식으로 출력
 * formatTime(Date.now(), '{y}-{m}-{d}')  // 결과: '2024-12-06'
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d.getTime()) / 1000;

  if (diff < 30) {
    return '방금 전';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '분 전';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '시간 전';
  } else if (diff < 3600 * 24 * 2) {
    return '1일 전';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}시 ${d.getMinutes()}분`;
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach((v) => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
* HTML 문자열에서 태그를 제거하고 순수 텍스트만 추출합니다.
* @param {string} val - HTML 문자열
* @returns {string} 태그가 제거된 순수 텍스트
*
* @example
* html2Text('<p>Hello <b>World</b>!</p>')
* // 결과: 'Hello World!'
*
* html2Text('<div>Line 1<br>Line 2</div>')
* // 결과: 'Line 1Line 2'
*/
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * 일반 텍스트를 HTML로 변환합니다. 줄바꿈(\n)을 <br> 태그로 변환합니다.
 * @param {string} val - 변환할 텍스트
 * @returns {string} HTML로 변환된 문자열
 *
 * @example
 * text2Html('Hello\nWorld!')
 * // 결과: 'Hello<br>World!'
 *
 * text2Html('Line 1\nLine 2\nLine 3')
 * // 결과: 'Line 1<br>Line 2<br>Line 3'
 *
 * text2Html('No line break')
 * // 결과: 'No line break'
 */
export function text2Html(val) {
  if (!val) return '';
  return val.replace(/\n/g, '<br>');
}


/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536 + '') + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}
