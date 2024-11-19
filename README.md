
## 简介

7X24小时在线要饭🍚，欢迎👏各位老板打赏，打赏一分也是爱

1. 基于NodeJS，仅使用express框架，依赖小
2. 不用数据库，打赏记录直接存储于本地json文件之中，十分轻量化
3. 零成本，支持一键docker部署
4. 移动端交互体验超棒，一键打赏，免去app来回切换
5. 微信内分享打赏更方便，长按即可

### Fork说明

项目Fork自[https://github.com/realzsan3/alms](https://github.com/realzsan3/alms)，在原项目的基础上做了以下调整：

1. 移除`leancloud`依赖，改为使用`express`作为服务器（自己有服务器的情况下，没必要使用第三方服务）
2. 移除BTC支持（大部分人用不上，干脆删掉）
3. 支持Docker一键部署（鄙人比较喜欢使用Docker一把梭）

## 运行项目

```shell
# 克隆代码
git clone https://github.com/iszhouhua/alms.git
# 安装依赖
npm install
# 启动项目
npm run start
```

浏览器打开`http://127.0.0.1:3000`即可

## 修改配置

### 替换为自己的收款码

在`images`内分别替换微信、支付宝的收款码

- 微信收款码：`public/images/wechat.jpg`
- 支付宝收款码：`public/images/alipay.jpg`

### 替换为自己的scheme url

支付宝替换：`qrcode`后面的值改为自己的收款码链接

`alipays://platformapi/startapp?saId=10000007&qrcode=https%3A%2F%2Fqr.alipay.com%2Ffkx10077q8ap03alafv4b96`

## Docker部署

```shell
# 拉取镜像
docker pull registry.cn-shenzhen.aliyuncs.com/iszhouhua/alms:latest
# 运行镜像
docker run -d --name alms -p 3000:3000 -v $(pwd)/data:/data registry.cn-shenzhen.aliyuncs.com/iszhouhua/alms:latest
```

布施记录默认存储于镜像内的`/data/donation.json`文件之中
