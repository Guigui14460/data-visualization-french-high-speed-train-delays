import json

s = open("./data/train.json","r")
j = json.load(s)
jsonO = list()

def template(item:dict) ->dict:
    p = dict()
    delay= dict()
    d = dict()
   
      
    d["Year"] = item["Year"] 
    d["Month"] = item["Month"]
    d["Departure"] = item["Departure station"] 
    d["Arrival"] = item["Arrival station"] 
    if item["Number of expected circulations"] != "" : d["Expected"] = item["Number of expected circulations"] 
    else : raise Exception()
    d["Travel_time"] = item["Average travel time (min)"] 
    d["Cancelled"] = item["Number of cancelled trains"] 
    
    if item["Number of late trains at departure"] != "" : d["Late_departure"] = item["Number of late trains at departure"] 
    else : d["Late_departure"] = 0
     
    d["Average_delay_late_departure"] = item["Average delay of late departing trains (min)"] 
    d["Average_delay_all_departure"] = item["Average delay of all departing trains (min)"] 
     
    d["Late_arrival"] = item["Number of trains late on arrival"] 
    
    if item["Number of trains late on arrival"] != "" : d["Late_arrival"] = item["Number of trains late on arrival"] 
    else : d["Late_arrival"] = 0
    
    
    
 
    
    if item["Average delay of late arriving trains (min)"] != "" : d["Average_delay_late_arrival"] = item["Average delay of late arriving trains (min)"] 
    else : d["Average_delay_late_arrival"] = 0
    
    
    if item["Number of trains late on arrival"] != "" : d["Average_delay_all_arrival"] = item["Number of trains late on arrival"] 
    else : d["Average_delay_all_arrival"] = 0
    
   

    
    
    if item.get("% trains late due to railway infrastructure (maintenance, works)") != "" : p["railway_infrastructure"] = item.get("% trains late due to railway infrastructure (maintenance, works)")
    else : raise Exception()
    
    
    p["traffic_management"] =  item.get("% trains late due to traffic management (rail line traffic, network interactions)")
    p["rolling_stock"] =  item.get("% trains late due to rolling stock")
    p["station_management_and_reuse_of_material"] =  item.get("% trains late due to station management and reuse of material")
    p["passenger_traffic"] =  item.get("% trains late due to passenger traffic (affluence, PSH management, connections)")
    p["external_causes"] =  item.get("% trains late due to external causes (weather, obstacles, suspicious packages, malevolence, social movements, etc.)")
        
    d["P_late"] = p


    if item["Number of late trains > 15min"] != "" : d["late_trains_SUP_15min"] = item["Number of late trains > 15min"] 
    else : d["late_trains_SUP_15min"] = 0
    
    if item["Average train delay > 15min"] != "" : d["Average_delay_SUP_15min"] = item["Average train delay > 15min"] 
    else : d["Average_delay_SUP_15min"] = 0
    
    if item["Number of late trains > 30min"] != "" : d["late_trains_SUP_30min"] = item["Number of late trains > 30min"] 
    else : d["late_trains_SUP_30min"] = 0

    if item["Number of late trains > 60min"] != "" : d["late_trains_SUP_60min"] = item["Number of late trains > 60min"] 
    else : d["late_trains_SUP_60min"] = 0


    
    if item["Delay due to external causes"] != "" : delay["external_causes"] = item["Delay due to external causes"] 
    else : raise Exception()
    
    
   
    delay["railway_infrastructure"] = item["Delay due to railway infrastructure"]
    delay["traffic_management"] = item["Delay due to traffic management"]
    delay["rolling_stock"] = item["Delay due to rolling stock"]
    delay["station_management_and_reuse_of_material"] = item["Delay due to station management and reuse of material"]
    delay["travellers_taken_into_account"] = item["Delay due to travellers taken into account"]
    
    d["delay"] = delay
    
    return d
    


for item in j:
    
    try:
        
        d = template(item)
        
        jsonO.append(d)
    except Exception as e :
        pass
   
   

 
    
    
f = open("./data/train2.json", "w")
f.write(json.dumps(jsonO,indent=4))
f.close()





    # for key,val in item.items():
      
    #     if key != "Comment (optional) delays at departure" :
    #         if key != "Comment (optional) delays on arrival":                
    #             if val == "":
    #                 item[key] = 0.0
                    
                
    #             newKey = re.sub(r' ','_',key)
    #             newKey = re.sub(r'(optional)','',newKey)
    #             newKey = re.sub(r'%','P',newKey) 
    #             newKey = re.sub(r'(weather,_obstacles,_suspicious_packages,_malevolence,_social_movements,_etc.)','',newKey)
    #             newKey = re.sub(r'(maintenance,_works)','',newKey)
    #             newKey = re.sub(r'(rail_line_traffic,_network_interactions)','',newKey)
    #             newKey = re.sub(r'(affluence,_PSH management,_connections)','',newKey)   
    #             newKey = re.sub(r'>','SUP',newKey)
    #             newKey = re.sub(r'_\(','',newKey)
    #             newKey = re.sub(r'\)','',newKey)
            
    #             if re.match('^Delay',newKey) or re.match('^Average',newKey) or re.match('^P',newKey):
    #                 if isinstance(val, int):
    #                     item[key] = float(format(val,'.1f'))
                        
                        
    #             d[newKey] = item[key]
                
    # if b:
    #     b = not b