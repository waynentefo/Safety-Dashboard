const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const inspections = sequelize.define(
    'inspections',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

inspection_type: {
        type: DataTypes.TEXT,

      },

inspection_date: {
        type: DataTypes.DATE,

      },

remarks: {
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

  inspections.associate = (db) => {

    db.inspections.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.inspections.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return inspections;
};

