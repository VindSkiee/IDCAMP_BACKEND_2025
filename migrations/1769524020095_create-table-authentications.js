/* eslint-disable camelcase */

export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
}

export async function down(pgm) {
  pgm.dropTable('authentications');
}
