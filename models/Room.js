module.exports = (sequelize, type) => {
    const Room = sequelize.define('room', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      floor: {type: type.INTEGER, allowNull: false},
      room: {type: type.STRING, allowNull: false},
      size: {type: type.INTEGER, allowNull: false}
    }, {
      timestamps: false
    });
    return Room;
};