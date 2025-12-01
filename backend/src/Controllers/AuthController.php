<?php
class AuthController {
	private $db; private $auth;
	public function __construct($db, $authService) { $this->db = $db; $this->auth = $authService; }

	private function jsonBody() { return json_decode(file_get_contents('php://input'), true) ?? []; }

	public function register() {
		$b = $this->jsonBody();
		if (!($b['email'] ?? '') || !($b['password'] ?? '') || !($b['name'] ?? '')) {
			http_response_code(400); echo json_encode(['error'=>'Missing fields']); return;
		}
		$stmt = $this->db->prepare('SELECT id FROM users WHERE email = :email');
		$stmt->execute(['email'=>$b['email']]);
		if ($stmt->fetch()) { http_response_code(409); echo json_encode(['error'=>'Email exists']); return; }
		$hash = password_hash($b['password'], PASSWORD_DEFAULT);
		$stmt = $this->db->prepare('INSERT INTO users(name,email,password_hash,role) VALUES(:name,:email,:hash, :role) RETURNING id');
		$stmt->execute(['name'=>$b['name'], 'email'=>$b['email'], 'hash'=>$hash, 'role'=>'user']);
		$id = $stmt->fetchColumn();
		echo json_encode(['id'=>$id, 'name'=>$b['name'], 'email'=>$b['email'], 'role'=>'user']);
	}

	public function login() {
		$b = $this->jsonBody();
		$stmt = $this->db->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = :email');
		$stmt->execute(['email'=>$b['email'] ?? '']);
		$u = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$u || !password_verify($b['password'] ?? '', $u['password_hash'])) { http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); return; }
		$token = $this->auth->signToken(['sub'=>$u['id'], 'name'=>$u['name'], 'role'=>$u['role']]);
		echo json_encode(['token'=>$token]);
	}
}
