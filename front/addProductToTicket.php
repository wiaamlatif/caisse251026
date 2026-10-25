<?php

if (isset($_GET['idUser'])) {

   $idUser = $_GET['idUser'];
}

if (isset($_GET['idTicket'])) {

   $idTicket = $_GET['idTicket'];
}

if (isset($_GET['idProduct'])) {

   $idProduct = $_GET['idProduct'];
}

require_once "../include/database.php";



//=================================    
//  (1) find index_row  -> lignes_ticket
//=================================

$sql = " SELECT * FROM lignes_ticket
         INNER JOIN products ON lignes_ticket.id_product = products.id_product
         WHERE lignes_ticket.id_ticket = $idTicket
         ORDER BY lignes_ticket.index_row DESC LIMIT 1 ;";

$result = mysqli_query($conn, $sql);

$row_lignes_ticket = mysqli_fetch_assoc($result);


if ($result && mysqli_num_rows($result) > 0) {
   // There are existing rows in the lignes_ticket

   $indexRow = $row_lignes_ticket['index_row'];
   //  $nameProduct = $row_lignes_ticket['name_product'];
   //  $imgSrc = $row_lignes_ticket['img_product'];
   //   $price = $row_lignes_ticket['price'];
   //   $quantity = $row_lignes_ticket['quantity'];
} else {
   // No existing rows, start with index 0
   $indexRow = 0;
}

$indexRow++;

//===================================    
//  (2) Add one row in `lignes_ticket`
//===================================


$sql = "INSERT INTO `lignes_ticket` (`id_ligne_ticket`, `id_ticket`, `id_user`, `id_z`, `index_row`, `id_product`, `quantity`, `price`)
                              VALUES( null, '$idTicket','$idUser','0','$indexRow','$idProduct','1','0' );";


$result = mysqli_query($conn, $sql);

$lastId = mysqli_insert_id($conn);


$sql = " UPDATE lignes_ticket 
           JOIN products 
            ON lignes_ticket.id_product = products.id_product
           SET lignes_ticket.price = products.price;";
//  WHERE lignes_ticket.id_product = $idProduct;";

$result = mysqli_query($conn, $sql);

//=================================================    
// (3) update "total_ticket" in the "tickets" table    
//=================================================


$sql = " SELECT SUM(lignes_ticket.price * lignes_ticket.quantity) as totalTicket FROM lignes_ticket 
         INNER JOIN products ON lignes_ticket.id_product = products.id_product
         WHERE lignes_ticket.id_ticket = $idTicket;";

$result = mysqli_query($conn, $sql);

$lignesTicket = mysqli_fetch_assoc($result);

$totalTicket = $lignesTicket['totalTicket'];



$sql = " UPDATE  `tickets`
          SET   total_ticket = $totalTicket                      
        WHERE      id_ticket = $idTicket;";

$result = mysqli_query($conn, $sql);

//=================================================    
// (4) 
//=================================================

$sql = " SELECT * FROM lignes_ticket      
            INNER JOIN tickets       ON tickets.id_ticket  = lignes_ticket.id_ticket
            INNER JOIN users         ON tickets.id_user  = users.id_user
            INNER JOIN products      ON products.id_product = lignes_ticket.id_product                   
            INNER JOIN categories    ON categories.id_category = products.id_category                   
                 WHERE lignes_ticket.id_ticket  = $idTicket AND lignes_ticket.id_product = $idProduct;";


$result = mysqli_query($conn, $sql);

//$lastIdLineTicket= mysqli_insert_id($conn);

$LineTicket = mysqli_fetch_assoc($result);


//`id_ligne_ticket`, `id_ticket`, `id_user`, `id_z`, `index_row`, `id_product`, `quantity`, `price`
$idLigneTicket  = $LineTicket['id_ligne_ticket'];
$imgSrc         = $LineTicket['img_product'];
$indexRow       = $LineTicket['index_row'];
$nameProduct    = $LineTicket['name_product'];
$price          = $LineTicket['price'];

$result = mysqli_query($conn, $sql);


$arrayData = [
   'idLigneTicket' => $idLigneTicket,
   'idTicket' => $idTicket,
   'idProduct' => $idProduct,
   'imgSrc' => $imgSrc,
   'indexRow' => $indexRow,
   'nameProduct' => $nameProduct,
   'quantity' => '1',
   'price' => $price
];


print_r(json_encode($arrayData));
