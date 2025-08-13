#---------------------------------------------------------------
#                       DANGOUS 危险操作
#rm -rf ./dist
#rm -rf ./src/modules/device-manager-ui/dist
#---------------------------------------------------------------


pnpm build:modules --modules=device-manager

cp -r ./dist ./src/modules/device-manager-ui/

cd ./src/modules/device-manager-ui/
mvn clean package -Pui-package
mvn install -Pui-package