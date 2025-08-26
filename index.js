const express = require("express")
const swaggerUi = require ("swagger-ui-express")
const swaggerJsdoc = require ("swagger-jsdoc")
const swaggerOptions = require ("./extend/swagger")
const app = express()
const port = 3000
const specs = swaggerJsdoc(swaggerOptions)

app.use(express.json())

/**
 * @swagger
 * components:
 *  schemas:
 *      Aluno:
 *          type: object    
 *          required:
 *              - id
 *              - nome  
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Identificador do Aluno
 *              nome:
 *                  type: string
 *                  description: Nome do Aluno
 *          exemple:
 *              id: 1
 *              nome: Gabriel Mello    
 */

let alunos = [

    { id: 1, nome: "João" },
    
    { id: 2, nome: "Pedro" }
]

/**
 * @swagger
 * /aluno: 
 *  get:
 *      summary: Retorna todos os alunos cadastrados
 *      tags: [Alunos]
 *      responses:
 *          200:
 *              description: Lista de Alunos
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/Aluno'
 */

app.get('/aluno', (req, res) => {
    res.json(alunos)

})

app.post('/aluno', (req, res) => {
    const novoAluno = { id: alunos.length + 1, ...req.body }
    alunos.push(novoAluno)
    res.status(201).json(novoAluno)
    console.log("Gerou essa bagaça")
})

/**
 * @swagger
 * /aluno: 
 *  post:
 *      summary: Criar um novo aluno
 *      tags: [Alunos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nome:
 *                              type: string
 *      responses:
 *          201:
 *              description: Aluno Criado!
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Aluno'
 */

app.put('/aluno/:id', (req, res) => {

    const { id } = req.params
    const alunoIndex = alunos.findIndex(a => a.id == id)
    
    if (alunoIndex > -1) {
        alunos[alunoIndex] = { id: Number(id), ...req.body }
        res.status(200).json(alunos[alunoIndex])

    } else {

        res.status(404).json({ message: "Aluno não Encontrado" })

    }

})

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(specs))

app.listen(port, () => {
    console.log("Servidor de API funcionando")

})