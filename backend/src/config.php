<?php
$C = [];
$C['DB_HOST'] = getenv('DB_HOST') ?: '127.0.0.1';  
$C['DB_PORT'] = getenv('DB_PORT') ?: '5432';
$C['DB_NAME'] = 'community';
$C['DB_USER'] = 'stanislav';
$C['DB_PASS'] = 'heslo';
$C['JWT_SECRET'] = '1234';