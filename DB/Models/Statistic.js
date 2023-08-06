const mongoose=require('mongoose')
const statisticSchema=new mongoose.Schema({
    service:String,
    endpoint:String
})

module.exports=new mongoose.model("Statistic",statisticSchema)