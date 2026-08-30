-- Endereço

CREATE TABLE uf (
    siglaUF CHAR(2) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
INSERT INTO uf (siglaUF, nome) 
VALUES 
    ('PR', 'Paraná'),
    ('SC', 'Santa Catarina'),
    ('SP', 'São Paulo');
SELECT * FROM uf;

CREATE TABLE cidade (
    idCidade SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
	siglaUF CHAR(2) REFERENCES uf(siglaUF)
);
INSERT INTO cidade (idCidade, nome, siglaUF) 
VALUES 
    (1, 'Foz do Iguaçu', 'PR'),
    (2, 'Joinville', 'SC'),
    (3, 'Guarulhos', 'SP');
SELECT * FROM cidade;

CREATE TABLE tipo_log (
    siglaLog CHAR(2) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
INSERT INTO tipo_log (siglaLog, nome) 
VALUES 
    ('Av', 'Avenida'),
    ('R', 'Rua');
SELECT * FROM tipo_log;

CREATE TABLE logradouro (
    idLogradouro SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
	siglaLog CHAR(2) REFERENCES tipo_log(siglaLog)
);
INSERT INTO logradouro (idLogradouro, nome, siglaLog) 
VALUES 
    (1, 'Avenida Brasil', 'Av'),        -- Foz
    (2, 'Rua das Palmeiras', 'R'),      -- Joinville
	(3, 'Avenida Paulo Faccini', 'Av'); -- Guarulhos
SELECT * FROM logradouro;

CREATE TABLE bairro (
    idBairro SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
INSERT INTO bairro (idBairro, nome) 
VALUES 
    (1, 'Centro'),  -- Foz
    (2, 'América'), -- Joinville
	(3, 'Macedo');  -- Guarulhos
SELECT * FROM bairro;

CREATE TABLE endereco (
    idEndereco SERIAL PRIMARY KEY,
    idBairro INT REFERENCES bairro(idBairro),
	idCidade INT REFERENCES cidade(idCidade),
	idLogradouro INT REFERENCES logradouro (idLogradouro)
);
INSERT INTO endereco (idEndereco, idBairro, idCidade, idLogradouro) 
VALUES 
    (1, 1, 1, 1), -- Foz
    (2, 2, 2, 2), -- Joinville
	(3, 3, 3, 3); -- Guarulhos
SELECT * FROM endereco;

-- Ator da Sprint

CREATE TABLE responsavel (
    idResponsavel SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
	CPF VARCHAR(20) NOT NULL,
	nro INT NOT NULL,
	complemento VARCHAR(20) NOT NULL,
	idEndereco INT REFERENCES endereco(idEndereco)
);
INSERT INTO responsavel (idResponsavel, nome, CPF, nro, complemento, idEndereco) 
VALUES 
    (1, 'Ana Paula Dias', '720.720.720.20', 72, 'casa', 1),
    (2, 'João Menezes', '750.750.750.50', 75, 'casa', 2);
SELECT * FROM responsavel;

-- Conatatos 

CREATE TABLE ddd (
    idDDD INT PRIMARY KEY
);
INSERT INTO ddd (idDDD) 
VALUES 
    (45), -- Foz
	(48), -- Joinville
	(11); -- Guarulhos
SELECT * FROM ddd;

CREATE TABLE ddi (
    idDDI INT PRIMARY KEY
);
INSERT INTO ddi (idDDI) 
VALUES 
    (55);
SELECT * FROM ddi;

CREATE TABLE fone_responsavel (
    idFone SERIAL PRIMARY KEY,
	nro VARCHAR(20) NOT NULL,
	idDDD INT REFERENCES ddd(idDDD),
	idDDI INT REFERENCES ddi(idDDI),
	idResponsavel INT REFERENCES responsavel(idResponsavel)
);
INSERT INTO fone_responsavel (idFone, nro, idDDD, idDDI, idResponsavel) 
VALUES 
    (1, '99872-7070', 45, 55, 1),
	(2, '99875-7070', 48, 55, 2);
SELECT * FROM fone_responsavel;

CREATE TABLE email_responsavel (
    idEmail SERIAL PRIMARY KEY,
	endereco VARCHAR(50) NOT NULL,
	idResponsavel INT REFERENCES responsavel(idResponsavel)
);
INSERT INTO email_responsavel (idEmail, endereco, idResponsavel) 
VALUES 
    (1, 'ana_paula@gmail.com', 1),
	(2, 'joao_menezes@gmail.com', 2);
SELECT * FROM email_responsavel;
	
-- Sprint Planejamento Viagem

CREATE TABLE meio_transporte (
    idMeio SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL
);
INSERT INTO meio_transporte (idMeio, nome) 
VALUES 
    (1, 'Avião'),
	(2, 'Carro'),
	(3, 'Ônibus'),
	(4, 'Trem');
SELECT * FROM meio_transporte;

CREATE TABLE motivo (  
    idMotivo SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL
);
INSERT INTO motivo (idMotivo, nome) 
VALUES 
    (1, 'Reunião com Clientes'),
	(2, 'Treinamento'),
	(3, 'Evento'),
	(4, 'Congresso'),
	(5, 'Visita Técnica');
SELECT * FROM motivo;

CREATE TABLE status (
    idStatus SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
	justificativa VARCHAR(100) NOT NULL
);
INSERT INTO status (idStatus, nome, justificativa) 
VALUES 
    (1, 'Rascunho', ''),
	(2, 'Solicitada', ''),
	(3, 'Aprovada', ''),
	(4, 'Rejeitada', '');
SELECT * FROM status;

CREATE TABLE tipo_despesa (
    idTipo SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL
); 
INSERT INTO tipo_despesa (idTipo, nome) 
VALUES 
    (1, 'Alimentação'),
	(2, 'Transporte'),
	(3, 'Hotel'),
	(4, 'Combustível'),
	(5, 'Outros');
SELECT * FROM tipo_despesa;

CREATE TABLE viagem ( 
    idViagem SERIAL PRIMARY KEY,
	data_inicio DATE NOT NULL,
	data_fim DATE NOT NULL,
	idOrigem INT NOT NULL REFERENCES cidade(idCidade),
	idDestino INT NOT NULL REFERENCES cidade(idCidade),
	idMeio INT REFERENCES meio_transporte(idMeio),
	idMotivo INT REFERENCES motivo(idMotivo),
	idStatus INT REFERENCES status(idStatus),
	idTipo INT REFERENCES tipo_despesa(idTipo),
	idResponsavel INT REFERENCES responsavel(idResponsavel)
);
SELECT * FROM viagem;

CREATE TABLE despesas (
	data_despesa DATE NOT NULL,
	descricao VARCHAR(100) NOT NULL,
	valor MONEY NOT NULL,
	idViagem INT REFERENCES viagem(idViagem),
	idTipo INT REFERENCES tipo_despesa(idTipo)
);
SELECT * FROM despesas;
