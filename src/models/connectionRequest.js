const mongoose = require("mongoose");
const User = require("./user")

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: `{VALUE} is incorrect status value type `,
      },
    },
  },
  {
    timestamps: true,
    }
  
);

connectionRequestSchema.index({toUserId:1,fromUserId:1}) // This is called compound index

connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this; 
    // console.log(this)
    const user = await User.findById(connectionRequest.fromUserId);
    
    // Check if fromUser is same as toUser
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error(user.firstName + ", you cannot sent connection request to your self" )
    }
    next(); 
  })

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequestModel;

// module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
