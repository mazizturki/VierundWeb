// contact.php
<?php
if(isset($_POST['email'])) {
    $to = "contact.vierund@gmail.com";
    $subject = "Nouveau message de ".$_POST['name'];
    $message = $_POST['message'];
    $headers = "From: ".$_POST['email'];
    mail($to, $subject, $message, $headers);
    echo "<script>alert('Message envoyé !');</script>";
}
?>