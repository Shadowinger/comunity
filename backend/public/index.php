<?php
require_once __DIR__ . '/../src/config.php';
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Services/AuthService.php';
require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Controllers/UserController.php';
require_once __DIR__ . '/../src/Controllers/RequestController.php';
require_once __DIR__ . '/../src/Controllers/MessageController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$db = Database::get();
$authService = new AuthService($C);

function route($method, $pattern, $handler) {
	static $routes = [];
	if ($handler) { $routes[] = [$method, $pattern, $handler]; return; }
	$uri = strtok($_SERVER['REQUEST_URI'], '?');
	$reqMethod = $_SERVER['REQUEST_METHOD'];
	foreach ($routes as $r) {
		list($m, $p, $h) = $r;
		if ($m !== $reqMethod) continue;
		$regex = '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $p) . '$#';
		if (preg_match($regex, $uri, $matches)) {
			return $h($matches);
		}
	}
	http_response_code(404); echo json_encode(['error' => 'Not found']);
}

function requireAuth($authService) {
	$hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
	if (!preg_match('/Bearer\s+(.*)/', $hdr, $m)) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }
	$payload = $authService->verifyToken($m[1]);
	if (!$payload) { http_response_code(401); echo json_encode(['error'=>'Invalid token']); exit; }
	return $payload;
}

// Controllers
$authController = new AuthController($db, $authService);
$userController = new UserController($db);
$requestController = new RequestController($db);
$messageController = new MessageController($db);

// Routes
route('POST', '/api/auth/login', function() use ($authController) { $authController->login(); });
route('POST', '/api/auth/register', function() use ($authController) { $authController->register(); });

route('GET', '/api/users', function() use ($userController) { $userController->list(); });
route('GET', '/api/users/{id}', function($params) use ($userController) { $userController->detail((int)$params['id']); });

route('GET', '/api/requests', function() use ($requestController) { $requestController->list(); });
route('GET', '/api/requests/{id}', function($params) use ($requestController) { $requestController->detail((int)$params['id']); });
route('POST', '/api/requests', function() use ($requestController, $authService) { $user = requireAuth($authService); $requestController->create($user); });
route('POST', '/api/requests/{id}/react', function($params) use ($requestController, $authService) { $user = requireAuth($authService); $requestController->react((int)$params['id'], $user); });

route('GET', '/api/messages', function() use ($messageController, $authService) { $user = requireAuth($authService); $messageController->listForUser($user); });
route('POST', '/api/messages', function() use ($messageController, $authService) { $user = requireAuth($authService); $messageController->send($user); });
route('GET', '/api/conversations', function() use ($messageController, $authService) { $user = requireAuth($authService); $messageController->conversations($user); });
route('GET', '/api/conversations/{id}', function($params) use ($messageController, $authService) { $user = requireAuth($authService); $messageController->conversationWith((int)$params['id'], $user); });

// Dispatch
route(null, null, null);
