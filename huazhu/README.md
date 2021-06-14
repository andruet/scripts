# 华住签到

## 配置 (QuanX)

```properties
[MITM]
newactivity.huazhu.com

[rewrite_local]
# 190及以后版本
^https:\/\/newactivity.huazhu.com\/.+\?sk=.+$ url script-request-body https://raw.githubusercontent.com/andruet/scripts/main/huazhu/huazhu.cookie.js

[task_local]
1 12 * * * huazhu.js
```
