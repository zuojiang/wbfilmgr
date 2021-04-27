# wbfilmgr

## Description

A web based file manager.

![qrdoe](https://raw.githubusercontent.com/zuojiang/wbfilmgr/1.x.x/screenshots/terminal-1.3.0.png)

![actions](https://raw.githubusercontent.com/zuojiang/wbfilmgr/1.x.x/screenshots/actions-1.3.0.png)

![file-actions](https://raw.githubusercontent.com/zuojiang/wbfilmgr/1.x.x/screenshots/file-actions-1.3.0.png)

## Usage

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

## Upload by CLI

```sh
npm install file-slicer --global
file-slicer upload http://user:pass@ip:3000/rest/upload?dirPath=html ./dist
```

## Notes

Use `--gm-support` option after installing
[GraphicsMagick](http://www.graphicsmagick.org/)
or
[ImageMagick](http://www.imagemagick.org/).

## License

MIT
