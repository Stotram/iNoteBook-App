const connectToMongo= require('./db')
const express= require ("express");
const cors= require('cors');
const port=5000

connectToMongo()

const app=express();

app.use(express.json());
app.use(cors())

app.get ('/', (req, res) => {
    res.send("Hello world!")
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, ()=>{
console.log(`iNotebook backend listening on http://localhost:${port}`)
})