#---------------------------------------------------------------
#                       DANGOUS 危险操作
#rm -rf ./dist
#rm -rf ./src/modules/device-manager-ui/dist
#---------------------------------------------------------------
# customer-manager
pnpm build:modules --modules=customer-manager

cp -r ./dist ./src/modules/customer-manager-ui/


# device-manager
pnpm build:modules --modules=device-manager

cp -r ./dist ./src/modules/device-manager-ui/

# authentication-manager
pnpm build:modules --modules=authentication-manager

cp -r ./dist ./src/modules/authentication-manager-ui/

cd modules
mvn clean package -Pui-package
mvn install -Pui-package