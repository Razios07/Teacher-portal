<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

abstract class BaseController extends Controller
{
    protected $request;

    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ) {
        parent::initController($request, $response, $logger);
    }

    protected function respond(array $data, int $statusCode = 200): ResponseInterface
    {
        return $this->response
            ->setStatusCode($statusCode)
            ->setHeader('Content-Type', 'application/json')
            ->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->setJSON($data);
    }

    protected function respondCreated(array $data): ResponseInterface
    {
        return $this->respond($data, 201);
    }

    protected function respondError(string $message, int $statusCode = 400, array $errors = []): ResponseInterface
    {
        $payload = ['status' => 'error', 'message' => $message];
        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }
        return $this->respond($payload, $statusCode);
    }

    protected function getAuthUserId(): int
    {
        return (int) ($this->request->user->sub ?? 0);
    }
}
