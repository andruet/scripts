const $andruet = andruet();
const KEY_sk = "CookieHZ";

var url_fetch_sign = {
  url: "https://newactivity.huazhu.com/v1/pointStore/signIn",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    Referer: "https://campaign.huazhu.com/",
  },
};

signHuaZhu();

function signHuaZhu() {
  var sk = $andruet.read(KEY_sk);
  if (!sk) {
    $andruet.notify("华住签到", "签到失败", "未获取到cookie");
    return $andruet.done();
  }
  var day = new Date().getDate();
  url_fetch_sign.body = `day=${day}&state=0&channel=APP&source=APP&sk=${sk}`;
  $andruet.post(url_fetch_sign, function (error, response, data) {
    if (error) {
      $andruet.notify("华住签到", "请求失败", JSON.stringify(e));
      $andruet.log(url_fetch_sign.body);
    } else {
      try {
        var result = JSON.parse(data);
        if (result.code != 200) {
          $andruet.notify("华住签到失败", "code错误", data);
        } else if (result.data.isSign) {
          $andruet.notify("华住签到成功", "今日已签到", "");
        } else {
          $andruet.notify("华住签到成功", "今日首次签到", "");
        }
      } catch (e) {
        $andruet.notify("华住签到失败", "数据处理异常", data);
        $andruet.log(url_fetch_sign.body);
        $andruet.log(JSON.stringify(response));
        $andruet.log(JSON.stringify(response.headers["Cookie"]));
      }
    }
    return $andruet.done();
  });
}

function andruet() {
  const isRequest = typeof $request != "undefined";
  const isSurge = typeof $httpClient != "undefined";
  const isQuanX = typeof $task != "undefined";
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message);
    if (isSurge) $notification.post(title, subtitle, message);
  };
  const log = (message) => {
    console.log(message);
  };
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key);
    if (isSurge) return $persistentStore.write(value, key);
  };
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key);
    if (isSurge) return $persistentStore.read(key);
  };
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status;
      } else if (response.statusCode) {
        response["status"] = response.statusCode;
      }
    }
    return response;
  };
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string")
        options = {
          url: options,
        };
      options["method"] = "GET";
      $task.fetch(options).then(
        (response) => {
          callback(null, adapterStatus(response), response.body);
        },
        (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge)
      $httpClient.get(options, (error, response, body) => {
        callback(error, adapterStatus(response), body);
      });
  };
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string")
        options = {
          url: options,
        };
      options["method"] = "POST";
      $task.fetch(options).then(
        (response) => {
          callback(null, adapterStatus(response), response.body);
        },
        (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge) {
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body);
      });
    }
  };
  const done = (value = {}) => {
    if (isQuanX) return $done(value);
    if (isSurge) isRequest ? $done(value) : $done();
  };
  return {
    isRequest,
    notify,
    log,
    write,
    read,
    get,
    post,
    done,
  };
}
