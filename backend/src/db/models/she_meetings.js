const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const she_meetings = sequelize.define(
    'she_meetings',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

meeting_type: {
        type: DataTypes.TEXT,

      },

start_time: {
        type: DataTypes.DATE,

      },

end_time: {
        type: DataTypes.DATE,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  she_meetings.associate = (db) => {

    db.she_meetings.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.she_meetings.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return she_meetings;
};

