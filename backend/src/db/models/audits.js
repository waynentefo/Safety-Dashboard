const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const audits = sequelize.define(
    'audits',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

audit_title: {
        type: DataTypes.TEXT,

      },

audit_date: {
        type: DataTypes.DATE,

      },

findings: {
        type: DataTypes.TEXT,

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

  audits.associate = (db) => {

    db.audits.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.audits.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return audits;
};

