<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use Exception;

class TeacherController extends BaseController
{
    private AuthUserModel $userModel;
    private TeacherModel  $teacherModel;

    public function __construct()
    {
        $this->userModel    = new AuthUserModel();
        $this->teacherModel = new TeacherModel();
    }

    /**
     * GET /api/teachers
     * List all teachers with user data
     */
    public function index()
    {
        $teachers = $this->teacherModel->getAllWithUsers();
        return $this->respond([
            'status' => 'success',
            'count'  => count($teachers),
            'data'   => $teachers,
        ]);
    }

    /**
     * GET /api/teachers/:id
     */
    public function show(int $id)
    {
        $teacher = $this->teacherModel->getWithUser($id);

        if (!$teacher) {
            return $this->respondError('Teacher not found', 404);
        }

        return $this->respond(['status' => 'success', 'data' => $teacher]);
    }

    /**
     * POST /api/teachers
     * Creates auth_user + teacher in a transaction (1-1 relationship)
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->respondError('Invalid JSON body');
        }

        // Validate combined payload
        $userRules = [
            'email'      => 'required|valid_email',
            'first_name' => 'required|min_length[2]',
            'last_name'  => 'required|min_length[2]',
            'password'   => 'required|min_length[6]',
        ];

        $teacherRules = [
            'university_name'  => 'required|min_length[2]',
            'gender'           => 'required|in_list[male,female,other]',
            'year_joined'      => 'required|integer|greater_than[1950]',
            'department'       => 'required|min_length[2]',
            'designation'      => 'required|min_length[2]',
            'subject'          => 'required|min_length[2]',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules(array_merge($userRules, $teacherRules));

        if (!$validation->run($data)) {
            return $this->respondError('Validation failed', 422, $validation->getErrors());
        }

        // Check duplicate email
        if ($this->userModel->findByEmail($data['email'])) {
            return $this->respondError('Email already registered', 409);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Insert into auth_user
            $userId = $this->userModel->insert([
                'email'      => $data['email'],
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'password'   => $data['password'],
                'phone'      => $data['phone'] ?? null,
                'is_active'  => 1,
            ]);

            if (!$userId) {
                $db->transRollback();
                return $this->respondError('Failed to create user account', 500);
            }

            // Insert into teachers
            $teacherId = $this->teacherModel->insert([
                'user_id'          => $userId,
                'university_name'  => $data['university_name'],
                'gender'           => $data['gender'],
                'year_joined'      => (int) $data['year_joined'],
                'department'       => $data['department'],
                'designation'      => $data['designation'],
                'subject'          => $data['subject'],
                'experience_years' => $data['experience_years'] ?? null,
                'bio'              => $data['bio'] ?? null,
            ]);

            if (!$teacherId) {
                $db->transRollback();
                return $this->respondError('Failed to create teacher profile', 500);
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->respondError('Transaction failed', 500);
            }

            $teacher = $this->teacherModel->getWithUser($teacherId);

            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Teacher created successfully',
                'data'    => $teacher,
            ]);
        } catch (Exception $e) {
            $db->transRollback();
            return $this->respondError('Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/teachers/:id
     */
    public function update(int $id)
    {
        $teacher = $this->teacherModel->find($id);
        if (!$teacher) {
            return $this->respondError('Teacher not found', 404);
        }

        $data = $this->request->getJSON(true);
        if (!$data) {
            return $this->respondError('Invalid JSON body');
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Update auth_user fields if provided
            $userFields = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name'  => $data['last_name']  ?? null,
                'phone'      => $data['phone']       ?? null,
            ]);

            if (!empty($userFields)) {
                $this->userModel->update($teacher['user_id'], $userFields);
            }

            // Update teacher fields
            $teacherFields = array_filter([
                'university_name'  => $data['university_name']  ?? null,
                'gender'           => $data['gender']           ?? null,
                'year_joined'      => isset($data['year_joined']) ? (int)$data['year_joined'] : null,
                'department'       => $data['department']        ?? null,
                'designation'      => $data['designation']       ?? null,
                'subject'          => $data['subject']           ?? null,
                'experience_years' => $data['experience_years']  ?? null,
                'bio'              => $data['bio']               ?? null,
            ]);

            if (!empty($teacherFields)) {
                $this->teacherModel->update($id, $teacherFields);
            }

            $db->transComplete();

            $updated = $this->teacherModel->getWithUser($id);
            return $this->respond([
                'status'  => 'success',
                'message' => 'Teacher updated successfully',
                'data'    => $updated,
            ]);
        } catch (Exception $e) {
            $db->transRollback();
            return $this->respondError('Error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/teachers/:id
     */
    public function delete(int $id)
    {
        $teacher = $this->teacherModel->find($id);
        if (!$teacher) {
            return $this->respondError('Teacher not found', 404);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        $this->teacherModel->delete($id);
        $this->userModel->delete($teacher['user_id']);

        $db->transComplete();

        return $this->respond(['status' => 'success', 'message' => 'Teacher deleted successfully']);
    }
}
