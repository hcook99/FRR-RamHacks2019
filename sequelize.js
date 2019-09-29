const Sequelize = require('sequelize')
const EquipmentModel = require('./models/Equipment')
const RoomModel = require('./models/Room')
const RoomReserveModel = require('./models/RoomReserve')
const UserModel = require('./models/User')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
});

const User = UserModel(sequelize, Sequelize);
const Room = RoomModel(sequelize, Sequelize);
const Equipment = EquipmentModel(sequelize, Sequelize);
const RoomReserve = RoomReserveModel(sequelize, Sequelize);
const RoomEquipment = sequelize.define('room_equipment', {}, {timestamps: false})

Equipment.belongsToMany(Room, { through: RoomEquipment, unique: false });
Room.belongsToMany(Equipment, { through: RoomEquipment, unique: false });

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
})

module.exports = {
    User,
    Room,
    RoomReserve,
    Equipment,
    sequelize
}