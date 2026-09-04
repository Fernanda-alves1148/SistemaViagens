INSERT INTO cidade (idcidade, nome, siglauf)
VALUES
    (1, 'Foz do Iguaçu', 'PR'),
    (2, 'Joinville', 'SC'),
    (3, 'Guarulhos', 'SP')
ON CONFLICT (idcidade) DO NOTHING;

INSERT INTO responsavel
    (matricula, nome, cpf, nro, complemento, setor, idendereco)
VALUES
    (1, 'Ana Paula Dias', '720.720.720-20', 72, 'casa', 'TI', 1),
    (2, 'João Menezes', '750.750.750-50', 75, 'casa', 'TI', 2)
ON CONFLICT (matricula) DO NOTHING;

INSERT INTO motivo (idmotivo, nome)
VALUES
    (1, 'Reunião com Clientes'),
    (2, 'Treinamento'),
    (3, 'Evento'),
    (4, 'Congresso'),
    (5, 'Visita Técnica')
ON CONFLICT (idmotivo) DO NOTHING;

INSERT INTO status (idstatus, nome, justificativa)
VALUES
    (1, 'Rascunho', ''),
    (2, 'Solicitada', ''),
    (3, 'Aprovada', ''),
    (4, 'Rejeitada', '')
ON CONFLICT (idstatus) DO NOTHING;

INSERT INTO meio_transporte (idmeio, nome)
VALUES
    (1, 'Avião'),
    (2, 'Carro'),
    (3, 'Ônibus'),
    (4, 'Trem')
ON CONFLICT (idmeio) DO NOTHING;
