#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.10.0 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.10.0

# build dist
pnpm build

# build docker image
docker build -t jetlinks-ui-vue:2.12 .

# docker save image to tar
docker save -o jetlinks-ui.tar jetlinks-ui-vue:2.12