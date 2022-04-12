import json


# get the uic code of stations of our dataset
stations_uic = set()
with open("./data/out/gare.json", "r") as file:
    loaded_file = json.load(file)

    for o in loaded_file:
        stations_uic.add(int(o["uic"][2:]))


# get the line codes of line of our dataset
line_codes = set()
station_list = []
with open("./data/in/liste-des-gares.json") as file:
    loaded_file = json.load(file)

    for o in loaded_file:
        if int(o["fields"]["code_uic"]) in stations_uic:
            line_codes.add(o["fields"]["code_ligne"])

            formatted_obj = {}
            formatted_obj["city"] = o["fields"]["commune"]
            formatted_obj["geometry"] = o["fields"]["geo_shape"]
            formatted_obj["uic_code"] = int(o["fields"]["code_uic"])
            formatted_obj["label"] = o["fields"]["libelle"]
            formatted_obj["departement"] = o["fields"]["departemen"]
            formatted_obj["line_code"] = int(o["fields"]["code_ligne"])

            station_list.append(formatted_obj)

with open("./data/out/formatted-list-of-stations.json", "w") as file:
    json.dump(station_list, file)


# circuits/lines
data = []
with open("./data/in/circuits-list.json", "r") as file:
    loaded_file = json.load(file)

    for o in loaded_file:
        if o["fields"]["code_ligne"] in line_codes:
            formatted_obj = {}
            if "code_voie" in o["fields"]:
                formatted_obj["lane_code"] = o["fields"]["code_voie"]
            if "code_ligne" in o["fields"]:
                formatted_obj["line_code"] = int(o["fields"]["code_ligne"])
            if "nom_voie" in o["fields"]:
                formatted_obj["lane_number"] = o["fields"]["nom_voie"]
            if "geometry" in o:
                formatted_obj["geometry"] = o["geometry"]
    
            data.append(formatted_obj)

with open("./data/out/circuits-list2.json", "w") as file:
    json.dump(data, file)
