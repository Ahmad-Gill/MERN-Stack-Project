const mongoose = require('mongoose');

const userdetailSchema = new mongoose.Schema({
  Full_Name: { type: String, required: true },
  email: { type: String, required: true , ref: 'User' },
  phone: {type:String, required:true},
  address: {type:String},
  gender: {type:String},
  birth_day: {type:String , match : /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/},
  country: {type:String , required:true},
  language: {type:String},
  payment_method: {type:String, required:true},
  card_no: {type:String , require:true , match:[/^\d{13,19}$/, 'Invalid card number format! Card number should be between 13 and 19 digits.']},
  expiry_date: {type:String , require:true , match: [/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/]},
  cvv: {type:String,required:true , match : /^\d{3,4}$/}
}, { timestamps: true });

module.exports = mongoose.model('UserDetails', userdetailSchema);
