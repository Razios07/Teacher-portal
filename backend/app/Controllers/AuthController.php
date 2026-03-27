<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use Firebase\JWT\JWT;
use Exception;

class AuthController extends BaseController
{
    private AuthUserModel $userModel;
    private string $jwtSecret;
    private int $jwtExpiry;

    public function __construct()
    {
        $this->userModel = new AuthUserModel();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'your-super-secret-jwt-key';
        $this->jwtExpiry = (int)(getenv('JWT_EXPIRY') ?: 3600);
    }

    /**
     * POST /api/auth/register
     */
    public function register()
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->respondError('Invalid JSON body');
        }

        $rules = [
            'email'      => 'required|valid_email',
            'first_name' => 'required|min_length[2]',
            'last_name'  => 'required|min_length[2]',
            'password'   => 'required|min_length[6]',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($data)) {
            return $this->respondError('Validation failed', 422, $validation->getErrors());
        }

        // Check duplicate email
        if ($this->userModel->findByEmail($data['email'])) {
            return $this->respondError('Email already registered', 409);
        }

        try {
            $userId = $this->userModel->insert([
                'email'      => $data['email'],
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'password'   => $data['password'],
                'phone'      => $data['phone'] ?? null,
                'is_active'  => 1,
            ]);

            if (!$userId) {
                return $this->respondError('Registration failed', 500);
            }

            $user = $this->userModel->find($userId);
            unset($user['password']);

            $token = $this->generateToken($userId, $user['email']);

            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Registration successful',
                'token'   => $token,
                'user'    => $user,
            ]);
        } catch (Exception $e) {
            return $this->respondError('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/auth/login
     */
    public function login()
    {
        $data = $this->request->getJSON(true);

        if (!$data || empty($data['email']) || empty($data['password'])) {
            return $this->respondError('Email and password are required', 422);
        }

        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !$this->userModel->verifyPassword($data['password'], $user['password'])) {
            return $this->respondError('Invalid credentials', 401);
        }

        if (!$user['is_active']) {
            return $this->respondError('Account is deactivated', 403);
        }

        $token = $this->generateToken($user['id'], $user['email']);
        unset($user['password']);

        return $this->respond([
            'status'  => 'success',
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public function me()
    {
        $userId = $this->getAuthUserId();
        $user   = $this->userModel->find($userId);

        if (!$user) {
            return $this->respondError('User not found', 404);
        }

        unset($user['password']);
        return $this->respond(['status' => 'success', 'user' => $user]);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout()
    {
        // JWT is stateless; client discards token
        return $this->respond(['status' => 'success', 'message' => 'Logged out successfully']);
    }

    /**
     * GET /api/users
     */
    public function listUsers()
    {
        $users = $this->userModel->select('id, email, first_name, last_name, phone, is_active, created_at')->findAll();
        return $this->respond(['status' => 'success', 'data' => $users]);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private function generateToken(int $userId, string $email): string
    {
        $now     = time();
        $payload = [
            'iss' => 'teacher-portal',
            'aud' => 'teacher-portal-client',
            'iat' => $now,
            'exp' => $now + $this->jwtExpiry,
            'sub' => $userId,
            'email' => $email,
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }
}
