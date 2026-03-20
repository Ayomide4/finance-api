import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {

  pgm.createType('account_type', ['savings', 'checking', 'investment']);
  pgm.createType('account_status', ['active', 'frozen', 'closed']);

  pgm.createTable('accounts', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    account_name: { type: 'varchar(255)', notNull: true },
    account_type: { type: "account_type", notNull: true },
    account_status: { type: "account_status", default: "active", notNull: true },
    currency: { type: 'char(3)', notNull: true, default: 'USD' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })

  pgm.createTrigger('accounts', 'update_updated_at_column', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: "update_updated_at_column"
  })
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTrigger('accounts', 'update_updated_at_column')
  pgm.dropTable('accounts')
  pgm.dropType('account_type')
  pgm.dropType('account_status')
}
