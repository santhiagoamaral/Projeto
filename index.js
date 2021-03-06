const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const saltRound = 10;
app.use(bodyParser.json());
//  configuração do cors para aceitar varios protocolos de requisiçao
const configCors = {
  origin: "*",
  optionsSuccessStatus: 200,
};
// conexão com o banco de dados mysql
const cx = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "onlatter",
  port: "3306",
});
cx.connect((error, dados) => {
  if (error) {
    console.error(`Erro ao tentar executar o servidor -> ${error.stack}`);
    return;
  }
  console.log(`Dados do servidor -> ${cx.threadId}`);
});
// Rotas para o usuario
app.post("/usuario/cadastro", cors(configCors), (req, res) => {
  const sh = req.body.senha;
  const em = req.body.email;
  const us = req.body.nomeusuario;
  bcrypt.hash(sh, saltRound).then((senha) => {
    cx.query(
      "insert into tbusuario set nomeusuario=?,email=?,senha=?",
      [us, em, senha],
      (error, result) => {
        if (error) {
          res.status(400).send({ output: `não cadastrou -> ${error}` });
          return;
        }
        res.status(201).send({ output: result });
      }
    );
  });
});
app.get("/usuario/listar", cors(configCors), (req, res) => {
  cx.query("select   * from tbusuario", (error, result) => {
    if (error) {
      res
        .status(400)
        .send({ output: `Não foi possivel listar os usuarios ${error}` });
      return;
    }
    res.status(200).send({ output: result });
  });
});
app.put("/usuario/alterarsenha/:id", cors(configCors), (req, res) => {
  cx.query;
  "update tbusuario set ? whare idusuario=?",
    [req.body.params.id],
    (error, result) => {
      if (error) {
        res
          .status(400)
          .sand({ output: `Não foi possivel alterar a senha -> ${error}` });
        return;
      }
      res.status(200).send({ output: result });
    };
});
app.post("/usuario/login", cors(configCors), (req, res) => {
  const us = req.body.nomeusuario;
  const em = req.body.email;
  const sh = req.body.senha;

  cx.query(
    `select u.* from tbusuario u
  where (u.nomeusuario=? or u.email=?)`,
    [us, em],
    (e, rs) => {
      if (e) return res.status(400).send({ output: e });
      bcrypt.compare(sh, rs[0].senha).then((resultado) => {
        if (resultado) {
          res.status(200).send({ output: "Logado" });
        } else {
          res.status(404).send({ output: "Usuario não localizado" });
        }
      });
    }
  );
});
// ROTAS PARA O CARTÃO
app.post("/cartao/cadastrar"),cors(configCors),(req,res)=>{
  const nc = req.body.nomecartao;
  const nmc = req.body.numerocartao;
  const dv = req.body.datavalidade;
  const sc = req.body.securitycode;
  cx.query("insert into tbcartao set nomecartao=?,numerocartao=?,datavalidade=?,securitycode=?")
  [nc,nmc,dv,sc],
  (error,result) => {
    if(error){
      res.status(400).send({ output: `não cadastrou -> ${error}` });
          return;
        
        res.status(201).send({ output: result });
    };
  };
};
app.get("/cartao/listar"),cors(configCors),(req,res) =>{
  cx.query("select * from tbcartao"), (error,result) =>{
    if(error){
      res
      .status(400)
      .send({output:`não foi possivel listar os dados ${error}`});
      return;
    }
    res.status(200).send({output:result})
  }
}

app.listen(5005);
