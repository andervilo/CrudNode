const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dbuser:suelaine0512.@cluster0-j3kxl.mongodb.net/crud-example";
// mongodb+srv://dbuser:<password>@cluster0-j3kxl.mongodb.net/test?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('crud-example') // coloque o nome do seu DB

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
})

//Tipo de template engine
app.set('view engine', 'ejs')

app.route('/') //setado a rota, e abaixo as ações a serem tomadas dentro desta rota
.get(function(req, res) {
  const cursor = db.collection('contato').find()
  res.render('index.ejs')
})

.post((req, res) => {
  db.collection('contato').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Salvo no Banco de Dados')
    res.redirect('/show')
  })
})

app.route('/show')
.get((req, res) => {
  db.collection('contato').find().toArray((err, results) => {
    if (err) return console.log(err)
    res.render('show.ejs', { data: results })
  })
})

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('contato').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname

  db.collection('contato').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('contato').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})