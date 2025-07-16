<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$query = $_POST['query'] ?? '';
$format = $_POST['format'] ?? 'csv';

if (empty($query)) {
    http_response_code(400);
    echo json_encode(['error' => 'Query parameter is required.']);
    exit();
}

$nasaApiUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
$postData = http_build_query(['query' => $query, 'format' => $format]);

$options = [
    'http' => [
        'header' => 'Content-type: application/x-www-form-urlencoded' . "\r\n" .
                   'User-Agent: Cosmic-LifeMapper/1.0 (PHP Proxy)' . "\r\n",
        'method' => 'POST',
        'content' => $postData,
        'ignore_errors' => true,
        'timeout' => 30,
    ],
];

$context = stream_context_create($options);
$result = @file_get_contents($nasaApiUrl, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not connect to NASA Exoplanet Archive']);
    exit();
}

// Check if the response contains an error
if (strpos($result, 'ERROR') !== false || strpos($result, 'Exception') !== false) {
    http_response_code(400);
    echo json_encode(['error' => 'NASA API returned an error: ' . substr($result, 0, 200)]);
    exit();
}

// For CSV format, return as plain text
if ($format === 'csv') {
    header('Content-Type: text/csv');
    echo $result;
} else {
    echo json_encode(['data' => $result]);
}
?>