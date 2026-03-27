<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $default = [
        'allowedOrigins'      => ['http://localhost:3000', 'http://localhost:5173'],
        'allowedOriginsPatterns' => [],
        'supportsCredentials' => false,
        'allowedHeaders'      => ['Content-Type', 'Authorization', 'X-Requested-With'],
        'exposedHeaders'      => [],
        'allowedMethods'      => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        'maxAge'              => 7200,
    ];
}
