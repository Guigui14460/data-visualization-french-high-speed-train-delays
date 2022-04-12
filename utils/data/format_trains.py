import json


def template(item: dict) -> dict:
    d = dict()
    
    d["Annees"] = item["Year"]
    d["Mois"] = item["Month"]
    d["Depart"] = item["Departure station"]
    d["Arrive"] = item["Arrival station"]

    if item["Number of expected circulations"] != "":
        d["attendus"] = item["Number of expected circulations"]
    else:
        raise Exception()
    d["Temps_de_trajet_moyen"] = item["Average travel time (min)"]
    d["Annule"] = item["Number of cancelled trains"]
    
    if item["Number of late trains at departure"] != "":
        d["Depart_retarde"] = item["Number of late trains at departure"]
    else:
        d["Depart_retartde"] = 0

    d["Retard_moyen_sur_les_depart_tardif"] = item["Average delay of late departing trains (min)"]
    d["Retard_moyen_sur_tous_les_depart"] = item["Average delay of all departing trains (min)"]


    
    if item["Number of trains late on arrival"] != "":
        d["Train_arrive_en_retard"] = item["Number of trains late on arrival"]
    else:
        d["Train_arrive_en_retard"] = 0

    if item["Average delay of late arriving trains (min)"] != "":
        d["Retard_moyen_sur_tous_train_en_retard"] = item["Average delay of late arriving trains (min)"]
    else:
        d["Retard_moyen_sur_tous_train_en_retard"] = 0
    
 

    percentages = dict()
    if item.get("% trains late due to railway infrastructure (maintenance, works)") != "":
        percentages["etat_de_la_ligne"] = item.get("% trains late due to railway infrastructure (maintenance, works)")
    else:
        raise Exception()

    percentages["gestion_du_trafic"] =  item.get("% trains late due to traffic management (rail line traffic, network interactions)")
    percentages["materiel"] =  item.get("% trains late due to rolling stock")
    percentages["gestion_de_station_et_reutilisation_de_materiel"] =  item.get("% trains late due to station management and reuse of material")
    percentages["passagers"] =  item.get("% trains late due to passenger traffic (affluence, PSH management, connections)")
    percentages["causes_externes"] =  item.get("% trains late due to external causes (weather, obstacles, suspicious packages, malevolence, social movements, etc.)")
    d["P_late"] = percentages

    if item["Number of late trains > 15min"] != "":
        d["train_en_retard_superieur_a_15_min"] = item["Number of late trains > 15min"]
    else:
        d["train_en_retard_superieur_a_15_min"] = 0

    if item["Average train delay > 15min"] != "":
        d["temps_moyen_des_train_en_retard_superieur_a_15_min"] = item["Average train delay > 15min"]
    else:
        d["temps_moyen_des_train_en_retard_superieur_a_15_min"] = 0

    if item["Number of late trains > 30min"] != "":
        d["train_en_retard_superieur_a_30_min"] = item["Number of late trains > 30min"]
    else:
        d["train_en_retard_superieur_a_30_min"] = 0

    if item["Number of late trains > 60min"] != "":
        d["train_en_retard_superieur_a_60_min"] = item["Number of late trains > 60min"]
    else:
        d["train_en_retard_superieur_a_60_min"] = 0

    # delay causes
    delay = dict()
    if item["Delay due to external causes"] != "":
        delay["causes_externes"] = item["Delay due to external causes"]
    else:
        raise Exception()
    delay["etat_de_la_ligne"] = item["Delay due to railway infrastructure"]
    delay["gestion_du_trafic"] = item["Delay due to traffic management"]
    delay["materiel"] = item["Delay due to rolling stock"]
    delay["gestion_de_station_et_reutilisation_de_materiel"] = item["Delay due to station management and reuse of material"]
    delay["passagers"] = item["Delay due to travellers taken into account"]
    d["delay"] = delay
    
    return d


data = []
loaded_file = None
with open("./data/in/train.json", "r") as file:
    loaded_file = json.load(file)

for item in loaded_file:
    try:
        d = template(item)
        data.append(d)
    except Exception as e:
        pass

with open("./data/out/train2.json", "w") as file:
    json.dump(data, file, indent=4)
