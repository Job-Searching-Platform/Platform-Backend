const ChatModel = require("./../models/chat/chatModel");

exports.createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

// const Chat = require("./../models/chat/chatModel");
// const io = require("./../app");

// // get all the chat between recruiter and candidate
// exports.getAllChats = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page);
//     const limit = parseInt(req.query.limit);

//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const chats = await Chat.find({ jobId: req.params.jobId })
//       .populate("sender")
//       .populate("receiver")
//       .sort({ createdAt: "asc" })
//       .skip(startIndex)
//       .limit(limit);

//     res.json(chats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// };

// // CREATE CHAT
// exports.postChat = async (req, res) => {
//   try {
//     const chat = await Chat.create({
//       jobId: req.data.jobId,
//       sender: req.data.senderId,
//       receiver: req.data.receiverId,
//       message: req.data.message,
//     });

//     const populatedChat = await chat
//       .populate("sender")
//       .populate("receiver")
//       .execPopulate();

//     const job = await Job.findById(data.jobId);

//     if (job) {
//       // Emit the message to the recruiter
//       const recruiterSocketId = job.recruiterSocketId;
//       io.to(recruiterSocketId).emit("chat", populatedChat);

//       // Emit the message to each of the candidate sockets
//       for (const candidateSocketId of job.candidateSocketIds) {
//         io.to(candidateSocketId).emit("chat", populatedChat);
//       }
//     }

//     res.json(chat);
//   } catch (err) {
//     console.log(err);
//   }

// try {
//   const chat = new Chat({
//     job: req.params.id,
//     candidate: req.body.candidate,
//     recruiter: req.body.recruiter,
//     messages: [],
//   });
//   const newChat = await chat.save();
//   io.emit('new-chat', newChat);
//   res.status(201).json(newChat);
// } catch (err) {
//   res.status(400).json({ error: err.message });
// }
// };

// // app.js

// const express = require('express');
// const http = require('http');
// const socketio = require('socket.io');
// const mongoose = require('mongoose');

// const jobsRouter = require('./routes/jobs');
// const candidatesRouter = require('./routes/candidates');
// const chatsRouter = require('./routes/chats');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// // Set up WebSocket server
// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Handle incoming messages
//   socket.on('message', async (data) => {
//     const chat = {
//       sender: data.sender,
//       receiver: data.receiver,
//       job: data.job,
//       message: data.message,
//     };

//     await Chat.create(chat);

//     socket.broadcast.emit('message', chat);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/job-search', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// // Set up Express middleware and routes
// app.use(express.json());
// app.use('/jobs', jobsRouter);
// app.use('/candidates', candidatesRouter);
// app.use('/chats', chatsRouter);

// server.listen(3001, () => {
//   console.log('Server listening on port 3001');
// });

// // models/job.js

// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const JobSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   recruiter: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true },
// });

// module.exports = mongoose.model('Job', JobSchema);

// // models/candidate.js

// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const CandidateSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   skills: [{ type: String }],
//   job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
// });

// module.exports = mongoose.model('Candidate', CandidateSchema);

// // models/recruiter.js

// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const RecruiterSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
// });

// module.exports = mongoose.model('Recruiter', RecruiterSchema);

// // models/chat.js

// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const ChatSchema = new Schema({
//   sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
//   message: { type: String, required: true },
// });

// module.exports = mongoose.model('Chat', ChatSchema);

// routes/chats.js

// const express = require("express");
// const router = express.Router();

// // const Chat = require("../models/chat");

// router.get("/", async (req, res) => {
//   try {
//     const chats = await Chat.find()
//       .populate("sender")
//       .populate("receiver")
//       .populate("job");
//     res.json(chats);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id)
//       .populate("sender")
//       .populate("receiver")
//       .populate("job");
//     if (!chat) {
//       res.status(404).json({ error: "Chat not found" });
//     } else {
//       res.json(chat);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
