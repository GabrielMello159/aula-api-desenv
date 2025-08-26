const swaggerOptions = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Api de Alunos',
            version: '1.0.0',
            description:'API par agerenciamento de alunos'
        },
        servers:[
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de Desenvolvimento'
            }
        ]
    },
    apis:['./index.js']
}

module.exports = swaggerOptions