const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    id : {
      type : Number,
    },
    title : {
      type : String,
      required : [true, "Title must be provide"],
    },

    description : {
      type : String,
      required : [true, "Description must be provide"],
    },

    image : {
      type : String,
    },

    price : {
      type : Number,
      required : [true, "Price must be provide"]
    },
    category : {
      type : String,
      required : [true, "Category must be provide"],
    },

    sold : {
      type : Boolean,
      required : [true, "Please mention if it is sold"],
    },

    dateOfSale : {
      type : Date,
      default : Date.now()
    }

});

module.exports = mongoose.model('Transaction', transactionSchema);
