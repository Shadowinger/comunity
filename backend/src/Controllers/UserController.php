<?php
class UserController {
	private $db;
	public function __construct($db) { $this->db = $db; }
	public function list() {
		$rows = $this->db->query('SELECT id, name, email, role FROM users ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($rows);
	}
	public function detail($id) {
		$stmt = $this->db->prepare('SELECT id, name, email, role FROM users WHERE id=:id');
		$stmt->execute(['id'=>$id]);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$row) { http_response_code(404); echo json_encode(['error'=>'Not found']); return; }
		echo json_encode($row);
	}
}
