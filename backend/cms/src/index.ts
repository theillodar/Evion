import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const publicRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        return;
      }

      const actions = [
        'api::product.product.find',
        'api::product.product.findOne',
        'api::brand.brand.find',
        'api::brand.brand.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
      ];

      const permissionQuery = strapi.db.query('plugin::users-permissions.permission');

      for (const action of actions) {
        const rows = await permissionQuery.findMany({
          where: {
            role: publicRole.id,
            action,
          },
        });

        for (const row of rows) {
          await permissionQuery.update({
            where: { id: row.id },
            data: { enabled: true },
          });
        }
      }
    } catch (error) {
      strapi.log.warn(`Permissions bootstrap skipped: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  },
};
