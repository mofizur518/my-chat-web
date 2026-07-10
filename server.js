const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// ১. এক্সপ্রেস অ্যাপ এবং সার্ভার তৈরি
const app = express();
app.use(cors()); // সব জায়গা থেকে কানেকশন অ্যালাউ করার জন্য

// একটি সিম্পল হোম রুট (টেস্ট করার জন্য)
app.get('/', (req, res) => {
    res.send('আমাদের চ্যাট সার্ভার চমৎকারভাবে চলছে! 🔥');
});

const server = http.createServer(app);

// ২. Socket.io সেটআপ (CORS পলিসি সহ)
const io = new Server(server, {
    cors: {
        origin: "*", // যেকোনো ফ্রন্টএন্ড লিংক থেকে মেসেজ রিসিভ করবে
        methods: ["GET", "POST"]
    }
});

// ৩. চ্যাটের আসল লজিক (Socket.io Connections)
io.on('connection', (socket) => {
    console.log('নতুন একজন বন্ধু চ্যাটে যুক্ত হয়েছে! আইডি:', socket.id);

    // যখন কোনো ইউজার মেসেজ পাঠাবে
    socket.on('send_message', (data) => {
        console.log('নতুন মেসেজ এসেছে:', data);
        
        // এই মেসেজটি বাকি সবার কাছে পাঠিয়ে দাও
        socket.broadcast.emit('receive_message', data);
    });

    // যখন কেউ চ্যাট থেকে বের হয়ে যাবে
    socket.on('disconnect', () => {
        console.log('একজন বন্ধু চ্যাট থেকে বিদায় নিয়েছে। 😢', socket.id);
    });
});

// ৪. পোর্ট সেটআপ (হোস্টিংয়ের জন্য Process.env রাখা হয়েছে)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`সার্ভার চালু হয়েছে! পোর্ট নম্বর: ${PORT}`);
});