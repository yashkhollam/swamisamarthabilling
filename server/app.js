const MongoDB = require('./Database/db.js');

const dotenv=require('dotenv');
const express=require('express');
const route  = require('./routes/billdata.js');
const app=(express())
const cors=require('cors')

dotenv.config();

MongoDB()

const PORT=process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get('/',(req,res)=>{

    res.status(200).json({
        success:true,
        message:"Welcome to Samartha Printing Billing System",
    })
})

app.use('/bill',route);

app.listen(PORT,()=>console.log(`$Server started at PORT :${PORT}`))


