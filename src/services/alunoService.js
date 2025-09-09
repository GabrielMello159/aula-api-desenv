const alunoRepositorio = require('../repositories/alunoRepositorio')

class AlunoService {
    async findAll() {
        return await alunoRepositorio.findAll()
    }

    async findById(id) {
        const aluno = await alunoRepositorio.findById(id)
        if (!aluno) {
            throw new Error('Cara tem certeza que é esse id?')
        }
        return aluno
    }

    async create(alunoData) {
        const { nome, ra } = alunoData
        
        if (!nome || !ra) {
            throw new Error('Nome e RA são obrigatórios')
        }

        return await alunoRepositorio.create(alunoData)
    }

    async update(id, alunoData) {
        const aluno = await alunoRepositorio.update(id, alunoData)
        if (!aluno) {
            throw new Error('Cara tem certeza que é esse id?')
        }
        return aluno
    }

    async delete(id) {
        const deleted = await alunoRepositorio.delete(id)
        if (!deleted) {
            throw new Error('Cara tem certeza que é esse id?')
        }
        return { message: 'Aluno removido com sucesso' }
    }
}

module.exports = new AlunoService()