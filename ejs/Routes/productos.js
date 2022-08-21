const express = require('express')
const multer = require('multer')
const { Router }  = express

const productos = Router()
const dirFiles = 'Uploads'
let errores = []

const persistenciaProductos = []
let productoAdd = {}

/**
 * Function/Middleware encargada de verificar la 
 * existencia de datos el array 
 */ 
const verifyContent = (req, res, next) => {
    if (persistenciaProductos.length == 0) {
        // res.status(200).json({message: 'Sin datos'})
        res.render('listadoProductos', {
            message : 'Sin datos'
        })
        return
    }
    next()
}

/**
 * Function/Middleware encargado de verificar 
 * si se enviaron todos los datos y tipos correctos
*/

const verifyData = (req, res, next) => {
    const { title, price } = req.body
    errores = []
    const file  = req.file
    if (!title) {
        errores.push({err: "Completar Campo Nombre"})   
    }
    /*Verificacion de tipo */
    if (!isNaN(title)){
        errores.push({err: "Campo Nombre debe ser string"})  
    }
    
    if (!price) {
        errores.push({err: "Completar campo Precio"})  
    }
    /*Verificacion de tipo */
    if (isNaN(price)) {
        errores.push({err: "Campo Precio debe ser numerico"})  
    }
    
    if (!file) {
        errores.push({err: "Archivo no cargado"})          
    }

    if (errores.length == 0) {
        /**
         * Sino Existen Errores se agregar producto
        */
        productoAdd = {...req.body}
        productoAdd.thumbnail = file.filename
        next()    
    }
    const prodVal = {...req.body}
    res.render('index',{
        errores, 
        prodVal,
        messageSuccess: null
    })
    
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dirFiles)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

productos.post('/productos', upload.single('my-file'), verifyData, (req, res) => {
    if (!persistenciaProductos.length) {
        productoAdd.id = 1
    }else{
        const id =  persistenciaProductos[persistenciaProductos.length - 1].id + 1
        productoAdd.id = id
    }
    persistenciaProductos.push(productoAdd)
    res.render('index',{
        errores: null, 
        prodVal:null,
        messageSuccess : 'Producto agregado con éxito'
    })
})

productos.get('/productos', verifyContent, (req, res) => {
    // res.status(200).send(persistenciaProductos)
    console.log(persistenciaProductos)
    res.render('listadoProductos', {
        productos : persistenciaProductos,
        message: null

    })
})

productos.get('/productos/:id', verifyContent, (req, res) => {
    const { id } = req.params
    const product = persistenciaProductos.find((element) => element.id == id)
    if (!product) {
        res.status(404).json({error: 'Producto no encontrado'})
        return
    }
    // res.status(200).send(product)
})

productos.put('/productos/:id',  upload.single('my-file'), verifyContent, verifyData, (req, res) => {
    const { id } = req.params
    let product = persistenciaProductos.find((element) => element.id == id)
    if (!product) {
        res.status(404).json({error: 'Producto no encontrado'})
        return
    }    

    const indexByProduct = persistenciaProductos.findIndex(element => element.id == id) 
    if (indexByProduct == -1) {
        res.status(404).json({error: 'Producto no encontrado'})
        return
    }

    const putProduct = {...product, ...productoAdd }
    persistenciaProductos[indexByProduct] = putProduct
    res.sendStatus(200)

})

productos.delete('/productos/:id',  verifyContent, (req, res) => {
    const { id } = req.params
    const indexByProduct = persistenciaProductos.findIndex((element) => element.id == id)
    if (indexByProduct == -1) {
        res.status(404).json({error: "Producto no encontrado"})
        return
    }

    persistenciaProductos.splice(indexByProduct, 1)
    res.sendStatus(204)
})

// productos.get('/', (req, res) => {
//     res.render('index',{
//         errores: null, 
//         prodVal:null, 
//         messageSuccess:null
//     })
// })


module.exports = { productos }