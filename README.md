# Site de visualisation de données

Notre site porte sur les retards des TGV (Trains à Grande Vitesse) gérés par la SNCF.

## Commandes
Pour lancer la première fois notre application, veuillez suivre les commandes suivantes :
```sh
$ cd utils
$ ./create.sh
```

Par la suite, vous pouvez seulement réaliser ces commandes pour éviter de recréer l'image `graphql` :
```sh
$ pwd
/path/to/project/root/folder/
$ docker-compose up -d
```

Enfin, pour couper l'application vous réaliserez les commandes suivantes :
```sh
$ pwd
/path/to/project/root/folder/
$ docker-compose down
```

## Pages
Il y a 2 pages de données et 2 pages supplémentaires.

Les deux pages supplémentaires sont la page d'accueil (permettant de sélectionner une ligne à étudier) et une page d'erreur quand la page demandée n'existe pas
Les deux autres pages sont :
- http://localhost:8000/?url=info : page montrant les informations sur les trajets sélectionnés
- http://localhost:8000/?url=map : page montrant l'ensemble des gares et trajets sur le réseau TGV en France métropolitaine
