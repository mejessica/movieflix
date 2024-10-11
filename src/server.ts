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
    }catch(error){
        return res.status(500).send({message: 'falha ao cadastrar um filme'})
    }

    res.status(201).send()
})

app.listen(port, () => {
    console.log('servidor ligado');
})