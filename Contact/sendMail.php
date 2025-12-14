<?php
// 1. SECURITY: Only allow requests from your specific domain
// Replace 'reyandev.com' with your actual domain name
header("Access-Control-Allow-Origin: https://reyandev.com");
header("Content-Type: application/json; charset=UTF-8");

// 2. CONFIGURATION
$to = "reyanarshad36@gmail.com";
$subject = "New Contact: " . date("Y-m-d H:i"); // Added timestamp to subject

// 3. SERVER-SIDE CHECKS
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["ok" => false, "msg" => "Method Not Allowed"]);
    exit;
}

// 4. HONEYPOT (Bot Trap)
if (!empty($_POST['trap'])) {
    // Return success to confuse the bot, but don't send mail
    echo json_encode(["ok" => true]); 
    exit;
}

// 5. INPUT VALIDATION
if (!isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    echo json_encode(["ok" => false, "msg" => "Missing fields"]);
    exit;
}

// 6. SANITIZATION (Prevents Header Injection)
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Remove newlines from Name/Email to prevent Header Injection attacks
$name = str_replace(array("\r", "\n"), '', clean_input($_POST['name']));
$email = str_replace(array("\r", "\n"), '', filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
$message = clean_input($_POST['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["ok" => false, "msg" => "Invalid email"]);
    exit;
}

// 7. EMAIL BODY
$body = "You received a new message from your portfolio.\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "--------------------------------------------------\n\n";
$body .= "Message:\n$message\n";

// 8. HEADERS (CRITICAL FIX)
// DO NOT use the user's email in 'From'. Gmail/Outlook will block it (SPF Fail).
// Use an email address that belongs to YOUR server domain.
$server_email = "noreply@reyandev.com"; // Ensure this domain matches your hosting

$headers = "From: $name <$server_email>\r\n";
$headers .= "Reply-To: $email\r\n"; // This allows you to click 'Reply' and email the user
$headers .= "X-Mailer: PHP/" . phpversion();

// 9. SEND
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(["ok" => true]);
} else {
    // Log error on server for debugging, but don't show user
    error_log("Mail failed to send to $to");
    echo json_encode(["ok" => false, "msg" => "Server error. Try again later."]);
}
?>