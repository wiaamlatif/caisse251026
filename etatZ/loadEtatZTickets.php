<?php

$idZ = isset($_GET['idZ']) ? (int)$_GET['idZ'] : 0;

require_once '../include/database.php';

$sql = "SELECT * FROM `tickets` 
        INNER JOIN users ON tickets.id_user  = users.id_user
        WHERE  tickets.id_z = $idZ;";

$result = mysqli_query($conn, $sql);

$allTickets = mysqli_fetch_all($result, MYSQLI_ASSOC);

$arrayData = [];
foreach ($allTickets as $Tickets) {

  array_push($arrayData, $Tickets);
} //foreach

print_r(json_encode($arrayData));
