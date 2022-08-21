const express = require('express')
const port = 8080
const app = express()
const { productos } = require('../Routes/productos')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('Public'))
app.use(express.static('Uploads'))


app.get('/', (req, res) => {
    res.render('index',{
        errores: null, 
        prodVal:null, 
        messageSuccess:null
    })
})

app.set('view engine', 'ejs')

app.use('/api', productos)


app.listen(port, () =>{
    console.log(`Corriendo servidor en puerto: ${port}`)
})

app.use('*', (req, res, next) => {
    res.status(404).json({message: "El recurso buscado no existe"});
});

app.use((err, req, res, next) =>{
    // console.log(err.statusCode)
    res.status(err.statusCode ? err.statusCode : 500 ).json({
        message: err.message,
        status: err.statusCode
    })
});