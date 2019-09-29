module.exports = (sequelize, type) => {
    const RoomReserve = sequelize.define('room_reserve', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name_event: {type: type.STRING, allowNull: false},
      date_meet: {type: type.DATE, allowNull: false},
      start_time: {type: type.TIME, allowNull: false},
      end_time: {type: type.TIME, allowNull: false},
      user_id: {type: type.INTEGER, allowNull: false},
      room_id: {type: type.INTEGER, allowNull: false}
    }, {
      timestamps: false
    });
    return RoomReserve;
};