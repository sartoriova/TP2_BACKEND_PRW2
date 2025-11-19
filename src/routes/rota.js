const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/", (req, res) => {
  res.send("Bem vindo à Clinica Pet Feliz!!!");
});


/**
 * @swagger
 * /cadastrarVet:
 *   post:
 *     summary: Cadastra um novo veterinário.
 *     description: Insere um novo veterinário no banco de dados.
 *     tags: [Veterinários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Dr. João" }
 *               crmv: { type: string, example: "12345-SP" }
 *               data_nascimento: { type: string, format: date, example: "1985-04-12" }
 *               logradouro: { type: string, example: "Rua das Flores" }
 *               numero: { type: integer, example: 100 }
 *               bairro: { type: string, example: "Centro" }
 *               cep: { type: string, example: "12345-678" }
 *               cidade: { type: string, example: "São Paulo" }
 *               uf: { type: string, example: "SP" }
 *               telefone: { type: string, example: "(11) 99999-9999" }
 *               email: { type: string, example: "joao@clinica.com" }
 *     responses:
 *       200:
 *         description: Retorna o objeto veterinário cadastrado com sucesso.
 *       500:
 *         description: Erro interno ao cadastrar veterinário.
 */

router.post("/cadastrarVet", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const {nome, crmv, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email} = req.body;

      const r = await conexao.query("INSERT INTO veterinario (nome, crmv, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [nome, crmv, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});



/**
 * @swagger
 * /cadastrarTutor:
 *   post:
 *     summary: Cadastra um novo tutor.
 *     description: Insere um novo tutor no banco de dados.
 *     tags: [Tutores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Maria" }
 *               cpf: { type: string, example: "123.456.789-00" }
 *               data_nascimento: { type: string, format: date, example: "1990-08-22" }
 *               logradouro: { type: string, example: "Av. Paulista" }
 *               numero: { type: integer, example: 2000 }
 *               bairro: { type: string, example: "Bela Vista" }
 *               cep: { type: string, example: "01310-200" }
 *               cidade: { type: string, example: "São Paulo" }
 *               uf: { type: string, example: "SP" }
 *               telefone: { type: string, example: "(11) 98888-8888" }
 *               email: { type: string, example: "maria@email.com" }
 *     responses:
 *       200:
 *         description: Retorna o objeto tutor cadastrado com sucesso.
 *       500:
 *         description: Erro interno ao cadastrar tutor.
 */

router.post("/cadastrarTutor", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const {nome, cpf, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email} = req.body;

      const r = await conexao.query("INSERT INTO tutor (nome, cpf, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [nome, cpf, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /cadastrarPet:
 *   post:
 *     summary: Cadastra um novo pet.
 *     description: Adiciona um pet vinculado a um tutor existente.
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Rex" }
 *               data_nascimento: { type: string, format: date, example: "2020-01-10" }
 *               especie: { type: string, example: "Cachorro" }
 *               raca: { type: string, example: "Labrador" }
 *               id_tutor: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Retorna o objeto pet cadastrado com sucesso.
 *       500:
 *         description: Erro interno ou tutor inexistente.
 */

router.post("/cadastrarPet", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const {nome, data_nascimento, especie, raca, id_tutor} = req.body;

      const s = await db.query("SELECT COUNT(*) from tutor where id = $1", [id_tutor]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse tutor não existe... :('});
      }

      const r = await conexao.query("INSERT INTO pet (nome, data_nascimento, especie, raca, id_tutor) values($1, $2, $3, $4, $5) RETURNING *", [nome, data_nascimento, especie, raca, id_tutor]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /cadastrarConsulta:
 *   post:
 *     summary: Cadastra uma nova consulta veterinária.
 *     description: Registra uma nova consulta entre um veterinário e um pet.
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_vet: { type: integer, example: 1 }
 *               id_pet: { type: integer, example: 2 }
 *               data_hora: { type: string, format: date-time, example: "2025-11-10T14:30:00Z" }
 *               valor: { type: number, example: 150.00 }
 *     responses:
 *       200:
 *         description: Retorna o objeto consulta cadastrado com sucesso.
 *       500:
 *         description: Erros interno, veterinário inexistente, pet inexistente  ou conflito de horário.
 */

router.post("/cadastrarConsulta", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const {id_vet, id_pet, data_hora, valor} = req.body;

      const s = await db.query("SELECT COUNT(*) from pet where id = $1", [id_pet]);  
      const quantidade = Number(s.rows[0].count);

      const j = await db.query("SELECT COUNT(*) from veterinario where id = $1", [id_vet]);  
      const quant = Number(j.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse pet não existe... :('});
      }

      if(quant == 0){
        return res.status(500).json({msg: 'Esse veterinário não existe... :('});
      }

      const k = await db.query("SELECT COUNT(*) from consulta where id = $1 and data_hora = $2", [id_vet, data_hora]);  
      const cons = Number(s.rows[0].count);

      if(cons != 0){
        return res.status(500).json({msg: 'Já existe uma consulta marcada para esse dia/horário...:('});
      }

      const r = await conexao.query("INSERT INTO consulta (id_vet, id_pet, data_hora, valor) values($1, $2, $3, $4) RETURNING *", [id_vet, id_pet, data_hora, valor]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});

/**
 * @swagger
 * /exibirVeterinarios:
 *   get:
 *     summary: Lista todos os veterinários.
 *     description: Retorna todos os veterinários cadastrados no banco de dados.
 *     tags: [Veterinários]
 *     responses:
 *       200:
 *         description: Retorna uma lista de objetos veterinários inseridos com sucesso.
 *       500:
 *         description: Erro interno ao buscar veterinários.
 */

router.get("/exibirVeterinarios", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const r = await db.query("SELECT * from veterinario");

      res.json(r.rows);
        

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /exibirTutores:
 *   get:
 *     summary: Lista todos os tutores.
 *     description: Retorna todos os tutores cadastrados no banco de dados.
 *     tags: [Tutores]
 *     responses:
 *       200:
 *         description: Retorna uma lista de objetos tutores inseridos com sucesso.
 *       500:
 *         description: Erro interno ao buscar tutores.
 */

router.get("/exibirTutores", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const r = await db.query("SELECT * from tutor");

      res.json(r.rows);
        

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /exibirPets:
 *   get:
 *     summary: Lista todos os pets.
 *     description: Retorna todos os pets cadastrados no banco de dados.
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Retorna uma lista de objetos pets inseridos com sucesso.
 *       500:
 *         description: Erro interno ao buscar pets.
 */

router.get("/exibirPets", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const r = await db.query("SELECT * from pet");

      res.json(r.rows);
        

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /exibirConsultas:
 *   get:
 *     summary: Lista todas as consultas.
 *     description: Retorna todas as consultas registradas com detalhes do veterinário, tutor e pet no banco de dados.
 *     tags: [Consultas]
 *     responses:
 *       200:
 *         description: Retorna uma lista de objetos consultas inseridas com sucesso.
 *       500:
 *         description: Erro interno ao buscar consultas.
 */

router.get("/exibirConsultas", async (req, res) => {

  try {
    const result = await db.transaction(async (conexao) => {

      const r = await db.query("SELECT c.id, v.crmv, v.nome as nome_vet, t.cpf, t.nome as nome_tutor, p.nome as nome_pet, c.data_hora, c.valor from consulta as c join veterinario as v on c.id_vet = v.id join pet as p on c.id_pet = p.id join tutor as t on p.id_tutor = t.id");
      res.json(r.rows);
      
    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});

/**
 * @swagger
 * /deletarVeterinario/{id}:
 *   delete:
 *     summary: Exclui um veterinário.
 *     description: Remove um veterinário e suas consultas associadas.
 *     tags: [Veterinários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Retorna o objeto veterinário deletado com sucesso.
 *       500:
 *         description: Veterinário não encontrado ou erro interno.
 */

router.delete("/deletarVeterinario/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const s = await db.query("SELECT COUNT(*) from veterinario where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse veterinario não existe... :('});
      }

      const c = await db.query("SELECT COUNT(*) from consulta where id = $1", [id]);  
      const quant = Number(c.rows[0].count);

      if(quant != 0){
        await db.query("DELETE FROM consulta where id_vet = $1", [id]);
      }

      const r = await db.query("DELETE FROM veterinario where id = $1 RETURNING *", [id]);
      
      res.json(r.rows[0]);
    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /deletarTutor/{id}:
 *   delete:
 *     summary: Exclui um tutor.
 *     description: Remove o tutor, todos os pets e consultas associados a ele.
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Retorna o objeto tutor deletado com sucesso.
 *       500:
 *         description: Tutor não encontrado ou erro interno.
 */

router.delete("/deletarTutor/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const s = await db.query("SELECT COUNT(*) from tutor where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse tutor não existe... :('});
      }

      const c = await db.query("SELECT COUNT(*) from pet where id_tutor = $1", [id]);  
      const quant = Number(c.rows[0].count);

      if(quant != 0){
        const id_pet = await db.query("SELECT id from pet where id_tutor = $1", [id]); 

        for(let i = 0; i < id_pet.rows.length; i++){
          const id_pet_un = id_pet.rows[i].id;

          const v = await db.query("SELECT COUNT(*) from consulta where id_pet = $1", [id_pet_un]);  
          const qt = Number(c.rows[0].count);

          if(qt != 0){
            await db.query("DELETE FROM consulta where id_pet = $1", [id_pet_un]);
          }

        }

        await db.query("DELETE FROM pet where id_tutor = $1", [id]);

      }

      const r = await db.query("DELETE FROM tutor where id = $1 RETURNING *", [id]);
      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /deletarPet/{id}:
 *   delete:
 *     summary: Exclui um pet.
 *     description: Remove o pet e suas consultas associadas.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Retorna o objeto pet deletado com sucesso.
 *       500:
 *         description: Pet não encontrado ou erro interno.
 */

router.delete("/deletarPet/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const s = await db.query("SELECT COUNT(*) from pet where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse pet não existe... :('});
      }

      const c = await db.query("SELECT COUNT(*) from consulta where id_pet = $1", [id]);  
      const quant = Number(c.rows[0].count);

      if(quant != 0){
        await db.query("DELETE FROM consulta where id_pet = $1", [id]);
      }

      const r = await db.query("DELETE FROM pet where id = $1 RETURNING *", [id]);
      
      res.json(r.rows[0]);
    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});



/**
 * @swagger
 * /deletarConsulta/{id}:
 *   delete:
 *     summary: Exclui uma consulta.
 *     description: Remove uma consulta específica.
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Retorna o objeto consulta deletada com sucesso.
 *       500:
 *         description: Consulta não encontrada ou erro interno.
 */

router.delete("/deletarConsulta/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const s = await db.query("SELECT COUNT(*) from consulta where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Essa consulta não existe... :('});
      }

      const r = await db.query("DELETE FROM consulta where id = $1 RETURNING *", [id]);
      
      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /atualizarVeterinario/{id}:
 *   put:
 *     summary: Atualiza um veterinário.
 *     description: Atualiza os dados de um veterinário existente.
 *     tags: [Veterinários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Dr. João" }
 *               crmv: { type: string, example: "12345-SP" }
 *               data_nascimento: { type: string, format: date, example: "1985-04-12" }
 *               logradouro: { type: string, example: "Rua das Flores" }
 *               numero: { type: integer, example: 100 }
 *               bairro: { type: string, example: "Centro" }
 *               cep: { type: string, example: "12345-678" }
 *               cidade: { type: string, example: "São Paulo" }
 *               uf: { type: string, example: "SP" }
 *               telefone: { type: string, example: "(11) 99999-9999" }
 *               email: { type: string, example: "joao@clinica.com" }
 *     responses:
 *       200:
 *         description: Retorna o objeto veterinário atualizado com sucesso.
 *       500:
 *         description: Veterinário não encontrado ou erro interno.
 */


router.put("/atualizarVeterinario/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const {nome, crmv, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email} = req.body;

      const s = await db.query("SELECT COUNT(*) from veterinario where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse veterinario não existe... :('});
      }

      const r = await conexao.query("UPDATE VETERINARIO SET nome = $1, crmv = $2, data_nascimento = $3, logradouro = $4, numero = $5, bairro = $6, cep = $7, cidade = $8, uf = $9, telefone = $10, email = $11 WHERE id = $12 RETURNING *", [nome, crmv, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email, id]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /atualizarTutor/{id}:
 *   put:
 *     summary: Atualiza um tutor.
 *     description: Atualiza os dados de um tutor existente.
 *     tags: [Tutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Dr. João" }
 *               cpf: { type: string, example: "123.456.789-00" }
 *               data_nascimento: { type: string, format: date, example: "1985-04-12" }
 *               logradouro: { type: string, example: "Rua das Flores" }
 *               numero: { type: integer, example: 100 }
 *               bairro: { type: string, example: "Centro" }
 *               cep: { type: string, example: "12345-678" }
 *               cidade: { type: string, example: "São Paulo" }
 *               uf: { type: string, example: "SP" }
 *               telefone: { type: string, example: "(11) 99999-9999" }
 *               email: { type: string, example: "joao@clinica.com" }
 *     responses:
 *       200:
 *         description: Retorna o objeto tutor atualizado com sucesso.
 *       500:
 *         description: Tutor não encontrado ou erro interno.
 */

router.put("/atualizarTutor/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const {nome, cpf, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email} = req.body;

      const s = await db.query("SELECT COUNT(*) from tutor where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse tutor não existe... :('});
      }

      const r = await conexao.query("UPDATE TUTOR SET nome = $1, cpf = $2, data_nascimento = $3, logradouro = $4, numero = $5, bairro = $6, cep = $7, cidade = $8, uf = $9, telefone = $10, email = $11 WHERE id = $12 RETURNING *", [nome, cpf, data_nascimento, logradouro, numero, bairro, cep, cidade, uf, telefone, email, id]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});


/**
 * @swagger
 * /atualizarPet/{id}:
 *   put:
 *     summary: Atualiza um pet.
 *     description: Atualiza o pet de um tutor existente.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Rex" }
 *               data_nascimento: { type: string, format: date, example: "2020-01-10" }
 *               especie: { type: string, example: "Cachorro" }
 *               raca: { type: string, example: "Labrador" }
 *               id_tutor: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Retorna o objeto pet atualizado com sucesso.
 *       500:
 *         description: Pet não encontrado ou erro interno.
 */


router.put("/atualizarPet/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const {nome, data_nascimento, especie, raca} = req.body;

      const s = await db.query("SELECT COUNT(*) from pet where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Esse pet não existe... :('});
      }

      const r = await conexao.query("UPDATE PET SET nome = $1, data_nascimento = $2, especie = $3, raca = $4 WHERE id = $5 RETURNING *", [nome, data_nascimento, especie, raca, id]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});

/**
 * @swagger
 * /atualizarConsulta/{id}:
 *   put:
 *     summary: Atualiza uma consulta.
 *     description: Atualiza os dados de uma consulta existente.
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_vet: { type: integer, example: 1 }
 *               id_pet: { type: integer, example: 2 }
 *               data_hora: { type: string, format: date-time, example: "2025-11-10T14:30:00Z" }
 *               valor: { type: number, example: 150.00 }
 *     responses:
 *       200:
 *         description: Retorna o objeto consulta atualizado com sucesso.
 *       500:
 *         description: Consulta não encontrada ou erro interno.
 */


router.put("/atualizarConsulta/:id", async (req, res) => {

  let id = req.params.id;

  try {
    const result = await db.transaction(async (conexao) => {

      const {data_hora, valor} = req.body;

      const s = await db.query("SELECT COUNT(*) from consulta where id = $1", [id]);  
      const quantidade = Number(s.rows[0].count);

      if(quantidade == 0){
        return res.status(500).json({msg: 'Essa consulta não existe... :('});
      }

      const j = await db.query("SELECT COUNT(*) from consulta where id != $1 and data_hora = $2", [id, data_hora]);  
      const quant = Number(j.rows[0].count);

      if(quant != 0){
        return res.status(500).json({msg: 'Já existe uma consulta marcada para esse dia/horário...:('});
      }

      const r = await conexao.query("UPDATE CONSULTA SET data_hora = $1, valor = $2 WHERE id = $3 RETURNING *", [data_hora, valor, id]);

      res.json(r.rows[0]);

    });

    return res.status(500).json({ msg: "Erro de operação" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

});

module.exports = router;
