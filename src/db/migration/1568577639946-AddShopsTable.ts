import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShopsTable1568577639946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "shops" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "code" character varying(2) NOT NULL,
          "country" text NOT NULL,
          "currency" character varying NOT NULL,
          "region" smallint NOT NULL,
          CONSTRAINT "PK_3c6aaa6607d287de99815e60b96"
          PRIMARY KEY ("id")
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "shops"`);
  }
}
