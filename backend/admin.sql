-- Removendo as tabelas e sequências existentes, caso elas já existam
DROP TABLE CONTAS;
DROP SEQUENCE SEQ_CONTAS;

-- Criando a tabela CONTAS
CREATE TABLE CONTAS
(
    id INT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_nascimento VARCHAR(10) NOT NULL,
    tipo_usuario VARCHAR(9),
    saldo DECIMAL,
    token VARCHAR2(10)
);

-- Criando a sequência para IDs de CONTAS
CREATE SEQUENCE SEQ_CONTAS START WITH 1 INCREMENT BY 1;

-- Inserindo dados na tabela CONTAS
INSERT INTO CONTAS
    (ID, NOME_COMPLETO, EMAIL, SENHA, DATA_NASCIMENTO, TIPO_USUARIO, SALDO)
VALUES
    (
        SEQ_CONTAS.NEXTVAL,
        'Christian Lindoso',
        'chlindoso@gmail.com',
        '123ch',
        '04/09/2021',
        'ADMIN',
        0
);

COMMIT;

-- Removendo as tabelas e sequências existentes, caso elas já existam
DROP TABLE EVENTOS;
DROP SEQUENCE SEQ_EVENTOS;

-- Criando a tabela EVENTOS
CREATE TABLE EVENTOS
(
    evento_id INT PRIMARY KEY,
    titulo_evento VARCHAR(50),
    descricao_evento VARCHAR(150),
    data_inicio_evento VARCHAR(10),
    data_final_evento VARCHAR(10),
    status_evento VARCHAR(20),
    veredito VARCHAR(3),
    valor_vitorias DECIMAL,
    valor_derrotas DECIMAL,
    fk_id_conta INT,
    FOREIGN KEY (fk_id_conta) REFERENCES CONTAS(id)
);

-- Criando a sequência para IDs de EVENTOS
CREATE SEQUENCE SEQ_EVENTOS START WITH 1 INCREMENT BY 1;

-- Inserindo dados na tabela EVENTOS
INSERT INTO EVENTOS
    (
    evento_id,
    titulo_evento,
    descricao_evento,
    data_inicio_evento,
    data_final_evento,
    status_evento,
    fk_id_conta
    )
VALUES
    (
        SEQ_EVENTOS.NEXTVAL,
        'teste',
        'teste',
        '05/01/2022',
        '08/06/2024',
        'Concluido',
        1
);

COMMIT;

-- Removendo as tabelas e sequências existentes, caso elas já existam
DROP TABLE APOSTAS;
DROP SEQUENCE SEQ_APOSTAS;

-- Criando a sequência para IDs de APOSTAS
CREATE SEQUENCE SEQ_APOSTAS START WITH 1 INCREMENT BY 1;

-- Criando a tabela APOSTAS
CREATE TABLE APOSTAS
(
    aposta_id INT PRIMARY KEY,
    valor_aposta DECIMAL,
    opcao_aposta VARCHAR(10) NOT NULL,
    fk_email_conta VARCHAR2(100) NOT NULL,
    fk_id_evento INT NOT NULL,
    proporcao_usuario DECIMAL,
    FOREIGN KEY (fk_email_conta) REFERENCES CONTAS(email),
    FOREIGN KEY (fk_id_evento) REFERENCES EVENTOS(evento_id)
);

-- Inserindo dados na tabela APOSTAS
INSERT INTO APOSTAS
    (
    aposta_id,
    valor_aposta,
    opcao_aposta,
    fk_email_conta,
    fk_id_evento
    )
VALUES
    (
        SEQ_APOSTAS.NEXTVAL,
        200,
        'Não',
        'chlindoso@gmail.com',
        1
);

COMMIT;
