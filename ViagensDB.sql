-- ============================================================
-- SGV - Sistema de Gestão de Viagens
-- Banco de dados PostgreSQL
-- Versão revisada conforme as regras do projeto
-- ============================================================

-- Execute este arquivo conectado ao banco SGV.
-- Ele recria as tabelas do sistema.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. LIMPEZA
-- ------------------------------------------------------------
DROP TABLE IF EXISTS despesa CASCADE;
DROP TABLE IF EXISTS historico_status_viagem CASCADE;
DROP TABLE IF EXISTS viagem CASCADE;
DROP TABLE IF EXISTS usuario_perfil CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS historico_empregado CASCADE;
DROP TABLE IF EXISTS empregado CASCADE;
DROP TABLE IF EXISTS perfil CASCADE;
DROP TABLE IF EXISTS cargo CASCADE;
DROP TABLE IF EXISTS area CASCADE;
DROP TABLE IF EXISTS motivo CASCADE;
DROP TABLE IF EXISTS meio_transporte CASCADE;
DROP TABLE IF EXISTS tipo_despesa CASCADE;
DROP TABLE IF EXISTS endereco CASCADE;
DROP TABLE IF EXISTS bairro CASCADE;
DROP TABLE IF EXISTS logradouro CASCADE;
DROP TABLE IF EXISTS tipo_logradouro CASCADE;
DROP TABLE IF EXISTS cidade CASCADE;
DROP TABLE IF EXISTS uf CASCADE;

-- ------------------------------------------------------------
-- 2. ENDEREÇO
-- ------------------------------------------------------------

CREATE TABLE uf (
    sigla_uf CHAR(2) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO uf (sigla_uf, nome) VALUES
    ('PR', 'Paraná'),
    ('SC', 'Santa Catarina'),
    ('SP', 'São Paulo');

CREATE TABLE cidade (
    id_cidade SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sigla_uf CHAR(2) NOT NULL REFERENCES uf(sigla_uf),
    UNIQUE (nome, sigla_uf)
);

INSERT INTO cidade (nome, sigla_uf) VALUES
    ('Foz do Iguaçu', 'PR'),
    ('Curitiba', 'PR'),
    ('Joinville', 'SC'),
    ('Guarulhos', 'SP'),
    ('São Paulo', 'SP');

CREATE TABLE tipo_logradouro (
    sigla_tipo CHAR(2) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipo_logradouro (sigla_tipo, nome) VALUES
    ('Av', 'Avenida'),
    ('R', 'Rua');

CREATE TABLE logradouro (
    id_logradouro SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sigla_tipo CHAR(2) NOT NULL REFERENCES tipo_logradouro(sigla_tipo),
    UNIQUE (nome, sigla_tipo)
);

INSERT INTO logradouro (nome, sigla_tipo) VALUES
    ('Avenida Brasil', 'Av'),
    ('Rua das Palmeiras', 'R'),
    ('Avenida Paulo Faccini', 'Av'),
    ('Rua XV de Novembro', 'R');

CREATE TABLE bairro (
    id_bairro SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL
);

INSERT INTO bairro (nome) VALUES
    ('Centro'),
    ('América'),
    ('Macedo'),
    ('Centro');

CREATE TABLE endereco (
    id_endereco SERIAL PRIMARY KEY,
    id_bairro INT NOT NULL REFERENCES bairro(id_bairro),
    id_cidade INT NOT NULL REFERENCES cidade(id_cidade),
    id_logradouro INT NOT NULL REFERENCES logradouro(id_logradouro),
    numero INT NOT NULL CHECK (numero > 0),
    complemento VARCHAR(100)
);

INSERT INTO endereco
    (id_bairro, id_cidade, id_logradouro, numero, complemento)
VALUES
    (1, 1, 1, 72, 'Casa'),
    (2, 3, 2, 75, 'Casa'),
    (3, 4, 3, 1200, 'Sala 10'),
    (4, 2, 4, 500, 'Sala 3');

-- ------------------------------------------------------------
-- 3. CADASTROS DE CARGO, ÁREA E PERFIL
-- ------------------------------------------------------------

CREATE TABLE cargo (
    id_cargo SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO cargo (nome) VALUES
    ('COLABORADOR'),
    ('GESTOR');

CREATE TABLE area (
    id_area SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

INSERT INTO area (nome) VALUES
    ('INFORMATICA'),
    ('RECURSOS HUMANOS'),
    ('FINANCEIRO'),
    ('COMERCIAL');

CREATE TABLE perfil (
    id_perfil SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE,
    descricao VARCHAR(200)
);

INSERT INTO perfil (nome, descricao) VALUES
    ('COLABORADOR', 'Pode cadastrar, editar, solicitar e cancelar suas viagens conforme o fluxo.'),
    ('GESTOR', 'Pode analisar viagens solicitadas e aprovar, rejeitar ou solicitar ajustes.'),
    ('CONSULTA', 'Pode consultar viagens e informações gerenciais, sem alterar dados.');

-- ------------------------------------------------------------
-- 4. EMPREGADO
-- ------------------------------------------------------------

CREATE TABLE empregado (
    matricula VARCHAR(6) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    id_endereco INT REFERENCES endereco(id_endereco),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    -- Formato XXXX-X, somente dígitos.
    CONSTRAINT ck_empregado_matricula
        CHECK (matricula ~ '^[0-9]{4}-[0-9]$')
);

-- ------------------------------------------------------------
-- 5. HISTÓRICO DO EMPREGADO
-- ------------------------------------------------------------
-- Cada período de atuação do empregado possui cargo e área.
-- Assim, uma mudança de cargo/área não apaga o histórico anterior.

CREATE TABLE historico_empregado (
    id_historico_empregado SERIAL PRIMARY KEY,
    matricula VARCHAR(6) NOT NULL REFERENCES empregado(matricula),
    id_cargo INT NOT NULL REFERENCES cargo(id_cargo),
    id_area INT NOT NULL REFERENCES area(id_area),
    data_inicio DATE NOT NULL,
    data_fim DATE,

    CONSTRAINT ck_historico_datas
        CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);

-- Evita dois períodos ativos simultaneamente para o mesmo empregado.
CREATE UNIQUE INDEX uq_historico_empregado_ativo
    ON historico_empregado (matricula)
    WHERE data_fim IS NULL;

-- ------------------------------------------------------------
-- 6. USUÁRIOS DA APLICAÇÃO E PERFIS
-- ------------------------------------------------------------

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    matricula VARCHAR(6) NOT NULL UNIQUE REFERENCES empregado(matricula),
    login VARCHAR(50) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuario_perfil (
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_perfil INT NOT NULL REFERENCES perfil(id_perfil),
    PRIMARY KEY (id_usuario, id_perfil)
);

-- ------------------------------------------------------------
-- 7. CONTATOS
-- ------------------------------------------------------------

CREATE TABLE ddd (
    id_ddd INT PRIMARY KEY
);

INSERT INTO ddd (id_ddd) VALUES
    (11), (41), (45), (47);

CREATE TABLE ddi (
    id_ddi INT PRIMARY KEY
);

INSERT INTO ddi (id_ddi) VALUES (55);

CREATE TABLE telefone_empregado (
    id_telefone SERIAL PRIMARY KEY,
    numero VARCHAR(20) NOT NULL,
    id_ddd INT NOT NULL REFERENCES ddd(id_ddd),
    id_ddi INT NOT NULL REFERENCES ddi(id_ddi),
    matricula VARCHAR(6) NOT NULL REFERENCES empregado(matricula)
);

CREATE TABLE email_empregado (
    id_email SERIAL PRIMARY KEY,
    endereco VARCHAR(150) NOT NULL UNIQUE,
    matricula VARCHAR(6) NOT NULL REFERENCES empregado(matricula)
);

-- ------------------------------------------------------------
-- 8. PLANEJAMENTO DA VIAGEM
-- ------------------------------------------------------------

CREATE TABLE meio_transporte (
    id_meio SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO meio_transporte (nome) VALUES
    ('Avião'),
    ('Carro'),
    ('Ônibus'),
    ('Trem');

CREATE TABLE motivo (
    id_motivo SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

INSERT INTO motivo (nome) VALUES
    ('Reunião com Clientes'),
    ('Treinamento'),
    ('Evento'),
    ('Congresso'),
    ('Visita Técnica');

-- Situações exigidas pelo fluxo:
-- Rascunho -> Solicitada -> Aprovada/Rejeitada
-- Solicitada -> Ajustes -> Solicitada
-- Rascunho -> Cancelada
-- Ajustes -> Cancelada

CREATE TABLE status_viagem (
    id_status SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO status_viagem (nome) VALUES
    ('Rascunho'),
    ('Solicitada'),
    ('Ajustes'),
    ('Aprovada'),
    ('Rejeitada'),
    ('Cancelada');

-- ------------------------------------------------------------
-- 9. VIAGEM
-- ------------------------------------------------------------

CREATE TABLE viagem (
    id_viagem SERIAL PRIMARY KEY,

    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,

    id_origem INT NOT NULL REFERENCES cidade(id_cidade),
    id_destino INT NOT NULL REFERENCES cidade(id_cidade),

    id_motivo INT NOT NULL REFERENCES motivo(id_motivo),
    id_meio_transporte INT NOT NULL REFERENCES meio_transporte(id_meio),

    id_status INT NOT NULL DEFAULT 1 REFERENCES status_viagem(id_status),

    -- Empregado que solicitou/cadastrou a viagem.
    matricula_solicitante VARCHAR(6) NOT NULL REFERENCES empregado(matricula),

    -- Snapshot do cargo e da área no momento da solicitação.
    id_historico_empregado INT NOT NULL REFERENCES historico_empregado(id_historico_empregado),

    -- Informação registrada pelo gestor quando solicita ajustes ou rejeita.
    justificativa TEXT,

    CONSTRAINT ck_viagem_datas
        CHECK (data_fim >= data_inicio)
);

-- ------------------------------------------------------------
-- 10. HISTÓRICO DE STATUS DA VIAGEM
-- ------------------------------------------------------------

CREATE TABLE historico_status_viagem (
    id_historico_status SERIAL PRIMARY KEY,
    id_viagem INT NOT NULL REFERENCES viagem(id_viagem) ON DELETE CASCADE,
    id_status INT NOT NULL REFERENCES status_viagem(id_status),

    data_alteracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Responsável pela alteração:
    -- colaborador, gestor ou outro usuário autorizado.
    id_usuario_responsavel INT NOT NULL REFERENCES usuario(id_usuario),

    observacao TEXT
);

-- ------------------------------------------------------------
-- 11. DESPESAS
-- ------------------------------------------------------------

CREATE TABLE tipo_despesa (
    id_tipo SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO tipo_despesa (nome) VALUES
    ('Hospedagem'),
    ('Alimentação'),
    ('Transporte'),
    ('Combustível'),
    ('Pedágio'),
    ('Outras');

CREATE TABLE despesa (
    id_despesa SERIAL PRIMARY KEY,
    data_despesa DATE NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    id_viagem INT NOT NULL REFERENCES viagem(id_viagem) ON DELETE CASCADE,
    id_tipo INT NOT NULL REFERENCES tipo_despesa(id_tipo),

    CONSTRAINT ck_despesa_valor
        CHECK (valor > 0),
);

-- ------------------------------------------------------------
-- 12. DADOS DE EXEMPLO
-- ------------------------------------------------------------

INSERT INTO empregado (matricula, nome, cpf, id_endereco) VALUES
    ('0001-1', 'WILLIAN SILVA', '111.111.111-11', 1),
    ('0002-2', 'ANA PAULA DIAS', '222.222.222-22', 2),
    ('0003-3', 'JOÃO MENEZES', '333.333.333-33', 3),
    ('0004-4', 'MARIA COSTA', '444.444.444-44', 4),
    ('0005-5', 'CARLOS OLIVEIRA', '555.555.555-55', 1);

-- Histórico do WILLIAN:
-- 01/08 a 01/09: COLABORADOR / INFORMATICA
-- 02/09 a 09/09: COLABORADOR / RECURSOS HUMANOS
-- 10/09 em diante: GESTOR / RECURSOS HUMANOS

INSERT INTO historico_empregado
    (matricula, id_cargo, id_area, data_inicio, data_fim)
VALUES
    ('0001-1', 1, 1, '2026-08-01', '2026-09-01'),
    ('0001-1', 1, 2, '2026-09-02', '2026-09-09'),
    ('0001-1', 2, 2, '2026-09-10', NULL),

    ('0002-2', 1, 1, '2026-01-01', NULL),
    ('0003-3', 1, 3, '2026-01-01', NULL),
    ('0004-4', 2, 4, '2026-01-01', NULL),
    ('0005-5', 1, 1, '2026-01-01', NULL);

-- Usuários de aplicação.
-- IMPORTANTE: as senhas abaixo são apenas exemplos acadêmicos.
-- Em produção, use hashes reais (BCrypt/Argon2/etc.).

INSERT INTO usuario (matricula, login, senha_hash) VALUES
    ('0001-1', 'willian', 'TROCAR_POR_HASH_BCRYPT'),
    ('0002-2', 'ana', 'TROCAR_POR_HASH_BCRYPT'),
    ('0003-3', 'joao', 'TROCAR_POR_HASH_BCRYPT'),
    ('0004-4', 'maria', 'TROCAR_POR_HASH_BCRYPT'),
    ('0005-5', 'carlos', 'TROCAR_POR_HASH_BCRYPT');

-- WILLIAN: atualmente gestor
-- ANA e JOÃO: colaboradores
-- MARIA: gestora
-- CARLOS: consulta

INSERT INTO usuario_perfil (id_usuario, id_perfil) VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (4, 2),
    (5, 3);

-- Telefones
INSERT INTO telefone_empregado (numero, id_ddd, id_ddi, matricula) VALUES
    ('99872-7070', 45, 55, '0001-1'),
    ('99875-7070', 41, 55, '0002-2'),
    ('99876-7070', 45, 55, '0003-3'),
    ('99877-7070', 11, 55, '0004-4'),
    ('99878-7070', 41, 55, '0005-5');

-- E-mails
INSERT INTO email_empregado (endereco, matricula) VALUES
    ('willian@empresa.com', '0001-1'),
    ('ana@empresa.com', '0002-2'),
    ('joao@empresa.com', '0003-3'),
    ('maria@empresa.com', '0004-4'),
    ('carlos@empresa.com', '0005-5');

-- ------------------------------------------------------------
-- 13. TRIGGERS E FUNÇÕES DE REGRAS DE NEGÓCIO
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- 13.1 Validação do vínculo histórico da viagem
-- ------------------------------------------------------------
-- Garante que o histórico escolhido pertence ao solicitante.

CREATE OR REPLACE FUNCTION fn_validar_historico_viagem()
RETURNS TRIGGER AS $$
DECLARE
    v_matricula VARCHAR(6);
BEGIN
    SELECT matricula
      INTO v_matricula
      FROM historico_empregado
     WHERE id_historico_empregado = NEW.id_historico_empregado;

    IF v_matricula IS NULL THEN
        RAISE EXCEPTION 'Histórico do empregado não encontrado.';
    END IF;

    IF v_matricula <> NEW.matricula_solicitante THEN
        RAISE EXCEPTION
            'O histórico informado não pertence ao empregado solicitante.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_historico_viagem
BEFORE INSERT OR UPDATE OF matricula_solicitante, id_historico_empregado
ON viagem
FOR EACH ROW
EXECUTE FUNCTION fn_validar_historico_viagem();

-- ------------------------------------------------------------
-- 13.2 Regras de alteração de status
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_validar_status_viagem()
RETURNS TRIGGER AS $$
DECLARE
    v_status_atual VARCHAR(20);
    v_novo_status VARCHAR(20);
    v_perfil_gestor BOOLEAN;
BEGIN
    IF OLD.id_status = NEW.id_status THEN
        RETURN NEW;
    END IF;

    SELECT nome INTO v_status_atual
      FROM status_viagem
     WHERE id_status = OLD.id_status;

    SELECT nome INTO v_novo_status
      FROM status_viagem
     WHERE id_status = NEW.id_status;

    -- Fluxos permitidos:
    -- Rascunho -> Solicitada
    -- Rascunho -> Cancelada
    -- Solicitada -> Aprovada
    -- Solicitada -> Rejeitada
    -- Solicitada -> Ajustes
    -- Ajustes -> Solicitada
    -- Ajustes -> Cancelada

    IF NOT (
        (v_status_atual = 'Rascunho' AND v_novo_status IN ('Solicitada', 'Cancelada'))
        OR
        (v_status_atual = 'Solicitada' AND v_novo_status IN ('Aprovada', 'Rejeitada', 'Ajustes'))
        OR
        (v_status_atual = 'Ajustes' AND v_novo_status IN ('Solicitada', 'Cancelada'))
    ) THEN
        RAISE EXCEPTION
            'Transição de status inválida: % -> %.',
            v_status_atual, v_novo_status;
    END IF;

    -- Aprovada, Rejeitada e Cancelada encerram o fluxo.
    IF v_status_atual IN ('Aprovada', 'Rejeitada', 'Cancelada') THEN
        RAISE EXCEPTION
            'A viagem já encerrou o fluxo e não pode ter o status alterado.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_status_viagem
BEFORE UPDATE OF id_status
ON viagem
FOR EACH ROW
EXECUTE FUNCTION fn_validar_status_viagem();

-- ------------------------------------------------------------
-- 13.3 Viagem solicitada: somente gestor pode analisar
-- ------------------------------------------------------------
-- A aplicação deve informar o usuário responsável pelo histórico
-- de status. Esta função impede a análise sem perfil de gestor.

CREATE OR REPLACE FUNCTION fn_validar_historico_status()
RETURNS TRIGGER AS $$
DECLARE
    v_status_anterior VARCHAR(20);
    v_status_novo VARCHAR(20);
    v_eh_gestor BOOLEAN;
BEGIN
    SELECT nome INTO v_status_novo
      FROM status_viagem
     WHERE id_status = NEW.id_status;

    SELECT EXISTS (
        SELECT 1
          FROM usuario_perfil up
          JOIN perfil p ON p.id_perfil = up.id_perfil
         WHERE up.id_usuario = NEW.id_usuario_responsavel
           AND p.nome = 'GESTOR'
    )
    INTO v_eh_gestor;

    IF v_status_novo IN ('Aprovada', 'Rejeitada', 'Ajustes')
       AND NOT v_eh_gestor THEN
        RAISE EXCEPTION
            'Somente usuários com perfil GESTOR podem analisar uma viagem.';
    END IF;

    -- Justificativa obrigatória para rejeição ou solicitação de ajustes.
    IF v_status_novo IN ('Rejeitada', 'Ajustes')
       AND (NEW.observacao IS NULL OR btrim(NEW.observacao) = '') THEN
        RAISE EXCEPTION
            'É obrigatória uma justificativa para rejeição ou solicitação de ajustes.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_historico_status
BEFORE INSERT ON historico_status_viagem
FOR EACH ROW
EXECUTE FUNCTION fn_validar_historico_status();

-- ------------------------------------------------------------
-- 13.4 Viagem rejeitada/cancelada não recebe despesa
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_validar_despesa_viagem()
RETURNS TRIGGER AS $$
DECLARE
    v_status VARCHAR(20);
    v_data_fim DATE;
BEGIN
    SELECT s.nome, v.data_fim
      INTO v_status, v_data_fim
      FROM viagem v
      JOIN status_viagem s ON s.id_status = v.id_status
     WHERE v.id_viagem = NEW.id_viagem;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Viagem não encontrada.';
    END IF;

    IF v_status <> 'Aprovada' THEN
        RAISE EXCEPTION
            'Despesas só podem ser registradas em viagens aprovadas.';
    END IF;

    IF NEW.valor <= 0 THEN
        RAISE EXCEPTION 'O valor da despesa deve ser maior que zero.';
    END IF;

    IF NEW.data_despesa > CURRENT_DATE THEN
        RAISE EXCEPTION 'A data da despesa não pode ser futura.';
    END IF;

    IF NEW.data_despesa < v_data_fim THEN
        -- Não bloqueia despesas durante a viagem.
        -- Esta condição fica intencionalmente sem ação.
        NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_despesa_viagem
BEFORE INSERT OR UPDATE ON despesa
FOR EACH ROW
EXECUTE FUNCTION fn_validar_despesa_viagem();

-- ------------------------------------------------------------
-- 13.5 Registro automático do histórico inicial
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_registrar_status_inicial()
RETURNS TRIGGER AS $$
DECLARE
    v_usuario INT;
BEGIN
    SELECT id_usuario
      INTO v_usuario
      FROM usuario
     WHERE matricula = NEW.matricula_solicitante
     LIMIT 1;

    IF v_usuario IS NOT NULL THEN
        INSERT INTO historico_status_viagem
            (id_viagem, id_status, id_usuario_responsavel, observacao)
        VALUES
            (NEW.id_viagem, NEW.id_status, v_usuario, 'Criação da viagem.');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_registrar_status_inicial
AFTER INSERT ON viagem
FOR EACH ROW
EXECUTE FUNCTION fn_registrar_status_inicial();



-- ------------------------------------------------------------
-- 13.6 Função recomendada para alteração de status
-- ------------------------------------------------------------
-- O backend deve usar esta função para que a alteração do status
-- e seu histórico sejam gravados na mesma transação.

CREATE OR REPLACE FUNCTION alterar_status_viagem(
    p_id_viagem INT,
    p_id_novo_status INT,
    p_id_usuario_responsavel INT,
    p_observacao TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_status_atual INT;
BEGIN
    SELECT id_status
      INTO v_status_atual
      FROM viagem
     WHERE id_viagem = p_id_viagem
     FOR UPDATE;

    IF v_status_atual IS NULL THEN
        RAISE EXCEPTION 'Viagem % não encontrada.', p_id_viagem;
    END IF;

    UPDATE viagem
       SET id_status = p_id_novo_status,
           justificativa = CASE
               WHEN p_observacao IS NOT NULL THEN p_observacao
               ELSE justificativa
           END
     WHERE id_viagem = p_id_viagem;

    INSERT INTO historico_status_viagem
        (id_viagem, id_status, id_usuario_responsavel, observacao)
    VALUES
        (p_id_viagem, p_id_novo_status, p_id_usuario_responsavel, p_observacao);
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 14. VIEWS ÚTEIS PARA O BACKEND E CONSULTAS
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW vw_viagens AS
SELECT
    v.id_viagem,
    v.data_inicio,
    v.data_fim,
    co.nome AS cidade_origem,
    ufo.sigla_uf AS uf_origem,
    cd.nome AS cidade_destino,
    ufd.sigla_uf AS uf_destino,
    mo.nome AS motivo,
    mt.nome AS meio_transporte,
    sv.nome AS status,
    e.matricula,
    e.nome AS solicitante,
    c.nome AS cargo_no_momento_da_solicitacao,
    a.nome AS area_no_momento_da_solicitacao,
    v.justificativa
FROM viagem v
JOIN cidade co ON co.id_cidade = v.id_origem
JOIN uf ufo ON ufo.sigla_uf = co.sigla_uf
JOIN cidade cd ON cd.id_cidade = v.id_destino
JOIN uf ufd ON ufd.sigla_uf = cd.sigla_uf
JOIN motivo mo ON mo.id_motivo = v.id_motivo
JOIN meio_transporte mt ON mt.id_meio = v.id_meio_transporte
JOIN status_viagem sv ON sv.id_status = v.id_status
JOIN empregado e ON e.matricula = v.matricula_solicitante
JOIN historico_empregado he ON he.id_historico_empregado = v.id_historico_empregado
JOIN cargo c ON c.id_cargo = he.id_cargo
JOIN area a ON a.id_area = he.id_area;

CREATE OR REPLACE VIEW vw_resumo_financeiro_viagem AS
SELECT
    v.id_viagem,
    COALESCE(SUM(d.valor), 0)::NUMERIC(12,2) AS total_gasto,
    COUNT(d.id_despesa) AS quantidade_despesas
FROM viagem v
LEFT JOIN despesa d ON d.id_viagem = v.id_viagem
GROUP BY v.id_viagem;

COMMIT;

-- ============================================================
-- 15. CONSULTAS DE TESTE
-- ============================================================

-- Empregados e seus históricos:
-- SELECT e.matricula, e.nome, c.nome AS cargo, a.nome AS area,
--        he.data_inicio, he.data_fim
-- FROM empregado e
-- JOIN historico_empregado he ON he.matricula = e.matricula
-- JOIN cargo c ON c.id_cargo = he.id_cargo
-- JOIN area a ON a.id_area = he.id_area
-- ORDER BY e.matricula, he.data_inicio;

-- Viagens:
-- SELECT * FROM vw_viagens;

-- Histórico de uma viagem:
-- SELECT h.data_alteracao, s.nome AS status, u.login, h.observacao
-- FROM historico_status_viagem h
-- JOIN status_viagem s ON s.id_status = h.id_status
-- JOIN usuario u ON u.id_usuario = h.id_usuario_responsavel
-- WHERE h.id_viagem = 1
-- ORDER BY h.data_alteracao;

-- Total gasto por viagem:
-- SELECT * FROM vw_resumo_financeiro_viagem;

-- Indicadores gerenciais:
-- SELECT COUNT(*) AS total_viagens FROM viagem;
-- SELECT COUNT(*) AS viagens_aprovadas
-- FROM viagem v JOIN status_viagem s ON s.id_status = v.id_status
-- WHERE s.nome = 'Aprovada';
-- SELECT COUNT(*) AS viagens_rejeitadas
-- FROM viagem v JOIN status_viagem s ON s.id_status = v.id_status
-- WHERE s.nome = 'Rejeitada';
-- SELECT COALESCE(SUM(valor),0) AS total_gasto FROM despesa;
-- SELECT AVG(total_gasto) AS custo_medio_por_viagem
-- FROM vw_resumo_financeiro_viagem;

-- ============================================================
-- SGV - Permissões do PostgreSQL
-- Execute este arquivo conectado ao banco SGV como postgres.
--
-- IMPORTANTE:
-- Perfil de COLABORADOR/GESTOR/CONSULTA é uma regra da aplicação.
-- Estes roles abaixo são permissões do próprio PostgreSQL.
-- ============================================================

-- 1. Cria grupos de permissões
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sgv_admin') THEN
        CREATE ROLE sgv_admin NOLOGIN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sgv_app') THEN
        CREATE ROLE sgv_app NOLOGIN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sgv_consulta') THEN
        CREATE ROLE sgv_consulta NOLOGIN;
    END IF;
END
$$;

-- 2. Cria usuários de banco.
-- Eles são exemplos para o trabalho acadêmico.
-- Depois de executar, defina uma senha com:
-- \password sgv_admin
-- \password sgv_app
-- \password sgv_consulta

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sgv_admin_user') THEN
        CREATE ROLE sgv_admin_user LOGIN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sgv_app_user') THEN
        CREATE ROLE sgv_app_user LOGIN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sgv_consulta_user') THEN
        CREATE ROLE sgv_consulta_user LOGIN;
    END IF;
END
$$;

-- 3. Herda as permissões dos grupos
GRANT sgv_admin TO sgv_admin_user;
GRANT sgv_app TO sgv_app_user;
GRANT sgv_consulta TO sgv_consulta_user;

-- 4. Permissão de conexão
GRANT CONNECT ON DATABASE sgv TO sgv_admin, sgv_app, sgv_consulta;

-- 5. Administrador: acesso total ao schema público.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sgv_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sgv_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO sgv_admin;

-- 6. Aplicação: leitura e escrita nas tabelas.
GRANT USAGE ON SCHEMA public TO sgv_app;
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public TO sgv_app;
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public TO sgv_app;
GRANT EXECUTE
ON FUNCTION alterar_status_viagem(INT, INT, INT, TEXT) TO sgv_app;

-- 7. Consulta: somente leitura.
GRANT USAGE ON SCHEMA public TO sgv_consulta;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO sgv_consulta;

-- 8. Permissões padrão para tabelas criadas futuramente.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sgv_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO sgv_consulta;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO sgv_app;

-- 9. Para verificar:
-- \du
-- \dp
