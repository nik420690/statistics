const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://nikkljucevsek:OldbtLLbshDbB69v@cluster0.9uuzozi.mongodb.net/statistikaDB').then(()=>{
    console.log("connected to db successfully.")
}).catch((e)=>{
    console.log("something went wrong while connecting with db.")
})