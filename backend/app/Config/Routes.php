<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// CORS preflight
$routes->options('(:any)', static function () {
    return service('response')
        ->setStatusCode(200)
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
});

// Auth routes (public)
$routes->post('api/auth/register', 'AuthController::register');
$routes->post('api/auth/login',    'AuthController::login');

// Protected routes
$routes->group('api', ['filter' => 'jwtAuth'], static function ($routes) {
    $routes->get('auth/me',           'AuthController::me');
    $routes->post('auth/logout',      'AuthController::logout');

    // Teachers
    $routes->get('teachers',          'TeacherController::index');
    $routes->post('teachers',         'TeacherController::create');
    $routes->get('teachers/(:num)',   'TeacherController::show/$1');
    $routes->put('teachers/(:num)',   'TeacherController::update/$1');
    $routes->delete('teachers/(:num)','TeacherController::delete/$1');

    // Users
    $routes->get('users',             'AuthController::listUsers');
});
