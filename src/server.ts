import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000; 
const app = express();
const prisma = new PrismaClient();

app.get('/', (req, res)=>{
    res.send('home pagr');
})

app.get('/movies', async (req, res)=>{
   const movies = await prisma.filme.findMany()
   res.json(movies);
})


app.listen(port, ()=>{
    console.log('servidor ligado');
})