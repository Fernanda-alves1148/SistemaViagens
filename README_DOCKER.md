# Execução do Sistema de Viagens com Docker

## Arquitetura

A aplicação é executada em três containers:

| Serviço | Tecnologia | Endereço |
|---|---|---|
| Frontend | React, Vite e Nginx | http://localhost:3000 |
| Backend | Java 21 e Spring Boot | http://localhost:8080 |
| Banco | PostgreSQL 16 | localhost:5432 |

O fluxo principal é:

Frontend → Backend → PostgreSQL

## Pré-requisitos

- Docker Desktop instalado;
- WSL 2 habilitado;
- Docker Desktop em execução.

Não é necessário instalar PostgreSQL, Node.js ou Maven para executar os containers.

## Iniciar a aplicação

Na pasta principal do projeto, execute:

```powershell
docker compose up -d --build