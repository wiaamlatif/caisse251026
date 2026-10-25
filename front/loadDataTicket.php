<?php

//$idTicket = isset($_GET['idTicket']) ? (int)$_GET['idTicket'] : 0;

$idTicket = (int) $_GET['idTicket'];

//=============================================
require_once 'C:\Mjid\include\database.php';
//=============================================

//  !!! THIS INFO FOR EMPTY TICKET !!!!
//>> Get current ticket info for empty ticket !
$sql = "SELECT * FROM tickets
        INNER JOIN users ON tickets.id_user = users.id_user
        WHERE id_ticket  = $idTicket";

$result = mysqli_query($conn, $sql);

$currentTicket = mysqli_fetch_assoc($result);

$infoTicket = [
    'idUser'      => $currentTicket['id_user'],
    'nameUser'    => $currentTicket['first_name'],
    'imgUser'     => $currentTicket['img_user'],
    'idTicket'    => $currentTicket['id_ticket'],
    'totalTicket' => $currentTicket['total_ticket'],
    'nrTicket'    => $currentTicket['nr_ticket']
];

$arrayData[] = $infoTicket;


//>> Store Lines current ticket in arrayData    
$sql = "SELECT * FROM lignes_ticket      
        INNER JOIN tickets       ON tickets.id_ticket  = lignes_ticket.id_ticket
        INNER JOIN users         ON tickets.id_user  = users.id_user
        INNER JOIN products      ON products.id_product = lignes_ticket.id_product
        INNER JOIN categories    ON categories.id_category = products.id_category        
        WHERE lignes_ticket.id_ticket  = $idTicket
        ORDER BY lignes_ticket.id_ligne_ticket  ASC;";

$result = mysqli_query($conn, $sql);

$linesTicket = mysqli_fetch_all($result, MYSQLI_ASSOC);

if (!empty($linesTicket) && count($linesTicket) > 0) { // If the ticket has lines, we return all lines in arrayData   

    foreach ($linesTicket as $ligneTicket) {

        array_push($arrayData, $ligneTicket);
    } //foreach

}


print_r(json_encode($arrayData));
