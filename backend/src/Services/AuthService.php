<?php
class AuthService {
	private $secret;
	public function __construct($config) { $this->secret = $config['JWT_SECRET']; }

	public function signToken($payload, $ttlSeconds = 86400) {
		$header = ['alg' => 'HS256', 'typ' => 'JWT'];
		$now = time();
		$payload = array_merge($payload, ['iat'=>$now, 'exp'=>$now+$ttlSeconds]);
		$segments = [
			$this->b64(json_encode($header)),
			$this->b64(json_encode($payload))
		];
		$sig = hash_hmac('sha256', implode('.', $segments), $this->secret, true);
		$segments[] = $this->b64($sig);
		return implode('.', $segments);
	}

	public function verifyToken($jwt) {
		$parts = explode('.', $jwt);
		if (count($parts) !== 3) return null;
		list($h, $p, $s) = $parts;
		$sig = $this->b64(hash_hmac('sha256', $h.'.'.$p, $this->secret, true));
		if (!hash_equals($sig, $s)) return null;
		$payload = json_decode($this->ub64($p), true);
		if (!$payload || ($payload['exp'] ?? 0) < time()) return null;
		return $payload;
	}

	private function b64($data) { return rtrim(strtr(base64_encode($data), '+/', '-_'), '='); }
	private function ub64($data) { return base64_decode(strtr($data, '-_', '+/')); }
}
