const Aluno = require('../models/Aluno')

class AlunoRepositorio {

    async findAll() {
        return await Aluno.findAll()
    }

    async findById(id) {
        return await Aluno.findByPk(id)
    }

    async create(aluno) {
        return await Aluno.create(aluno)
    }

}

module.exports = new AlunoRepositorio()