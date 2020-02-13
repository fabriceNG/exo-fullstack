const express = require('express');
const Product = require('./models/product');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://FAB_MONGODB:Georgette99@cluster0-4znwz.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
  app.use(bodyParser.json());

  app.get('/api/products', (req, res, next) => {
    Product.find()//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer 
    //un tableau contenant tous les Things
      .then(products => res.status(200).json(products))
      .catch(error => res.status(400).json({ error }));
  });
 // affiche un objet 
  app.get('/api/product/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id })
      .then(product => res.status(200).json(product))
      .catch(error => res.status(404).json({ error }));
  });

  //Ici, vous créez une instance de votre modèle Thing en lui passant un objet JavaScript contenant toutes 
  //les informations requises du corps de requête analysé (en ayant supprimé en amont le faux_id envoyé par le front-end).
  app.post('/api/products', (req, res, next) => {
    //delete req.body._id;
    const product = new Product({
      ...req.body
    });
    product.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });
//permet de mettre a jour un objet precis
app.put('/api/product/:id', (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});
  //permet de supprimer un objet
  app.delete('/api/product/:id', (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });
  

 
  


  
  
  
  
  
module.exports = app;