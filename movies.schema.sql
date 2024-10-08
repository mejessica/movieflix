
CREATE TABLE diretores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    nacionalidade VARCHAR(100)
);

CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE filmes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano_lancamento INTEGER NOT NULL,
    duracao_minutos INTEGER,
    classificacao_etaria VARCHAR(10),
    diretor_id INTEGER REFERENCES diretores(id),
    genero_id INTEGER REFERENCES generos(id),
    sinopse TEXT
);

CREATE TABLE atores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    nacionalidade VARCHAR(100)
);

CREATE TABLE elenco_filme (
    filme_id INTEGER REFERENCES filmes(id),
    ator_id INTEGER REFERENCES atores(id),
    papel VARCHAR(255),
    PRIMARY KEY (filme_id, ator_id)
);


INSERT INTO diretores (nome, data_nascimento, nacionalidade)
VALUES 
('Christopher Nolan', '1970-07-30', 'Britânico'),
('Quentin Tarantino', '1963-03-27', 'Americano'),
('Martin Scorsese', '1942-11-17', 'Americano');

INSERT INTO generos (nome)
VALUES 
('Ação'),
('Drama'),
('Comédia'),
('Suspense'),
('Ficção Científica');

INSERT INTO atores (nome, data_nascimento, nacionalidade)
VALUES 
('Leonardo DiCaprio', '1974-11-11', 'Americano'),
('Morgan Freeman', '1937-06-01', 'Americano'),
('Scarlett Johansson', '1984-11-22', 'Americana'),
('Tom Hardy', '1977-09-15', 'Britânico');

INSERT INTO filmes (titulo, ano_lancamento, duracao_minutos, classificacao_etaria, diretor_id, genero_id, sinopse)
VALUES 
('A Origem', 2010, 148, 'PG-13', 1, 5, 'Um ladrão que invade os sonhos das pessoas para roubar seus segredos tenta realizar um último trabalho.'),
('Django Livre', 2012, 165, 'R', 2, 1, 'Um escravo liberto une-se a um caçador de recompensas para resgatar sua esposa de um brutal fazendeiro.'),
('O Lobo de Wall Street', 2013, 180, 'R', 3, 2, 'A ascensão e queda do corretor de ações Jordan Belfort, que enriquece com fraudes no mercado financeiro.');

INSERT INTO elenco_filme (filme_id, ator_id, papel)
VALUES 
(1, 1, 'Dom Cobb'),
(2, 2, 'Django'),
(3, 1, 'Jordan Belfort'),
(3, 3, 'Mark Hanna'),
(1, 4, 'Eames');

