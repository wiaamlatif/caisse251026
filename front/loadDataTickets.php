<?php
session_start();

$idUser = (int) $_GET['idUser'];

require_once '../include/database.php';

$sql = "SELECT * FROM tickets 
    INNER JOIN users ON tickets.id_user = users.id_user 
         WHERE tickets.id_user = $idUser
      ORDER BY id_ticket ASC";

$result = mysqli_query($conn, $sql);

$userTickets = mysqli_fetch_all($result, MYSQLI_ASSOC);

$arrayData = [];
foreach ($userTickets as $userTicket) {

    array_push($arrayData, $userTicket);
}

print_r(json_encode($arrayData));
