<?php
session_start();

if (!isset($_SESSION['user']['id_user'])) {
    http_response_code(401);
    exit;
}


$idZ = isset($_GET['idZ']) ? (int)$_GET['idZ'] : 0;
$idUser = isset($_GET['idUser']) ? (int)$_GET['idUser'] : 0;


/*
$sessionUserId = (int) $_SESSION['user']['id_user'];
if ($idUser <= 0 || $idUser !== $sessionUserId) {
    $idUser = $sessionUserId;
}
*/

require_once '../include/database.php';

$sql = 'SELECT * FROM tickets 
    INNER JOIN users ON tickets.id_user = users.id_user 
         WHERE tickets.id_user = ? AND tickets.id_z = ?
      ORDER BY id_ticket ASC';


$statement = $conn->prepare($sql);
$statement->bind_param('ii', $idUser, $idZ);
$statement->execute();
$result = $statement->get_result();

$userTickets = mysqli_fetch_all($result, MYSQLI_ASSOC);

$arrayData = [];
foreach ($userTickets as $userTicket) {

    array_push($arrayData, $userTicket);
}

print_r(json_encode($arrayData));
