<header>
    <form action="/?url=info" method="post" id="topbar" >
        <a href="/" title="Retour à l'accueil"><p>🚄</p></a>
        
        <input autocomplete="off" list="departure" id="selected_departure" class="select" name="Depart" onkeyup="changeData(event)" placeholder="Depart" value="<?php echo($_POST['Depart'])?>" >
        <datalist id="departure"></datalist>
        
        <input autocomplete="off" list="arrival" id="selected_arrival" class="select" name="Arrive" onkeyup="changeData(event)" placeholder="Arrive" value="<?php echo($_POST['Arrive'])?>" >
        <datalist id="arrival"></datalist>
        
        <input autocomplete="off" list="year" id="year_arrival" class="select" onkeyup="changeData(event)" name="Annees" placeholder="Annees" value="<?php echo($_POST['Annees'])?>">
        <datalist id="year"></datalist>
        
        <input autocomplete="off" list="month" id="month_arrival" class="select" onkeyup="changeData(event)" name="Mois" placeholder="Mois" value="<?php echo($_POST['Mois'])?>">
        <datalist id="month"></datalist>
        
        <button>Voir les retards</button>
    </form>
    <a href="/?url=map">Voir la carte 🚆</a>
</header>

<body>
    <div id="visu">
        <div id="donut"></div>
        <div id="map"></div>
    </div>

    <div id="data">
        <div id="delayc"></div>
        <div id="delaym"></div>
        <div id="datac"></div>
        <div id="datam"></div>
        <div></div>
    </div>
</body>

<script>
    var data = <?php echo json_encode($_POST); ?>;
</script>
<script src="/js/info.js"></script>
