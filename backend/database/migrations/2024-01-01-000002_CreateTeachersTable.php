<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTeachersTable extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'university_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'gender' => [
                'type'       => 'ENUM',
                'constraint' => ['male', 'female', 'other'],
            ],
            'year_joined' => [
                'type'       => 'YEAR',
            ],
            'department' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'designation' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'subject' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'experience_years' => [
                'type'       => 'INT',
                'constraint' => 3,
                'null'       => true,
            ],
            'bio' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('user_id', 'auth_user', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('teachers');
    }

    public function down(): void
    {
        $this->forge->dropTable('teachers', true);
    }
}
