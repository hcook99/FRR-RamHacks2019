const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const app = express();
const { User, Room, Equipment, RoomReserve, sequelize} = require('./sequelize')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({hello: "world"})
})

app.post('/room', (req, res) => {
    let equipment;
    if(req.body.equipment){
        equipment = req.body.equipment.map(equipmentReq => Equipment.findOrCreate({ where: { name: equipmentReq }})
                .spread((equipmentReq, created) => equipmentReq))
    }
    roomCreate = Room.create({
        floor: req.body.floor,
        room: req.body.room,
        size: req.body.size
    });
    if(equipment){
        roomCreate.then(room => Promise.all(equipment).then(storedEquipment => room.setEquipment(storedEquipment)).then(()=>room))
    }
    roomCreate.then(room => res.send(room))
    .catch(err => res.status(400).send(err));
})

app.get('/room/:roomID', (req, res) => {
    const roomId = req.params.roomID;
    Room.findAll({
        include: [{
            model:Equipment
        }],
        where: {id: roomId}
    })
    .then(room => {
        room=room[0];
        let roomCleaned = {
            id: room.id,
            floor: room.floor,
            room: room.room,
            size: room.size,
            equipment: []
        }
        for(let equipmentInRoom of room.equipment){
            roomCleaned.equipment.push({id: equipmentInRoom.id, name: equipmentInRoom.name});
        }
        res.send(roomCleaned)
    })
    .catch(err => res.status(400).send(err));
})

app.patch('/room/:roomID', (req, res) => {
    let equipment;
    if(req.body.equipment){
        equipment = req.body.equipment.map(equipmentReq => Equipment.findOrCreate({ where: { name: equipmentReq }})
                .spread((equipmentReq, created) => equipmentReq))
    }
    Room.findByPk(req.params.roomID)
    .then(room => {
        if(room){
            roomUpdate = room.update({
                floor: req.body.floor,
                room: req.body.room,
                size: req.body.size,
            })
            if(equipment){
                roomUpdate.then(room => Promise.all(equipment).then(storedEquipment => room.setEquipment(storedEquipment)).then(()=>room))
            }
            roomUpdate.then(room => res.send(room));
            roomUpdate.catch(err => res.status(400).send(err));
        }
    })
    .catch(err => res.status(400).send(err));
})

app.post('/user', (req, res) => {
    User.findOrCreate({
        where: {email: req.body.email}
    })
    .then(user => res.send(user[0]))
    .catch(err => res.send(err));
})

app.post('/reserve', (req,res) => {
    Room.findByPk(req.body.roomId)
    .then(room => {
        User.findByPk(req.body.userId)
        .then(user => {
            if(room && user){
                let dateGiven = moment(req.body.dateMeet, 'YYYY-MM-DD')
                let reserveRoom = RoomReserve.create({
                    name_event: req.body.nameEvent,
                    date_meet: dateGiven,
                    start_time: req.body.startTime,
                    end_time: req.body.endTime,
                    user_id: req.body.userId,
                    room_id: req.body.roomId
                })
                reserveRoom.then(reservation => res.send(reservation))
                .catch(err => res.status(400).send(err));
            }
            else{
                res.status(400).send({error: "Must be existing user and room"})
            }
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(400).send(err));
})

app.get('/reserve/:id', (req, res) => {
    RoomReserve.findAll({
        where: {id: req.params.id}
    })
    .then(reservation => {
        reservation = reservation[0]
        User.findByPk(reservation.user_id)
        .then(user => {
            Room.findByPk(reservation.room_id)
            .then(room => {
                reservationComplete={
                    nameEvent: reservation.name_event,
                    dateMeet: reservation.date_meet,
                    startTime: reservation.start_time,
                    endTime: reservation.end_time,
                    user: user,
                    room: room
                }
                res.send(reservationComplete);
            })
            .catch(err=>res.status(400).send(err));
        })
        .catch(err=>res.status(400).send(err));
    })
    .catch(err => res.status(400).send(err));
})

app.get('/myRooms/:userId', (req, res) => {
    RoomReserve.findAll({
        where: {user_id: req.params.userId}
    })
    .then(reservations => res.send(reservations))
    .catch(err => res.status(400).send(err))
})

app.delete('/reserve/:reserveID', (req, res)=>{
    RoomReserve.destroy({
        where: {id: req.params.reserveID}
    })
    .then(numDeleted=> {
        if(numDeleted==1){
            res.sendStatus(200);
        }
        else{
            res.sendStatus(400);
        }
    })
    .catch(err => res.send(err));
})

app.get('/openRooms/:date', (req, res) => {
    Room.findAll({
        include: [{
            model:Equipment
        }]
    })
    .then(rooms => {
        RoomReserve.findAll()
        .then(reservations => {
            let datePassed = moment(req.params.date, 'YYYY-MM-DD')
            datePassed = datePassed.format('MM/DD/YYYY')
            var roomsOpenTimes = {}
            var roomComplete = []
            for(room of rooms){
                roomSave = 'room'+room.id
                roomsOpenTimes[roomSave] = ['8:00:00', '9:00:00', '9:00:00', '10:00:00', '10:00:00', '11:00:00',
                '11:00:00', '12:00:00', '12:00:00', '13:00:00', '13:00:00', '14:00:00', '14:00:00', '15:00:00', '15:00:00', '16:00:00',
                '16:00:00', '17:00:00', '17:00:00', '18:00:00'];
                roomComplete.push({
                    id: room.id,
                    floor: room.floor,
                    room: room.room,
                    size: room.size,
                    equipment: room.equipment,
                    openTime: roomsOpenTimes[roomSave]
                })
            }
            for(reservation of reservations){
                let reservationDate = moment(reservation.date_meet, 'YYYY-MM-DD')
                reservationDate = reservationDate.format('MM/DD/YYYY')
                if(datePassed===reservationDate){
                    room = 'room'+reservation.room_id
                    timesOpen = roomsOpenTimes[room]
                    startTime = timesOpen.lastIndexOf(reservation.start_time)
                    endTime = timesOpen.indexOf(reservation.end_time)
                    roomsOpenTimes[room].splice(startTime, endTime-startTime+1)
                }
            }
            for(room of roomComplete){
                roomSave = 'room'+room.id
                room.openTime = roomsOpenTimes[roomSave]
            }
            res.send(roomComplete)
        })
        .catch(err => res.status(400).send(err))
    })
    .catch(err => res.status(400).send(err))
})

app.listen(PORT, () => {
    console.log('app started')
})