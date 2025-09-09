const swaggerOptions = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Api de Alunos',
            version: '1.0.0',
            description:'API par agerenciamento de alunos'
        },
        components:{
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'

                }
            }
        },
        security: [{

                bearerAuth:[]
        }],
        servers:[
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de Desenvolvimento'
            }
        ]
    },
    apis:['./src/routes/*.js']
}

module.exports = swaggerOptions