import json
import re


listStation = set()
with open("./data/out/train2.json", "r") as file:
    loaded_file = json.load(file)

    for o in loaded_file:
        listStation.add(o["Depart"])

data = list()
loaded_file = None
with open("./data/in/referentiel-gares-voyageurs.json", "r") as file:
    loaded_file = json.load(file)

for item in loaded_file:
    fields = item["fields"]
    d = dict()

    if "wgs_84" in fields:
        station = fields["rg_libelle"]

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
            d["station"] = station  
            d["geo"] = [fields["wgs_84"][1], fields["wgs_84"][0]]
            d["name"] = fields["gare_alias_libelle_noncontraint"]
            d["city"] = fields["commune_libellemin"]
            d["uic"] = fields["uic_code"]
            data.append(d)

with open("./data/out/gare.json", "w") as file:
    json.dump(data, file, indent=4)
