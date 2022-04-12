@ECHO OFF
@cd ../graphql 
@RMDIR /S /Q "./node_modules/"
docker build -t graphql .

@cd ..
docker-compose up -d
@cd utils

reloadBdd.bat
