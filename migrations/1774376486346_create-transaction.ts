import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {

  pgm.createType('transaction_type', ['credit', 'debit'])
  pgm.createType('transaction_status', ['pending', 'posted', 'reversed'])


  pgm.createTable('transactions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    account_id: {
      type: 'uuid',
      notNull: true,
      references: '"accounts"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'uuid',
      references: '"categories"',
    },
    amount: {
      type: "numeric(19,4)",
      notNull: true,
    },
    type: {
      type: "transaction_type",
      notNull: true
    },
    description: {
      type: "text",
      //notNull: true? should we allow for blank descriptions? 
    },
    merchant_name: {
      type: "varchar",
    },
    status: {
      type: "transaction_status",
      default: "pending",
      notNull: true
    },
    posted_at: {
      type: 'timestamp',
      notNull: true,
    },
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

  pgm.createTrigger('transactions', 'update_updated_at_column', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: "update_updated_at_column"
  })
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTrigger('transactions', 'update_updated_at_column')
  pgm.dropTable('transactions')
  pgm.dropType('transaction_type')
  pgm.dropType('transaction_status')
}

