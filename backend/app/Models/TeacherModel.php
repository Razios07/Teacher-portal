<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table            = 'teachers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'user_id',
        'university_name',
        'gender',
        'year_joined',
        'department',
        'designation',
        'subject',
        'experience_years',
        'bio',
        'created_at',
        'updated_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'user_id'         => 'required|integer',
        'university_name' => 'required|min_length[2]|max_length[255]',
        'gender'          => 'required|in_list[male,female,other]',
        'year_joined'     => 'required|integer|greater_than[1950]',
        'department'      => 'required|min_length[2]|max_length[150]',
        'designation'     => 'required|min_length[2]|max_length[150]',
        'subject'         => 'required|min_length[2]|max_length[150]',
    ];

    /**
     * Get teacher with joined auth_user data
     */
    public function getWithUser(int $id): ?array
    {
        return $this->db->table('teachers t')
            ->select('t.*, u.email, u.first_name, u.last_name, u.phone, u.created_at as user_created_at')
            ->join('auth_user u', 'u.id = t.user_id')
            ->where('t.id', $id)
            ->get()
            ->getRowArray();
    }

    /**
     * Get all teachers with joined user data
     */
    public function getAllWithUsers(): array
    {
        return $this->db->table('teachers t')
            ->select('t.*, u.email, u.first_name, u.last_name, u.phone')
            ->join('auth_user u', 'u.id = t.user_id')
            ->orderBy('t.created_at', 'DESC')
            ->get()
            ->getResultArray();
    }
}
