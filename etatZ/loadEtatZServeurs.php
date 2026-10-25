<?php


$idZ = $_GET['idZ'];

require_once '../include/database.php';

$sql = " SELECT lignes_ticket.id_ligne_ticket,
                lignes_ticket.`id_ticket`,
                lignes_ticket.`indexRowTicket`,               
                lignes_ticket.id_product,
                lignes_ticket.quantity,     
                products.price,
                products.name_product,
                categories.id_category,
                categories.name_category,      
                users.first_name,            
                tickets.id_user,                                       
                tickets.id_z,
                lignes_ticket.`quantity` * products.price AS Montant,    
                lignes_ticket.`created_at`
            FROM
                `lignes_ticket`
            INNER JOIN tickets    ON lignes_ticket.id_ticket = tickets.id_ticket
            INNER JOIN users      ON users.id_user = tickets.id_user
            INNER JOIN products   ON products.id_product = lignes_ticket.id_product
            INNER JOIN categories ON categories.id_category = products.id_category
            WHERE tickets.id_z = $idZ  
            ORDER BY
                tickets.id_z,
                tickets.id_user,
                categories.id_category,
                lignes_ticket.id_product;";

$result = mysqli_query($conn, $sql);


$items = mysqli_fetch_all($result, MYSQLI_ASSOC);


//preparer data à partir de 'lignes_ticket' et les tables jointes
$listLignes = [];
foreach ($items as $item) {

    $ligne = [
        'id_user'       => $item['id_user'],
        'id_category'   => $item['id_category'],
        'id_product'    => $item['id_product'],
        'first_name'    => $item['first_name'],
        'name_category' => $item['name_category'],
        'name_product'  => $item['name_product'],
        'quantity'      => $item['quantity'],
        'price'         => $item['price'],
        'Montant'       => $item['Montant']
    ];

    array_push($listLignes, $ligne);
}


//extraire users
$listUsers = [];
$somUser = [];
foreach ($listLignes as $ligne) {

    $idUser = $ligne['id_user'];
    $listUsers[$idUser] = [$ligne['id_user'], $ligne['first_name']];
    $somUser[$idUser] = 0;
}


foreach ($listUsers as $user) { //1

    $idUser = $user[0];
    foreach ($listLignes as $ligne) {

        if ($ligne['id_user'] == $user[0]) {

            $somUser[$idUser] += $ligne['Montant'];
        }
    }
}

$arrayData = [];
foreach ($listUsers as $user) { //1

    $idUser = $user[0];
    $firstName = $user[1];
    $totalUser = $somUser[$idUser];

    $dataUser = [
        'idUser' => $idUser,
        'firstName' => $firstName,
        'somUser' => $totalUser
    ];

    array_push($arrayData, $dataUser);
} //1

print_r(json_encode($arrayData));
