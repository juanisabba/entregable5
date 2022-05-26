const express = require("express")
const app = express()
const router = require("express").Router();
const handlebars = require("express-handlebars");

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "hbs"); 
app.set("views", "./views") 

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
})
);

let productos = [];

app.use(express.static("public"));
app.use('/api', router);

router.get('/products', (req, res) => {
  res.render("productos", { productos: productos }) 
})

router.get('/products/:id', (req, res) => {
    const filteredList = productos.filter(
    (product) => product.id === Number(req.params.id)
  );
  if (filteredList.length === 0) res.json("producto no encontrado");
  else res.render("productos", { productos: filteredList }) 
});



router.post('/products', (req, res) => {
    const lastItem = productos.length - 1;
  const newId = productos.length > 0 ? productos[lastItem].id + 1 : 1;
  productos.push({
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
    id: newId,
  });
  res.render("productos", { productos: productos }) 
})
router.put("/products/:id", (req, res) => {
  const filteredList = productos.filter(
    (product) => product.id === Number(req.params.id)
  );
  if (filteredList.length === 0) res.json("producto no encontrado");
  else {
    filteredList[0].title = req.body.title;
    filteredList[0].price = req.body.price;
    filteredList[0].thumbnail = req.body.thumbnail;
    res.json("updated");
  }
});


router.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const deletedItem = productos.filter((product) => product.id === Number(id));
  const filteredList = productos.filter((product) => product.id !== Number(id));
  if (deletedItem.length === 0) res.json("producto no encontrado");
  else {
    productos = filteredList
    res.json(filteredList);
  }
});

router.get("/", (req, res) => {
  res.render("main", { productos: productos }) 
});

app.use(express.static("public"));
app.use('/api', router);
