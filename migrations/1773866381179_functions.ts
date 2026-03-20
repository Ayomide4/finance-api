import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createFunction(
    "update_updated_at_column", [], { returns: 'trigger', language: 'plpgsql', replace: true },

    `BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END`)
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropFunction("update_updated_at_column", [])
}
