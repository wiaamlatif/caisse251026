<?php
session_start();

if (!isset($_SESSION['user']['id_user'])) {
    header('Location:../include/connexion.php');
    exit;
}



?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="/asset/css/style.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <title>Admin</title>
</head>

<body>

    <div class="container text-center mx-0">

        <div class="d-flex flex-row justify-content-center align-items-start gap-2 mt-3">

            <div class="d-flex flex-column justify-content-center align-items-center gap-2 mt-3">

                <div>
                    <span id="displayTime" class="badge rounded-pill text-bg-primary fs-4 fs-bold py-2 my-1"></span>
                </div>

                <div class="col border border-0 rounded-pill text-bg-light fs-6 fs-bold py-2 my-1">
                    <?php include '../include/navAdmin.php'; ?>
                </div>

                <div class="col border border-0 rounded-pill text-bg-light fs-6 fs-bold py-2 my-1">
                    <p> Database -> Create Tables :</p>
                    <p> 1 - Users 2-Categories 3-Products 4-Tickets 5- lignes_ticket 6-etat_z</p>
                </div>

            </div>

        </div>

    </div>


    <script src="..\asset\js\index.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {

            startAdmin();

            initKeyboardNavigation();

        }); //addEventListener   
    </script>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>

</body>

</html>