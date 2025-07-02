
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AuditsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const audits = await db.audits.create(
            {
                id: data.id || undefined,

        audit_title: data.audit_title
        ||
        null
            ,

        audit_date: data.audit_date
        ||
        null
            ,

        findings: data.findings
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return audits;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const auditsData = data.map((item, index) => ({
                id: item.id || undefined,

                audit_title: item.audit_title
            ||
            null
            ,

                audit_date: item.audit_date
            ||
            null
            ,

                findings: item.findings
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const audits = await db.audits.bulkCreate(auditsData, { transaction });

        return audits;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const audits = await db.audits.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.audit_title !== undefined) updatePayload.audit_title = data.audit_title;

        if (data.audit_date !== undefined) updatePayload.audit_date = data.audit_date;

        if (data.findings !== undefined) updatePayload.findings = data.findings;

        updatePayload.updatedById = currentUser.id;

        await audits.update(updatePayload, {transaction});

        return audits;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const audits = await db.audits.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of audits) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of audits) {
                await record.destroy({transaction});
            }
        });

        return audits;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const audits = await db.audits.findByPk(id, options);

        await audits.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await audits.destroy({
            transaction
        });

        return audits;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const audits = await db.audits.findOne(
            { where },
            { transaction },
        );

        if (!audits) {
            return audits;
        }

        const output = audits.get({plain: true});

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

                if (filter.audit_title) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'audits',
                            'audit_title',
                            filter.audit_title,
                        ),
                    };
                }

                if (filter.findings) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'audits',
                            'findings',
                            filter.findings,
                        ),
                    };
                }

            if (filter.audit_dateRange) {
                const [start, end] = filter.audit_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    audit_date: {
                    ...where.audit_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    audit_date: {
                    ...where.audit_date,
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
            const { rows, count } = await db.audits.findAndCountAll(queryOptions);

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
                        'audits',
                        'audit_title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.audits.findAll({
            attributes: [ 'id', 'audit_title' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['audit_title', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.audit_title,
        }));
    }

};

