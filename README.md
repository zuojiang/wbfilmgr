wbfilmgr
===

Description
---

A web based file manager.

![qrdoe](https://raw.githubusercontent.com/zuojiang/wbfilmgr/1.x.x/screenshots/terminal-1.0.0.png)

![actions](https://raw.githubusercontent.com/zuojiang/wbfilmgr/1.x.x/screenshots/actions-1.0.0.png)

![select files](https://raw.githubusercontent.com/zuojiang/wbfilmgr/1.x.x/screenshots/selectfile-1.0.0.png)

Usage
---
```sh
npm install wbfilmgr --global
wbfilmgr /etc -p 3000 -u users.json
wbfilmgr --help
```

users.json
```json
{
  "username": "password"
}
```

Upload by CLI
---
```sh
npm install file-slicer --global
file-slicer upload http://user:pass@ip:3000/rest/upload?dirPath=html ./dist
```

License
---

MIT
