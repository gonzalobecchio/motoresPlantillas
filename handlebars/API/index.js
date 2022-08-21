const express = require('express')
const port = 8080
const app = express()
const { productos } = require('../Routes/productos')
const { engine } = require('express-handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('Public'))
app.use(express.static('Uploads'))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use('/api', productos)

/*Ruta Index API NoREST*/ 
app.get('/', (req, res) => {
    res.render('index',{
        messageSuccess: null,
        errores: null,
        prodVal: null
    })
})

app.listen(port, () =>{
    console.log(`Corriendo servidor en puerto: ${port}`)
})

app.use('*', (req, res, next) => {
    res.status(404).json({message: "El rescurso buscado no existe"});
});

app.use((err, req, res, next) =>{
    // console.log(err.statusCode)
    res.status(err.statusCode ? err.statusCode : 500 ).json({
        message: err.message,
        status: err.statusCode
    })
});