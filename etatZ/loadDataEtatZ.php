<?php

require_once '../include/database.php';

$sql = "SELECT * FROM etat_z;";

$result = mysqli_query($conn, $sql);

$allEtatZ = mysqli_fetch_all($result, MYSQLI_ASSOC);

$arrayData = [];
foreach ($allEtatZ as $etatZ) {

  array_push($arrayData, $etatZ);
} //foreach

print_r(json_encode($arrayData));
