# Data visualization site of the delays of high speed trains in France

University project proposed in the subject "Non-traditional databases" in 1st year of MSc of Computer Science at the University of Caen Normandy. The main objective was to build a data visualization site on the data of our choice. These data could be processed, rearranged in order to be inserted in MongoDB and thus, use the advantage of NoSQL databases.

## Table of contents

  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Setup](#setup)
  - [Commands](#commands)
  - [Pages](#pages)
  - [Authors](#authors)
  - [License](#license)

## Introduction
In this project supervised by [François RIOULT](https://rioultf.users.greyc.fr/drupal/welcome-francois-rioults-home-page), the main objective was to build a data visualization site on the data of our choice. These data could be processed, rearranged in order to be inserted in MongoDB and thus, use the advantage of NoSQL databases. We realized a visualization site about the delays of the TGV (High Speed Trains) managed by the SNCF.


# Setup
Docker must be installed on the machine as well as the `jq` utility via this command:
```sh
$ sudo apt install -y jq
```

## Commands
To launch our application for the first time, please follow these commands:
```sh
$ cd utils
$ ./create.sh
```

Thereafter, you can only perform these commands to avoid recreating the `graphql` image:
```sh
$ pwd
/path/to/project/root/folder/
$ docker-compose up -d
```

Finally, to shut down the application you will perform the following commands:
```sh
$ pwd
/path/to/project/root/folder/
$ docker-compose down
```

## Pages
There are 2 data pages and 2 additional pages.

The two additional pages are the home page (allowing to select a line to study) and an error page when the requested page does not exist
The two other pages are :
- http://localhost:8000/?url=info : page showing the information about the selected routes
- http://localhost:8000/?url=map : page showing all stations and routes on the TGV network in France

## Authors
- [PIERRE Corentin (21803752)](https://github.com/coco-ia)
- [LETELLIER Guillaume](https://github.com/Guigui14460)

## License
Project under the "GNU General Public License v3.0" license.
