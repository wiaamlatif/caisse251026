<?php
session_start();

if (!isset($_SESSION['user']['id_user'])) {
        header('Location: include\connexion.php');
        exit;
}


$idUser = isset($_GET['idUser']) ? (int)$_GET['idUser'] : 0;


//**************************/
//* find the $lastNrTicket */
//**************************/
require_once '../include/database.php';

$sql = "SELECT nr_ticket FROM `tickets` 
        ORDER BY  `id_ticket`DESC
        LIMIT 1;";

$result = mysqli_query($conn, $sql);

$ticket  =  $result->fetch_assoc();

if (isset($ticket)) {
        $lastNrTicket = $ticket['nr_ticket'];
} else {
        $lastNrTicket = "0";
}

$lastNrTicket = (int) $lastNrTicket + 1;

//Put eight 0 at left of the numbre of tickets
$lastNrTicket = str_pad($lastNrTicket, 8, '0', STR_PAD_LEFT);


//***************************************************/
//* Insert a new empty records in the table tickets */
//***************************************************/

//tickets
//`id_ticket`, `id_user`, `id_z`, `set_z`, `printed`, `nr_ticket`, `total_ticket`, `ticket_created_at`

$idZ = 0; //'etat_z'
$setZ = 0;
$printed = 0;
$nrTicket = $lastNrTicket;
$totalTicket = 0;

$sql = "INSERT INTO `tickets`
                 (`id_user`,
                  `id_z`,
                  `set_z`,                  
                  `printed`,
                  `nr_ticket`,
                  `total_ticket`                  
                  )                                   
          VALUES ('$idUser',
                  '$idZ',
                  '$setZ',                 
                  '$printed',
                  '$nrTicket',
                  '$totalTicket');";

$result = mysqli_query($conn, $sql);

$lastId = mysqli_insert_id($conn);


print_r(json_encode($lastId));
