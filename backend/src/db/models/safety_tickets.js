const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const safety_tickets = sequelize.define(
    'safety_tickets',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

description: {
        type: DataTypes.TEXT,

      },

reported_date: {
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

  safety_tickets.associate = (db) => {

    db.safety_tickets.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.safety_tickets.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return safety_tickets;
};

