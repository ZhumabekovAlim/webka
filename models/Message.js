import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      timestamp: { type: Date, default: Date.now },
      content: String,
  },
  { collection: 'chats' } 
  );
  
  export default mongoose.model('Message', messageSchema);
