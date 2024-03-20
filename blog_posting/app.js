const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const { Sequelize } = require('sequelize');
const Item = require('./models/content');
const methodOverride = require('method-override');

const app = express()
const port = 3000

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sequelize = new Sequelize('blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tables synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error synchronizing tables:', err);
  });


app.get('/', (req, res) => {
  res.render('home')
})


app.get('/content',async(req,res)=>{
  const products= await Item.findAll();
  res.render('main',{products})
})


app.get('/add', (req, res) => {
    res.render('newcontent');
});

app.post('/content', async (req, res) => {
    try {
        const { name, content } = req.body;
        const data = await Item.create({
            name,
            content
        });
        res.redirect('/content');
    } catch (error) {
        console.log(error);
    }
});

app.get('/content/:id',async(req,res)=>{
  const itemId= req.params.id;
  const data= await Item.findByPk(itemId);
  res.render('info',{data});
});

app.get('/content/:id/edit',async(req,res)=>{
  const itemId=req.params.id;
  const data=await Item.findByPk(itemId);
  res.render('edit',{ data });
});

app.put('/content/:id',async(req,res)=>{
  const itemId=req.params.id;
  const{ name, content} = req.body;
  const [numRowsUpdated] = await Item.update(
    {name, content},{
      where:{
        id:itemId
      }
    });
    if (numRowsUpdated === 0) {
      return res.status(404).send('Content not found');
    }
    res.redirect('/content')
});

app.delete('/content/:id',async(req,res)=>{
  const itemId=req.params.id;
  await Item.destroy({
    where:{
      id:itemId
    }
  })
  res.redirect('/content');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})