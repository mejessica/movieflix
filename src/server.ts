import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('home pagr');
})

app.get('/movies', async (_, res) => {
    const movies = await prisma.filme.findMany({
        orderBy: {
            titulo: 'asc'
        },
        include: {
            generos: true,
            elenco_filme: true
        }
    })
    res.json(movies);
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
    try{
    const movie = await prisma.filme.findUnique({
        where: {
            id
        }
    })
    if(!movie){
        return res.status(404).send({message: 'Filme não encontrado'})
    }
   
    const data = { ...req.body };

    await prisma.filme.update({
        where: {
            id
        },
        data: data
    })
    }catch(error){
        console.log(error)
        return res.status(500).send({message: 'Erro ao atualizar registro'})
    }
    res.status(200).send({ message: 'Filme atualizado' })

})

app.listen(port, () => {
    console.log('servidor ligado');
})