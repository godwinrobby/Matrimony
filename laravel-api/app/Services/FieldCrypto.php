<?php

namespace App\Services;

/**
 * AES-256-GCM field-level encryption for sensitive PII stored in MySQL
 * (contact email / phone). Key is derived from APP_SECRET (sha256).
 *
 * Payload layout (matches the Node.js server/db/crypto.ts implementation):
 *   [12-byte IV][16-byte auth tag][ciphertext]
 */
class FieldCrypto
{
    private static function key(): string
    {
        $secret = env('APP_SECRET', '') ?: env('JWT_SECRET', '');
        if ($secret === '') {
            throw new \RuntimeException('APP_SECRET or JWT_SECRET must be set for field encryption');
        }
        // sha256 → 32-byte key
        return hash('sha256', $secret, true);
    }

    /** Encrypt a UTF-8 string → raw binary payload. */
    public static function encrypt(string $plain): string
    {
        $iv = random_bytes(12);
        $cipher = openssl_encrypt($plain, 'aes-256-gcm', self::key(), OPENSSL_RAW_DATA, $iv, $tag);
        return $iv . $tag . $cipher;
    }

    /** Decrypt a payload produced by encrypt(). Returns '' on failure. */
    public static function decrypt(?string $blob): string
    {
        if ($blob === null || $blob === '') {
            return '';
        }
        try {
            $iv = substr($blob, 0, 12);
            $tag = substr($blob, 12, 16);
            $enc = substr($blob, 28);
            $plain = openssl_decrypt($enc, 'aes-256-gcm', self::key(), OPENSSL_RAW_DATA, $iv, $tag);
            return $plain === false ? '' : $plain;
        } catch (\Throwable $e) {
            return '';
        }
    }

    /** Convert a stored value (may be binary string or null) to a safe string. */
    public static function decryptFromDb($blob): string
    {
        if ($blob === null || is_string($blob) === false || $blob === '') {
            return '';
        }
        return self::decrypt($blob);
    }
}
