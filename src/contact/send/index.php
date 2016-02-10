<?php

  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  if ( $name && $email && (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) && $message ) {

    $message = 'From: '.$name . ' ' . $email . "\r\n" . $message;

    $message = wordwrap($message, 70, "\r\n");

    // Send
    mail('joey.l@w3by.com', 'JL Website Contact', $message);
    echo "1";
    

  } else {
    header("Malformed code", true, 400);
    exit;
  }

 ?>
