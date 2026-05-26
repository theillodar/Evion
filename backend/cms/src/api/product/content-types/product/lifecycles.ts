const PRODUCT_UID = 'api::product.product';

function toCodeNumber(value: string): number | null {
  const match = value.match(/^AMZ-(\d+)$/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? null : parsed;
}

async function getNextProductCode(strapi: any): Promise<string> {
  const entries = await strapi.db.query(PRODUCT_UID).findMany({
    select: ['code'],
    where: {
      code: {
        $startsWith: 'AMZ-',
      },
    },
    limit: 10000,
  });

  let max = 0;
  for (const item of entries) {
    if (typeof item.code !== 'string') {
      continue;
    }

    const num = toCodeNumber(item.code);
    if (num !== null && num > max) {
      max = num;
    }
  }

  const next = max + 1;
  const width = Math.max(3, String(next).length);
  return `AMZ-${String(next).padStart(width, '0')}`;
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    if (data?.code) {
      return;
    }

    data.code = await getNextProductCode(strapi);
  },
};
