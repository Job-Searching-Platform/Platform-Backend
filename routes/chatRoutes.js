// Controllers

const express = require("express");
const {
  createChat,
  findChat,
  userChats,
} = require("../controllers/ChatController.js");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
// const express = require("express");
// const jobController = require("../controllers/jobController");
// const chatController = require("../controllers/chatController");

// const router = express.Router();

// // Routes

// router.get("/:jobId/applicants", jobController.getJobApplicants);

// app.post("/chats", chatController.createChat);
// router.get("/:id", chatController.getChatById);
// app.get("/chats/:jobId", chatController.getChatsByJobId);

// module.exports = router;

// const express = require("express");
// const chatController = require("../controllers/chatController");
// const io = require("../server");

// router.get("/", chatController.getAllChats);
// router.get("/:id", chatController.getChatById);

// router.post("/", chatController.createChat);

// router.post("/:id/message", async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//       res.status(404).json({ message: "Chat not found" });
//     } else {
//       const message = {
//         sender: req.body.sender,
//         text: req.body.text,
//         timestamp: Date.now(),
//       };
//       chat.messages.push(message);
//       const updatedChat = await chat.save();
//       io.to(req.params.id).emit("new-message", message);
//       res.status(200).json(updatedChat);
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join', (room) => {
//     socket.join(room);
//     console.log(`User joined room ${room}`);
//   });

//   socket.on('new-message', (data) => {
//     io.to(data.room).emit('message', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// module.exports = server;

// ############################################################################################
// ####### Candidate Route  ########
// router.get('/chats', ChatController.getCandidateChats);
// router.get('/chats/:jobId', ChatController.getCandidateJobChat);
// router.get('/chats/:jobId/:recruiterId', ChatController.getCandidateRecruiterChat);

// ########   Recruiter Route ########
// router.get('/chats', ChatController.getRecruiterChats);
// router.get('/chats/:jobId', ChatController.getRecruiterJobChat);
// router.get('/chats/:jobId/:candidateId', ChatController.getRecruiterCandidateChat);
// Chat Model
// const mongoose = require('mongoose');

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

// module.exports = Chat;

// Chat Controllers

// const Chat = require('../models/chat');

// // Get all chats for a candidate
// exports.getCandidateChats = async (req, res) => {
//   const candidateId = req.user.id;

//   try {
//     const chats = await Chat.find({ candidate: candidateId })
//       .populate('job')
//       .populate('recruiter')
//       .sort('-createdAt')
//       .exec();

//     return res.json(chats);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// };

// // Get all chats for a recruiter
// exports.getRecruiterChats = async (req, res) => {
//   const recruiterId = req.user.id;

//   try {
//     const chats = await Chat.find({ recruiter: recruiterId })
//       .populate('job')
//       .populate('candidate')
//       .sort('-createdAt')
//       .exec();

//     return res.json(chats);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// };

// // Get all chat messages for a given job and candidate (for candidate)
// exports.getCandidateJobChat = async (req, res) => {
//   const candidateId = req.user.id;
//   const jobId = req.params.jobId;

//   try {
//     const chats = await Chat.find({ job: jobId, candidate: candidateId })
//       .populate('recruiter')
//       .sort('createdAt')
//       .exec();

//     return res.json(chats);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// };

// // Get all chat messages for a given job and candidate (for recruiter)
// exports.getRecruiterJobChat = async (req, res) => {
//   const recruiterId = req.user.id;
//   const jobId = req.params.jobId;

//   try {
//     const chats = await Chat.find({ job: jobId, recruiter: recruiterId })
//       .populate('candidate')
//       .sort('createdAt')
//       .exec();

//     return res.json(chats);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// };

// // Get all chat messages for a given job and candidate (for candidate and recruiter)
// exports.getCandidateRecruiterChat = async (req, res) => {
//   const candidateId = req.user.id;
//   const jobId = req.params.jobId;
//   const recruiterId = req.params.recruiterId;

//   try {
//     const chats = await Chat.find({ job: jobId, candidate: candidateId, recruiter: recruiterId })
//       .sort('createdAt')
//       .exec();

//     return res.json(chats);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// };

// exports.getRecruiterCandidateChat = async (req, res) => {
//   const candidateId = req.params.candidateId;
//   const jobId = req.params.jobId;
//   const recruiterId = req.user.id;

//   try {
//     const chats = await Chat.find({ job: jobId, candidate: candidateId, recruiter: recruiterId })
//       .sort('createdAt')
//       .exec();

//     return res.json(chats);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error.' });
//   }
// };

// // Create a new chat message
// exports.createChatMessage = async (req, res) => {
//   const { jobId, candidateId, recruiterId, message } = req.body;

//   try {
//     const chat = await Chat.findOneAndUpdate(
//       { job: jobId, candidate: candidateId, recruiter: recruiterId },
//       { $push: { messages: { sender: req.user.id, text: message } } },
//       { upsert: true, new: true }
//     )
//       .populate("job")
//       .populate("candidate")
//       .populate("recruiter")
//       .exec();

//     // Send new message to all users in the chat
//     io.to(
//       `job-${jobId}-candidate-${candidateId}-recruiter-${recruiterId}`
//     ).emit("new-message", chat);

//     return res.json(chat);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

// // Socket.io initialization
// const http = require('http');
// const socketIO = require('socket.io');

// const server = http.createServer(app);
// const io = socketIO(server);

// io.on('connection', (socket) => {
//   console.log(`New socket connection: ${socket.id}`);

//   // Join a room for the given job and candidate
//   socket.on('joinRoom', ({ jobId, candidateId }) => {
//     const room = `${jobId}-${candidateId}`;
//     socket.join(room);
//     console.log(`Socket ${socket.id} joined room ${room}`);
//   });

//   // Send a message to the given job and candidate
//   socket.on('sendMessage', ({ jobId, candidateId, message }) => {
//     const room = `${jobId}-${candidateId}`;
//     socket.to(room).emit('receiveMessage', { message });
//     console.log(`Socket ${socket.id} sent message in room ${room}: ${message}`);
//   });

//   // Disconnect the socket
//   socket.on('disconnect', () => {
//     console.log(`Socket ${socket.id} disconnected`);
//   });
// });
// ############################################################################################

// // chats.js
// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chats');

// // Get all chats of a job
// router.get('/job/:id', chatController.getJobChats);

// // Get all chats of a candidate
// router.get('/candidate/:id', chatController.getCandidateChats);

// // Get chat messages
// router.get('/:id/messages', chatController.getMessages);

// // Create a new chat message
// router.post('/:id/messages', chatController.createMessage);

// // module.exports = router;

// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join', (chatId) => {
//     socket.join(chatId);
//   });

//   socket.on('new-message', async (chatId, message) => {
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return;
//     }

//     const newMessage = {
//       sender: message.sender,
//       content: message.content,
//       createdAt: new Date(),
//     };

//     chat.messages.push(newMessage);
//     await chat.save();

//     io.to(chatId).emit('new-message', newMessage);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// // start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const Candidate = require('../models/Candidate');
// const Job = require('../models/Job');
// const Chat = require('../models/Chat');

// exports.getJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     res.json(jobs);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.getChats = async (req, res) => {
//   const candidateId = req.user.id;

//   try {
//     const chats = await Chat.find({ candidate: candidateId })
//       .populate('recruiter', 'name')
//       .populate('job', 'title');
//     res.json(chats);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.getChat = async (req, res) => {
//   const { chatId } = req.params;
//   const candidateId = req.user.id;

//   try {
//     const chat = await Chat.findOne({
//       _id: chatId,
//       candidate: candidateId,
//     }).populate('recruiter', 'name');
//     if (!chat) {
//       return res.status(404).json({ msg: 'Chat not found' });
//     }
//     res.json(chat);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.sendMessage = async (req, res) => {
//   const { chatId } = req.params;
//   const candidateId = req.user.id;
//   const { content } = req.body;

//   try {
//     let chat = await Chat.findOne({
//       _id: chatId,
//       candidate: candidateId,
//     });
//     if (!chat) {
//       return res.status(404).json({ msg: 'Chat not found' });
//     }

//     const newMessage = {
//       sender: candidateId,
//       content: content,
//       createdAt: new Date(),
//     };

//     chat.messages.push(newMessage);
//     await chat.save();

//     // emit new message to Socket.io
//     req.app.get('io').to(chatId).emit('new-message', newMessage);

//     res.json(chat);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// // Get all chats of a recruiter
// router.get('/:id/chats', recruiterController.getChats);

// const Recruiter = require('../models/Recruiter');
// const Job = require('../models/Job');
// const Candidate = require('../models/Candidate');
// const Chat = require('../models/Chat');

// exports.createJob = async (req, res) => {
//   const recruiterId = req.user.id;
//   const { title, description } = req.body;

//   try {
//     const newJob = new Job({
//       recruiter: recruiterId,
//       title,
//       description,
//     });

//     await newJob.save();
//     res.json(newJob);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.getJobs = async (req, res) => {
//   const recruiterId = req.user.id;

//   try {
//     const jobs = await Job.find({ recruiter: recruiterId });
//     res.json(jobs);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.getChat = async (req, res) => {
//   const { chatId } = req.params;
//   const recruiterId = req.user.id;

//   try {
//     const chat = await Chat.findOne({
//       _id: chatId,
//       recruiter: recruiterId,
//     })
//       .populate('candidate', 'name')
//       .populate('job', 'title');
//     if (!chat) {
//       return res.status(404).json({ msg: 'Chat not found' });
//     }
//     res.json(chat);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.getChats = async (req, res) => {
//   const recruiterId = req.user.id;

//   try {
//     const chats = await Chat.find({ recruiter: recruiterId })
//       .populate('candidate', 'name')
//       .populate('job', 'title');
//     res.json(chats);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.sendMessage = async (req, res) => {
//   const { chatId } = req.params;
//   const recruiterId = req.user.id;
//   const { content } = req.body;

//   try {
//     let chat = await Chat.findOne({
//       _id: chatId,
//       recruiter: recruiterId,
//     });
//     if (!chat) {
//       return res.status(404).json({ msg: 'Chat not found' });
//     }

//     const newMessage = {
//       sender: recruiterId,
//       content: content,
//       createdAt: new Date(),
//     };

//     chat.messages.push(newMessage);
//     await chat.save();

//     // emit new message to Socket.io
//     req.app.get('io').to(chatId).emit('new-message', newMessage);

//     res.json(chat);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// // chats.js
// const Chat = require('../models/Chat');

// exports.getJobChats = async (req, res) => {
//   // Implementation for getting all chats of a job
// };

// exports.getCandidateChats = async (req, res) => {
//   // Implementation for getting all chats of a candidate
// };

// exports.getMessages = async (req, res) => {
//   // Implementation for getting chat messages
// };

// exports.createMessage = async (req, res) => {
//   // Implementation for creating a new chat message
// };

// #########################################################################################

// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   job: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true,
//   },
//   candidate: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Candidate',
//     required: true,
//   },
//   recruiter: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Recruiter',
//     required: true,
//   },
//   messages: [{
//     sender: {
//       type: String,
//       enum: ['candidate', 'recruiter'],
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
// });

// module.exports = mongoose.model('Chat', chatSchema);

// const express = require('express');
// const router = express.Router();

// const candidateController = require('./controllers/candidateController');
// const jobController = require('./controllers/jobController');
// const recruiterController = require('./controllers/recruiterController');
// const chatController = require('./controllers/chatController');

// // Candidate routes
// router.get('/candidates', candidateController.getAllCandidates);
// router.get('/candidates/:id', candidateController.getCandidateById);
// router.post('/candidates', candidateController.createCandidate);
// router.put('/candidates/:id', candidateController.updateCandidate);
// router.delete('/candidates/:id', candidateController.deleteCandidate);

// // Job routes
// router.get('/jobs', jobController.getAllJobs);
// router.get('/jobs/:id', jobController.getJobById);
// router.post('/jobs', jobController.createJob);
// router.put('/jobs/:id', jobController.updateJob);
// router.delete('/jobs/:id', jobController.deleteJob);

// // Recruiter routes
// router.get('/recruiters', recruiterController.getAllRecruiters);
// router.get('/recruiters/:id', recruiterController.getRecruiterById);
// router.post('/recruiters', recruiterController.createRecruiter);
// router.put('/recruiters/:id', recruiterController.updateRecruiter);
// router.delete('/recruiters/:id', recruiterController.deleteRecruiter);

// // Chat routes
// router.get('/chats/:jobId', chatController.getJobChats);
// router.get('/chats/:jobId/:candidateId', chatController.getCandidateChat);
// router.post('/chats/:jobId/:candidateId', chatController.createChatMessage);

// module.exports = router;

// const Chat = require('../models/Chat');

// exports.getAllChats = async (req, res) => {
//   try {
//     const chats = await Chat.find();
//     res.status(200).json(chats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getChatsByJob = async (req, res) => {
//   try {
//     const chats = await Chat.find({ job: req.params.id });
//     res.status(200).json(chats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getChatById = async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//       res.status(404).json({ message: 'Chat not found' });
//     } else {
//       res.status(200).json(chat);
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createChat = async (req, res) => {
//   try {
//     const chat = new Chat({
//       job: req.body.job,
//       candidate: req.body.candidate,
//       recruiter: req.body.recruiter,
//       messages: [],
//     });
//     const newChat = await chat.save();
//     res.status(201).json(newChat);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.addMessage = async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//       res.status(404).json({ message: 'Chat not found' });
//     } else {
//       const message = {
//         sender: req.body.sender,
//         text: req.body.text,
//         timestamp: Date.now(),
//       };
//       chat.messages.push(message);
//       const updatedChat = await chat.save();
//       res.status(200).json(updatedChat);
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join', (room) => {
//     socket.join(room);
//     console.log(`User joined room ${room}`);
//   });

//   socket.on('new-message', (data) => {
//     io.to(data.room).emit('message', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// module.exports = server;
