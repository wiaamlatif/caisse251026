<?php

$idZ = $_GET['idZ'];

$somCategory = [];
$listPrice = [];
$somQuantity = [];
$somProduct = [];

require_once '../include/database.php';

$sql = "SELECT
            tickets.id_z,
            lignes_ticket.id_ligne_ticket,
            categories.id_category,
            categories.name_category,
            lignes_ticket.id_product,
            products.name_product,
            products.price,
            lignes_ticket.quantity          
        FROM
            lignes_ticket
        INNER JOIN tickets ON tickets.id_ticket = lignes_ticket.id_ticket
        INNER JOIN products ON lignes_ticket.id_product = products.id_product
        INNER JOIN categories ON categories.id_category = products.id_category
        WHERE
            tickets.id_z = $idZ
        ORDER BY
            categories.id_category,
            lignes_ticket.id_product;";

$result = mysqli_query($conn, $sql);

$items = mysqli_fetch_all($result, MYSQLI_ASSOC);


//Extraire les categories
$listCategory = [];
foreach ($items as $item) {

    $idCategory = $item['id_category'];
    $listCategory[$idCategory] = $item['name_category'];
}

//somCategory
foreach ($listCategory as $category) { //1

    $somCategory[$category] = 0;
    foreach ($items as $item) { //2

        $nameCategory = $item['name_category'];
        if ($nameCategory == $category) {

            $quantity = $item['quantity'];
            $price = $item['price'];
            $totalItem = $quantity * $price;

            $somCategory[$category] += $totalItem;
        }
    } //2   
} //1


$somSomCategories = 0;
foreach ($listCategory as $category) { //1

    $somSomCategories += $somCategory[$category];
}



//Extraire les produits
$listProduct = [];
foreach ($items as $item) {

    $idProduct = $item['id_product'];
    $listProduct[$idProduct] = [$item['name_category'], $item['name_product']];
}


//somProduct, somQuantity, price,   
foreach ($listProduct as $product) { //1

    $somProduct[$product[1]] = 0;
    $somQuantity[$product[1]] = 0;
    foreach ($items as $item) { //2

        $nameProduct = $item['name_product'];
        if ($nameProduct == $product[1]) {

            $listPrice[$product[1]] = $item['price'];

            $somQuantity[$product[1]] += $item['quantity'];

            $totalItem = $item['price'] * $item['quantity'];

            $somProduct[$product[1]] += $totalItem;

            //   echo $item['name_product']."...".$item['quantity']."....".$item['total_ligne']."<br>";
        } //if     
    } //2  
    // echo  $product."...".$price[$product]
    //               ."...".$somQuantity[$product]
    //               ."...".$somProduct[$product]."<br>";              
} //1

$arrayData = [];
foreach ($listCategory as $category) { //1

    $infoCategory = [
        'nameCategory' => $category,
        'totalCategory' => $somCategory[$category],
        'somSomCategories' => $somSomCategories
    ];

    array_push($arrayData, $infoCategory);
} //1


$arrayData = [];
foreach ($listProduct as $product) {

    $infoProduct = [
        'somSomCategories' => $somSomCategories,
        'nameCategory' => $product[0],
        'somCategory' => $somCategory[$product[0]],
        'nameProduct' => $product[1],
        'price' => $listPrice[$product[1]],
        'quantity' => $somQuantity[$product[1]],
        'somProduct' => $somProduct[$product[1]]
    ];


    array_push($arrayData, $infoProduct);
}



print_r(json_encode($arrayData));
