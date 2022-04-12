cd ../graphql 
rm -fr node_modules/
docker build -t graphql .

cd ..
docker-compose up -d
cd utils

./reloadBdd.sh
