
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class She_meetingsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const she_meetings = await db.she_meetings.create(
            {
                id: data.id || undefined,

        meeting_type: data.meeting_type
        ||
        null
            ,

        start_time: data.start_time
        ||
        null
            ,

        end_time: data.end_time
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return she_meetings;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const she_meetingsData = data.map((item, index) => ({
                id: item.id || undefined,

                meeting_type: item.meeting_type
            ||
            null
            ,

                start_time: item.start_time
            ||
            null
            ,

                end_time: item.end_time
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const she_meetings = await db.she_meetings.bulkCreate(she_meetingsData, { transaction });

        return she_meetings;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const she_meetings = await db.she_meetings.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.meeting_type !== undefined) updatePayload.meeting_type = data.meeting_type;

        if (data.start_time !== undefined) updatePayload.start_time = data.start_time;

        if (data.end_time !== undefined) updatePayload.end_time = data.end_time;

        updatePayload.updatedById = currentUser.id;

        await she_meetings.update(updatePayload, {transaction});

        return she_meetings;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const she_meetings = await db.she_meetings.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of she_meetings) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of she_meetings) {
                await record.destroy({transaction});
            }
        });

        return she_meetings;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const she_meetings = await db.she_meetings.findByPk(id, options);

        await she_meetings.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await she_meetings.destroy({
            transaction
        });

        return she_meetings;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const she_meetings = await db.she_meetings.findOne(
            { where },
            { transaction },
        );

        if (!she_meetings) {
            return she_meetings;
        }

        const output = she_meetings.get({plain: true});

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

                if (filter.meeting_type) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'she_meetings',
                            'meeting_type',
                            filter.meeting_type,
                        ),
                    };
                }

            if (filter.start_timeRange) {
                const [start, end] = filter.start_timeRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    start_time: {
                    ...where.start_time,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    start_time: {
                    ...where.start_time,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.end_timeRange) {
                const [start, end] = filter.end_timeRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    end_time: {
                    ...where.end_time,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    end_time: {
                    ...where.end_time,
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
            const { rows, count } = await db.she_meetings.findAndCountAll(queryOptions);

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
                        'she_meetings',
                        'meeting_type',
                        query,
                    ),
                ],
            };
        }

        const records = await db.she_meetings.findAll({
            attributes: [ 'id', 'meeting_type' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['meeting_type', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.meeting_type,
        }));
    }

};

