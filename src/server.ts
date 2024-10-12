import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => {
    res.send('home pagr');
})

app.get('/movies', async (req, res) => {
    const sort = req.query.sort
    const sinopse = req.query.sinopse as string
    let orderBy: Prisma.FilmeOrderByWithRelationInput | Prisma.FilmeOrderByWithRelationInput[] | undefined;

    if (sort === 'titulo') {
        orderBy = {
            titulo: 'asc'
        }
    }
    if (sort === 'ano_lancamento') {
        orderBy = {
            ano_lancamento: 'desc'
        }
    }

    try {
        const movies = await prisma.filme.findMany({
            where: {
                sinopse: {
                    contains: sinopse,
                    mode: 'insensitive'
                }
            },
            orderBy,
            include: {
                generos: true,
                elenco_filme: true
            }
        })

        if(movies.length === 0){
            return res.status(404).send({ message: 'Filme não encontrado' })
        }

        const totalFilmes = movies.length
        const duracao = []
        let soma = 0

        movies.forEach((item) => {
            duracao.push(item.duracao_minutos)
            soma += Number(item.duracao_minutos);
        })

        const mediaDuracao = soma / duracao.length

        res.json(
            {
                totalMovies: totalFilmes,
                mediaDuracao: mediaDuracao,
                movies: movies
            }
        );
      
    } catch {
        return res.status(500).send({ message: 'erro no servidor' })
    }
})

app.post('/movies', async (req, res) => {

    const { titulo, ano_lancamento, duracao_minutos, classificacao_etaria, diretor_id, genero_id, sinopse } = req.body;

    try {
        const movieWithSameTitle = await prisma.filme.findFirst({
            where: {
                titulo: { equals: titulo, mode: 'insensitive' } //retorna independete de esar maiusculo ou minusculo
            }
        })

        if (movieWithSameTitle) {
            return res.status(409).send({
                message:
                    'ja existe um filme com esse título'
            }) //dado duplicado
        }

        await prisma.filme.create({
            data: {
                titulo,
                ano_lancamento, //new Date(2020, 0, 1)
                duracao_minutos,
                classificacao_etaria,
                diretor_id,
                genero_id,
                sinopse
            }
        });
    } catch (error) {
        console.error('Erro ao cadastrar filme:', error);
        return res.status(500).send({ message: 'falha ao cadastrar um filme' })
    }

    res.status(201).send()
})

app.put('/movies/:id', async (req, res) => {
    const id = Number(req.params.id) //converte para numero
    try {
        const movie = await prisma.filme.findUnique({
            where: {
                id
            }
        })
        if (!movie) {
            return res.status(404).send({ message: 'Filme não encontrado' })
        }

        const data = { ...req.body };

        await prisma.filme.update({
            where: {
                id
            },
            data: data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Erro ao atualizar registro' })
    }
    res.status(200).send({ message: 'Filme atualizado' })

})

app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id)
    const movie = await prisma.filme.findUnique({ where: { id } })

    if (!movie) {
        return res.status(404).send({ message: 'filme nao encontrado' })
    }

    await prisma.filme.delete({ where: { id } })

    res.status(200).send({ message: 'filme deletado' })
})

app.get('/movies/:genero', async (req, res) => {
    try {
        const moviesFilteredByGenre = await prisma.filme.findMany({
            include: {
                generos: true,
            },
            where: {
                generos: {
                    nome: {
                        equals: req.params.genero,
                        mode: "insensitive"
                    }
                }
            }
        })

        res.status(200).send(moviesFilteredByGenre)
    } catch {
        res.status(500).send({ message: 'erro no servidor' })
    }
})

//generos

app.put('/genero/:id', async (req, res) => {
    const id = Number(req.params.id)
    const data = { ...req.body };

    const genero = await prisma.generos.findUnique({
        where: {
            id
        }
    })
    if (!genero) {
        return res.status(404).send({ message: 'Genero não encontrado' })
    }

    const findGenero = await prisma.generos.findFirst({
        where: {
            nome: {
                equals: data.nome,
                mode: 'insensitive'
            }
        }
    })

    if (findGenero) {
        return res.status(409).send({ message: "Este nome de gênero já existe." });
    }


    await prisma.generos.update({
        where: {
            id
        },
        data: data
    })

    res.status(200).send({ message: 'Genero atualizado' })

})

app.post('/genero', async (req, res) => {
    const { nome } = req.body;

    try {
        const genreWithSameTitle = await prisma.generos.findFirst({
            where: {
                nome: { equals: nome, mode: 'insensitive' }
            }
        })

        if (genreWithSameTitle) {
            return res.status(409).send({
                message:
                    'ja existe um genero com esse título'
            }) //dado duplicado
        }

        await prisma.generos.create({
            data: {
                nome
            }
        });
    } catch (error) {
        console.error('Erro ao cadastrar genero:', error);
        return res.status(500).send({ message: 'falha ao cadastrar um genero' })
    }

    res.status(201).send({ message: 'genero salvo' })
})

app.get('/genero', async (_, res) => {
    const genero = await prisma.generos.findMany({
        orderBy: {
            nome: 'asc'
        },
        include: {
            filmes: true,
        }
    })
    res.json(genero);
})

app.delete('/genero/:id', async (req, res) => {
    const id = Number(req.params.id)
    const genero = await prisma.generos.findUnique({ where: { id } })

    if (!genero) {
        return res.status(404).send({ message: 'genero nao encontrado' })
    }

    await prisma.generos.delete({ where: { id } })

    res.status(200).send({ message: 'genero deletado' })
})

app.listen(port, () => {
    console.log('servidor ligado');
})