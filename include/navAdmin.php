<?php

//echo $_SERVER['PHP_SELF'];

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$role = (int) ($_SESSION['user']['role'] ?? 0);

$approved = (int) ($_SESSION['user']['approved'] ?? 0);


$urlNav = [
  0 => "/admin/index.php",         //  /index.php                >Database
  1 => "/admin/Etat_Z.php",      //  /admin/Etat_Z.php           >Etat_Z
  2 => "/admin/parametres.php",    //  /admin/parametres.php     >Paramètres
  3 => "/include/adminUsers.php", //  /include/adminUsers.php    >Validation
  4 => "/include/Depenses.php",   //  /include/Depenses.php      >Depenses
  5 => "/include/deconnexion.php"  //  /include/connexion.php    >Front Side
];

for ($i = 0; $i < count($urlNav); $i++) {
  $coloredNav[$i] = "";
}

$clickedNav = array_search($_SERVER['PHP_SELF'], $urlNav);

$coloredNav[$clickedNav] = "bg-primary text-white active";

?>

<ul class="navbar-nav d-flex flex-row justify-content-center py-2 gap-2 gap-lg-3 me-auto mb-2 mb-lg-0">

  <?php if (isset($_SESSION['user'])) { ?>
    <li class="nav-item">
      <a class="nav-link <?= $coloredNav[0] ?> rounded-pill px-3" aria-current="page" href="<?= $urlNav[0] ?>">Database</a>
    </li>
  <?php } ?>


  <?php if ($approved == 1) { ?>
    <li class="nav-item">
      <a class="nav-link <?= $coloredNav[1] ?> rounded-pill px-3" href="<?= $urlNav[1] ?>">Etat_Z</a>
    </li>
  <?php } ?>

  <?php if ($role == 1) { ?>
    <li class="nav-item">
      <a class="nav-link text-nowrap <?= $coloredNav[2] ?> rounded-pill px-3" href="<?= $urlNav[2] ?>">Paramètres</a>
    </li>
  <?php } ?>

  <li class="nav-item">
    <a class="nav-link <?= $coloredNav[3] ?> rounded-pill px-3" href="<?= $urlNav[3] ?>">Validation</a>
  </li>

  <?php if (!isset($_SESSION['user'])) { ?>
    <li class="nav-item">
      <a class="nav-link <?= $coloredNav[4] ?> rounded-pill px-3" href="<?= $urlNav[4] ?>">Depenses</a>
    </li>
  <?php } ?>

  <li class="nav-item">
    <a class="nav-link <?= $coloredNav[5] ?> rounded-pill px-3" href="<?= $urlNav[5] ?>">Front Side</a>
  </li>

</ul>