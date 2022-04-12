<?php 

function top($css = null, $js = null)
{
    if($css == null && $js == null) {
        ?>
        <!DOCTYPE html>
        <html>
            <head>
                <title>Retard à grande vitesse</title>
                <meta charset="UTF-8">
                <script type="text/javascript" src="../js/d3.min.js"></script>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap" rel="stylesheet">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" type="image/ico" href="/asset/favicon.ico">
            </head>
        <?php
    } else {
        ?>
        <!DOCTYPE html>
        <html>
            <head>
                <title>Retard à grande vitesse</title>
                <meta charset="UTF-8">
                <script type="text/javascript" src="../js/d3.min.js"></script>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap" rel="stylesheet">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="css/<?php echo("$css") ?>.css">
                <link rel="icon" type="image/ico" href="/asset/favicon.ico">
            </head>
        <?php
    }
}

?>