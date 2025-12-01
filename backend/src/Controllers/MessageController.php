<?php
class MessageController {
  private $db;
  public function __construct($db) { $this->db = $db; }
  private function jsonBody() { return json_decode(file_get_contents('php://input'), true) ?? []; }

  public function listForUser($user) {
    $stmt = $this->db->prepare('SELECT m.id, m.sender_id, u.name AS sender_name, m.message, m.created_at FROM messages m LEFT JOIN users u ON m.sender_id = u.id WHERE m.recipient_id = :uid ORDER BY m.id DESC');
    $stmt->execute(['uid'=>$user['sub']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function conversations($user) {
    $stmt = $this->db->prepare('
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = :uid THEN m.recipient_id 
          ELSE m.sender_id 
        END AS other_user_id,
        u.name AS other_user_name,
        (SELECT message FROM messages 
         WHERE (sender_id = :uid2 AND recipient_id = other_user_id) 
            OR (sender_id = other_user_id AND recipient_id = :uid3)
         ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT created_at FROM messages 
         WHERE (sender_id = :uid4 AND recipient_id = other_user_id) 
            OR (sender_id = other_user_id AND recipient_id = :uid5)
         ORDER BY created_at DESC LIMIT 1) AS last_message_time
      FROM messages m
      LEFT JOIN users u ON u.id = CASE WHEN m.sender_id = :uid6 THEN m.recipient_id ELSE m.sender_id END
      WHERE m.sender_id = :uid7 OR m.recipient_id = :uid8
      ORDER BY last_message_time DESC
    ');
    $uid = $user['sub'];
    $stmt->execute(['uid'=>$uid, 'uid2'=>$uid, 'uid3'=>$uid, 'uid4'=>$uid, 'uid5'=>$uid, 'uid6'=>$uid, 'uid7'=>$uid, 'uid8'=>$uid]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function conversationWith($userId, $user) {
    $stmt = $this->db->prepare('
      SELECT m.id, m.sender_id, m.recipient_id, m.message, m.created_at,
             s.name AS sender_name, r.name AS recipient_name
      FROM messages m
      LEFT JOIN users s ON m.sender_id = s.id
      LEFT JOIN users r ON m.recipient_id = r.id
      WHERE (m.sender_id = :uid AND m.recipient_id = :other)
         OR (m.sender_id = :other2 AND m.recipient_id = :uid2)
      ORDER BY m.created_at ASC
    ');
    $stmt->execute(['uid'=>$user['sub'], 'other'=>$userId, 'other2'=>$userId, 'uid2'=>$user['sub']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  public function send($user) {
    $b = $this->jsonBody();
    if (!($b['recipient_id'] ?? '') || !($b['message'] ?? '')) {
      http_response_code(400);
      echo json_encode(['error'=>'Missing fields']);
      return;
    }
    $stmt = $this->db->prepare('INSERT INTO messages(sender_id, recipient_id, message) VALUES(:sid, :rid, :msg) RETURNING id');
    $stmt->execute(['sid'=>$user['sub'], 'rid'=>$b['recipient_id'], 'msg'=>$b['message']]);
    $id = $stmt->fetchColumn();
    echo json_encode(['id'=>$id, 'success'=>true]);
  }
}