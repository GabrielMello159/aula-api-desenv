const express = require("express")
const swaggerUi = require ("swagger-ui-express")
const swaggerJsdoc = require ("swagger-jsdoc")
const swaggerOptions = require ("./extend/swagger")
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = 'PenaltiFoiPix'

const app = express()
const port = 3000
const specs = swaggerJsdoc(swaggerOptions)

app.use(express.json())

const authenticateToken = (req, res, next) => {
    

    const authHeader = req.headers['authorization']
    console.log("----authHeader", authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        res.status(401).json({"message": "Token obrigatório"})

    }

    jwt.verify(token, JWT_SECRET),(err, user) => {
         if (err) {
            return res.status(403).json({"message": "token insvalido"})
         }   
         req.user = user
         next()

    }

}


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

let usuario = []

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

app.get('/aluno', authenticateToken, (req, res) => {
    res.json(alunos)

})

app.post('/aluno', authenticateToken, (req, res) => {
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

app.put('/aluno/:id', authenticateToken, (req, res) => {

    const { id } = req.params
    const alunoIndex = alunos.findIndex(a => a.id == id)
    
    if (alunoIndex > -1) {
        alunos[alunoIndex] = { id: Number(id), ...req.body }
        res.status(200).json(alunos[alunoIndex])

    } else {

        res.status(404).json({ message: "Aluno não Encontrado" })

    }    

})

/**
 * @swagger
 * /aluno/{id}:
 *   put:
 *     summary: Atualizar os dados de um aluno existente
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 */



/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:  
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Usuário já existe
 */


app.post('/auth/register', async (req, res) => {

const {nome, email, senha} = req.body;

const usuarioExistente = usuario.find(u => u.nome === nome)
if(usuarioExistente){
    return res.status(400).json({"message": "E-mail ja cadastrado"})

}

/**
* @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Credenciais inválidas
 */

const senhaHash = await bcrypt.hash(senha, 10)
const novoUsuario = {
  id: usuario.lenght + 1,
  nome,
  email,
  senha : senhaHash

}

usuario.push(novoUsuario)
res.status(201).json({"message": "Usuario criado com sucesso"})

})

app.post('/auth/login', async (req,res) => {
const {email, senha} = req.body

const senhaHash = await bcrypt.hash(senha, 10)
const usuarioExistente = usuario.find (u => u.email === email)
const senhaValida = await bcrypt.compare(senha, usuarioExistente.senha)

if(!senhaValida){
    return res.status(401).json({"message": "Credenciais invalidas"})
}

const token = jwt.sign(

    {id: usuarioExistente.id, nome: usuarioExistente.nome, email: usuarioExistente.email},
    JWT_SECRET,
    { expiresIn: '1h'}
)

res.json({token})

})


app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(specs))

app.listen(port, () => {
    console.log("Servidor de API funcionando")

})