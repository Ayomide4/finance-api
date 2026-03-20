import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  pgm.createTrigger('users', 'update_updated_at_column', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: "update_updated_at_column"
  })
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTrigger('users', 'update_updated_at_column')
  pgm.dropTable('users');
}
