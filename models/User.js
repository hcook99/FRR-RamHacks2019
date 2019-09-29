module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {type: type.STRING, allowNull: false}

    }, {
      timestamps: false
    });
    return User;
};