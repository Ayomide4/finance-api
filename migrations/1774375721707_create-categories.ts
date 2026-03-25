import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {

  pgm.createTable('categories', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'uuid',
      references: '"users"',
      default: null,
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(50)', notNull: true },
    color: { type: 'varchar(7)', notNull: true }, //7 for hexcode
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
  })

  pgm.addConstraint('categories', 'unique_user_category_name', {
    unique: ['user_id', 'name']
  });
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('categories')
}
