const $andruet = andruet();
const KEY_sk = "CookieHZ";

var sk = new URL($request.url).searchParams.get("sk");
if (sk && sk != $andruet.read(KEY_sk)) {
  $andruet.log("before cookie: " + $andruet.read(KEY_sk));
  $andruet.write(sk, KEY_sk);
  $andruet.log("after cookie: " + $andruet.read(KEY_sk));
  $andruet.notify("华住签到", "写入华住Cookie成功 🎉", sk);
} else if(sk == undefined){
  $andruet.log("Bad URL: " + $request.url);
}

$andruet.done();

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
