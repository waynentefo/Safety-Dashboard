
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InspectionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const inspections = await db.inspections.create(
            {
                id: data.id || undefined,

        inspection_type: data.inspection_type
        ||
        null
            ,

        inspection_date: data.inspection_date
        ||
        null
            ,

        remarks: data.remarks
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return inspections;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const inspectionsData = data.map((item, index) => ({
                id: item.id || undefined,

                inspection_type: item.inspection_type
            ||
            null
            ,

                inspection_date: item.inspection_date
            ||
            null
            ,

                remarks: item.remarks
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const inspections = await db.inspections.bulkCreate(inspectionsData, { transaction });

        return inspections;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const inspections = await db.inspections.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.inspection_type !== undefined) updatePayload.inspection_type = data.inspection_type;

        if (data.inspection_date !== undefined) updatePayload.inspection_date = data.inspection_date;

        if (data.remarks !== undefined) updatePayload.remarks = data.remarks;

        updatePayload.updatedById = currentUser.id;

        await inspections.update(updatePayload, {transaction});

        return inspections;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const inspections = await db.inspections.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of inspections) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of inspections) {
                await record.destroy({transaction});
            }
        });

        return inspections;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const inspections = await db.inspections.findByPk(id, options);

        await inspections.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await inspections.destroy({
            transaction
        });

        return inspections;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const inspections = await db.inspections.findOne(
            { where },
            { transaction },
        );

        if (!inspections) {
            return inspections;
        }

        const output = inspections.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.inspection_type) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'inspections',
                            'inspection_type',
                            filter.inspection_type,
                        ),
                    };
                }

                if (filter.remarks) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'inspections',
                            'remarks',
                            filter.remarks,
                        ),
                    };
                }

            if (filter.inspection_dateRange) {
                const [start, end] = filter.inspection_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    inspection_date: {
                    ...where.inspection_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    inspection_date: {
                    ...where.inspection_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.inspections.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'inspections',
                        'inspection_type',
                        query,
                    ),
                ],
            };
        }

        const records = await db.inspections.findAll({
            attributes: [ 'id', 'inspection_type' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['inspection_type', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.inspection_type,
        }));
    }

};

