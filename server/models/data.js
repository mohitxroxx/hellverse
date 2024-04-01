const mongoose=require('mongoose')

// {
//   "id":7,
//   "first_name":"Kalindi",
//   "last_name":"Vinson",
//   "email":"kvinson6@g.co",
//   "gender":"Female",
//   "avatar":"https://robohash.org/occaecatinihilquos.png?size=50x50&set=set1",
//   "domain":"Management",
//   "available":true
// }

const dataSchema=new mongoose.Schema({
  id:{
    type:Number
  },
  first_name:{
    type:String
  },
  last_name:{
    type:String
  },
  email:{
    type:String
  },
  gender:{
    type:String
  },
  avatar:{
    type:String
  },
  domain:{
    type:String
  },
  available:{
    type:Boolean
  },
})


const Data = mongoose.model('Data', dataSchema);

module.exports = Data;