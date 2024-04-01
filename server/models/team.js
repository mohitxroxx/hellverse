const mongoose=require('mongoose')
const teamSchema = new mongoose.Schema({
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Data'
    }],
    domains: [{
      type: String
    }]
  });
  
  const Team = mongoose.model('Team', teamSchema);

  module.exports = Team;