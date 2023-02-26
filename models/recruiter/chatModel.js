// models/chat.js
const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;

// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: "senderType",
//   },
//   senderType: {
//     type: String,
//     required: true,
//     enum: ["Recruiter", "Candidate"],
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: "receiverType",
//   },
//   receiverType: {
//     type: String,
//     required: true,
//     enum: ["Recruiter", "Candidate"],
//   },
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Job",
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Chat = mongoose.model("Chat", chatSchema);

// module.exports = Chat;

// const chatSchema = new mongoose.Schema({
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Job",
//     required: true,
//   },
//   candidate: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Candidate",
//     required: true,
//   },
//   recruiter: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Recruiter",
//     required: true,
//   },
//   messages: [
//     {
//       sender: {
//         type: String,
//         enum: ["candidate", "recruiter"],
//         required: true,
//       },
//       message: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

// module.exports = mongoose.model("Chat", chatSchema);

// const chatSchema = new mongoose.Schema(
//   {
//     job: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Job',
//       required: true,
//     },
//     candidate: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Candidate',
//       required: true,
//     },
//     recruiter: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Recruiter',
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Chat = mongoose.model('Chat', chatSchema);

// const mongoose = require('mongoose');

// const ChatSchema = new mongoose.Schema({
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true,
//   },
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   messages: [{
//     text: {
//       type: String,
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   }],
// });

// const Chat = mongoose.model('Chat', ChatSchema);

// module.exports = Chat;

// Chat.js
// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true
//   },
//   candidate: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Candidate',
//     required: true
//   },
//   recruiter: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Recruiter',
//     required: true
//   },
//   messages: [
//     {
//       sender: {
//         type: String,
//         enum: ['candidate', 'recruiter'],
//         required: true
//       },
//       content: {
//         type: String,
//         required: true
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now
//       }
//     }
//   ]
// });

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;

// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true
//   },
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   messages: [
//     {
//       message: String,
//       sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       receiver: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now
//       }
//     }
//   ]
// });

// module.exports = mongoose.model('Chat', chatSchema);

// const chatSchema = new Schema({
//   message: {
//     type: String,
//     required: true,
//   },
//   sender: {
//     type: Schema.Types.ObjectId,
//     refPath: 'senderType',
//     required: true,
//   },
//   receiver: {
//     type: Schema.Types.ObjectId,
//     refPath: 'receiverType',
//     required: true,
//   },
//   senderType: {
//     type: String,
//     required: true,
//     enum: ['Recruiter', 'Candidate'],
//   },
//   receiverType: {
//     type: String,
//     required: true,
//     enum: ['Recruiter', 'Candidate'],
//   },
//   job: {
//     type: Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;

// chat.js
// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: 'senderType',
//   },
//   senderType: {
//     type: String,
//     required: true,
//     enum: ['Recruiter', 'Candidate'],
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: 'receiverType',
//   },
//   receiverType: {
//     type: String,
//     required: true,
//     enum: ['Recruiter', 'Candidate'],
//   },
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;

// Define Chat schema and model
// const chatSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// const Chat = mongoose.model('Chat', chatSchema);
