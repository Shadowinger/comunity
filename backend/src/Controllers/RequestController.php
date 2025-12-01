<?php
class RequestController {
	private $db;
	public function __construct($db) { $this->db = $db; }
	private function jsonBody() { return json_decode(file_get_contents('php://input'), true) ?? []; }

  public function list() {
    $rows = $this->db->query('
      SELECT r.id, r.title, r.description, r.category, r.status, r.user_id, u.name AS user_name, r.created_at,
             (SELECT COUNT(*) FROM reactions WHERE request_id = r.id) AS reaction_count
      FROM help_requests r 
      LEFT JOIN users u ON r.user_id = u.id 
      ORDER BY r.id DESC
    ')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);
  }  public function detail($id) {
    $stmt = $this->db->prepare('
      SELECT r.id, r.title, r.description, r.category, r.status, r.user_id, u.name AS user_name, r.created_at,
             (SELECT COUNT(*) FROM reactions WHERE request_id = r.id) AS reaction_count
      FROM help_requests r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.id=:id
    ');
    $stmt->execute(['id'=>$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) { http_response_code(404); echo json_encode(['error'=>'Not found']); return; }
    echo json_encode($row);
  }	public function create($user) {
		$b = $this->jsonBody();
		if (!($b['title'] ?? '') || !($b['description'] ?? '') || !($b['category'] ?? '')) { http_response_code(400); echo json_encode(['error'=>'Missing fields']); return; }
		$stmt = $this->db->prepare('INSERT INTO help_requests(title, description, category, status, user_id) VALUES(:title,:description,:category,:status,:uid) RETURNING id');
		$stmt->execute([
			'title'=>$b['title'],
			'description'=>$b['description'],
			'category'=>$b['category'],
			'status'=>'open',
			'uid'=>$user['sub']
		]);
    $id = $stmt->fetchColumn();
    $this->detail($id);
  }

  public function react($id, $user) {
    try {
      $stmt = $this->db->prepare('INSERT INTO reactions(request_id, user_id) VALUES(:rid, :uid) ON CONFLICT DO NOTHING');
      $stmt->execute(['rid'=>$id, 'uid'=>$user['sub']]);
      echo json_encode(['success'=>true]);
    } catch (Exception $e) {
      http_response_code(400);
      echo json_encode(['error'=>'Reaction failed']);
    }
  }
}