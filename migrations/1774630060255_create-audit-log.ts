import { MigrationBuilder } from "node-pg-migrate"

export const up = (pgm: MigrationBuilder) => {

  pgm.createType('audit_action_type', ["created", "updated", "reversed", "deactivated"])

  pgm.createTable("audit_logs", {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: '"users"', onDelete: 'SET NULL' }, //we use set null so if user is delete we keep the audit log
    entity_type: { type: 'varchar(255)', notNull: true },
    entity_id: { type: 'uuid', notNull: true },
    action: { type: "audit_action_type", notNull: true },
    old_values: { type: "jsonb" }, //should be null because if you're creating there isn't a prev value
    new_values: { type: "jsonb", notNull: true },
    ip_address: { type: "inet", notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}


export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("audit_logs")
  pgm.dropType("audit_action_type")
}
