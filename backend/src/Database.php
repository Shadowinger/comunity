<?php
class Database {
	private static $pdo;

	public static function get() {
		if (!self::$pdo) {
			require __DIR__ . '/config.php';
			$dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $C['DB_HOST'], $C['DB_PORT'], $C['DB_NAME']);
			self::$pdo = new PDO($dsn, $C['DB_USER'], $C['DB_PASS'], [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			]);
		}
		return self::$pdo;
	}
}
