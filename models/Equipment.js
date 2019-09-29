module.exports = (sequelize, type) => {
    const Equipment = sequelize.define('equipment', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {type: type.STRING, allowNull: false}
    }, {
      timestamps: false
    });
    return Equipment;
};