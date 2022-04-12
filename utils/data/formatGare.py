import json
import re
import urllib.request




with urllib.request.urlopen("http://localhost:4000/?query={train{Departure}}") as f:
    a =f.read()
    j = json.loads(a)
    gares = j["data"]["train"]
    listStation = list()
    for item in gares:
        listStation.append(item["Departure"])





s = open("./data/referentiel-gares-voyageurs.json", "r")
j = json.load(s)
jsonO = list()


for item in j:

    f = item["fields"]
    d = dict()
    

   
    
    if "wgs_84" in f:
        station = f["rg_libelle"]

        if re.match('^GARES [ABC]', station):

            station = station[8:]

        else:
            if re.match('^GARES ', station):
                station = station[6:]
            else:
                if re.match('^GARE ', station):
                    station = station[5:]
                else:
                    station = station
                
        
        if station in listStation:
                    
            d["station"]  = station  
            d["geo"] =   [f["wgs_84"][1],f["wgs_84"][0]]
            d["name"] = f["gare_alias_libelle_noncontraint"]
            d["city"] = f["commune_libellemin"]
            d["uic"] = f["uic_code"]
            jsonO.append(d)


f = open("./gare.json", "w")
f.write(json.dumps(jsonO, indent=4))
f.close()
