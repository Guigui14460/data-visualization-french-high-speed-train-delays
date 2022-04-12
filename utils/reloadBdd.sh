rm -rf data/out
mkdir data/out

python3 data/format_trains.py
python3 data/format_gares.py
python3 data/format_lines.py
sudo docker exec -i mongo bash -c 'mongo --eval "db.train.drop()" --authenticationDatabase admin -u root -p example DM '
sudo docker exec -i mongo bash -c 'mongo --eval "db.gare.drop()" --authenticationDatabase admin -u root -p example DM '
sudo docker exec -i mongo bash -c 'mongo --eval "db.lines.drop()" --authenticationDatabase admin -u root -p example DM '
sudo docker exec -i mongo bash -c 'mongo --eval "db.stations.drop()" --authenticationDatabase admin -u root -p example DM '
jq -c . data/out/gare.json | sudo docker exec -i mongo bash -c 'mongoimport --authenticationDatabase admin --db=DM --collection=gare --jsonArray -u root -p example'
jq -c . data/out/train2.json | sudo docker exec -i mongo bash -c 'mongoimport --authenticationDatabase admin --db=DM --collection=train --jsonArray -u root -p example'
jq -c . data/out/circuits-list2.json | sudo docker exec -i mongo bash -c 'mongoimport --authenticationDatabase admin --db=DM --collection=lines --jsonArray -u root -p example'
jq -c . data/out/formatted-list-of-stations.json | sudo docker exec -i mongo bash -c 'mongoimport --authenticationDatabase admin --db=DM --collection=stations --jsonArray -u root -p example'
