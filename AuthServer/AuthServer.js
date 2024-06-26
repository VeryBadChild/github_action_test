const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const logger = require('./logger');

const {   
    Login, 
    Signup,
    SetName,
    MatchMaking,
    ReadyGame,
    Disconnect, 
    SetInGameServer
} = require('./EventHandler');

io.on('connection', (socket) => {
    logger.info(`새로운 클라이언트 접속 : ${socket.handshake.address}`);
    socket.on('login', (msg) => { // 일반 login
        logger.info(`login : ${JSON.stringify(msg)}`);
        Login(socket, msg);
    });
    
    socket.on('loginSucc', (msg) => { // email 정보
        logger.info(`login : ${JSON.stringify(msg)}`);
        Login(socket, msg);
    });
    
    socket.on('signup', (msg) => {
        logger.info(`signup : ${JSON.stringify(msg)}`);
        Signup(socket, msg);
    });

    socket.on('inquiryFriend', (msg) => {
        logger.info(`inquiryFriend : ${JSON.stringify(msg)}`);
        SetName(socket, msg);
    });

    socket.on('setName', (msg) => {
        logger.info(`setName : ${JSON.stringify(msg)}`);
        SetName(socket, msg);
    });
    
    socket.on('matching', (msg) => { // client의 matching 요청
        logger.info(`matching : ${JSON.stringify(msg)}`);
        MatchMaking(socket, msg);
    });

    socket.on('readyGame', (msg) => {
        logger.info(`beforeStart : ${JSON.stringify(msg)}`);
        ReadyGame(msg);
    });

    socket.on('disconnect', () => {
        logger.info(`클라이언트 접속 종료 : ${socket.id}`);
        // TODO 접속한 플레이어 리스트에서 삭제하기
        Disconnect(socket);
    });

    socket.on('close', (reason) => {
        logger.info(`클라이언트 연결 종료 : ${socket.id}, 이유 : ${reason}`);
        Disconnect(socket);
    });

    // ------ InGameServer --------
    socket.on('message', (data) => {
        logger.info(`ingame message : ${data}`);
        SetInGameServer(socket);
    })

});

server.listen(10101, () => {    
    logger.info('서버가 10101번 포트에서 실행 중입니다. ');
}).on('error', (err) => {
    logger.error(`Server error : ${err}`);
});

