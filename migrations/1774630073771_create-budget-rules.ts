import { MigrationBuilder } from "node-pg-migrate"

export const up = (pgm: MigrationBuilder) => {

  pgm.createType('period_type', ["weekly", "monthly"])

  pgm.createTable("budget_rules", {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: '"users"', onDelete: 'SET NULL', unique: true },
    category_id: { type: 'uuid', references: '"categories"', onDelete: 'CASCADE', unique: true },
    period: { type: "period_type", notNull: true, unique: true },
    amount: { type: "numeric(19,4)", notNull: true },
    alert_threshold_pct: { type: 'int', notNull: true, default: 80 },
    is_active: { type: "boolean", notNull: true, default: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}


export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("budget_rules")
  pgm.dropType("period_type")
}
