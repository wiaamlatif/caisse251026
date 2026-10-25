<?php

//echo $_SERVER['PHP_SELF'];

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$role = (int) ($_SESSION['user']['role'] ?? 0);

$approved = (int) ($_SESSION['user']['approved'] ?? 0);


$urlNav = [
  0 => "/index.php",               //  /index.php                >Vente
  1 => "/etatZ/index.php",         //  /etatZ/index.php          >EtatZ    
  2 => "/admin/index.php",         // /admin/index.php           >inscription            
  3 => "/include/inscription.php", //  /include/inscription.php  >Back Side
  4 => "/include/connexion.php",   //  /include/connexion.php    >connexion
  5 => "/include/deconnexion.php"
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
      <a class="nav-link <?= $coloredNav[0] ?> rounded-pill px-3" aria-current="page" href="<?= $urlNav[0] ?>">Vente</a>
    </li>
  <?php } ?>


  <?php if ($approved == 1) { ?>
    <li class="nav-item">
      <a class="nav-link <?= $coloredNav[1] ?> rounded-pill px-3" href="<?= $urlNav[1] ?>">Rapports Z</a>
    </li>
  <?php } ?>

  <?php if ($role == 1) { ?>
    <li class="nav-item">
      <a class="nav-link text-nowrap <?= $coloredNav[2] ?> rounded-pill px-3" href="<?= $urlNav[2] ?>">Inscription</a>
    </li>
  <?php } ?>

  <li class="nav-item">
    <a class="nav-link <?= $coloredNav[3] ?> rounded-pill px-3" href="<?= $urlNav[3] ?>">Back Side</a>
  </li>

  <?php if (!isset($_SESSION['user'])) { ?>
    <li class="nav-item">
      <a class="nav-link <?= $coloredNav[4] ?> rounded-pill px-3" href="<?= $urlNav[4] ?>">Connexion</a>
    </li>
  <?php } ?>

  <li class="nav-item">
    <a class="nav-link <?= $coloredNav[5] ?> rounded-pill px-3" href="<?= $urlNav[5] ?>">Deconnexion</a>
  </li>

</ul>