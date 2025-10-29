#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.10.0 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.10.0

docker build -t jetlinks-ui-vue:2.12 .

docker run -d --name jetlinks-ui -e API_BASE_PATH=http://192.168.2.137:8848/ -e SERVER_NAME=jetlinks -p 8080:80 jetlinks-ui-vue:2.12