import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('api_keys', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    name: { type: 'varchar(255)' },
    prefix: { type: 'char(12)', notNull: true },
    hash: { type: 'char(64)', notNull: true, unique: true },
    revoked_at: { type: 'timestamp' },
    expires_at: { type: 'timestamp' },
    last_used_at: { type: 'timestamp' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
  })

}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('api_keys')
}
