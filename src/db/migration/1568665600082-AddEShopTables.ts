import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEShopTables1568665600082 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "games" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "title" text NOT NULL,
            "titleSlug" text NOT NULL,
            "euId" text, "americaId" text,
            "jpId" text, "description" text,
            "descriptionShort" text,
            "euReleaseDate" text,
            "americaReleaseDate" text,
            "jpReleaseDate" text,
            "euUrl" text,
            "euImageUrl" text,
            "americaUrl" text,
            "japanUrl" text,
            CONSTRAINT "UQ_bb4d0622e4b21e17681e5e7f72e" UNIQUE ("titleSlug"),
            CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id")
            )`);
    await queryRunner.query(`CREATE TABLE "shops" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "code" character varying(2) NOT NULL,
            "country" text NOT NULL,
            "currency" character varying NOT NULL,
            "region" smallint NOT NULL,
            CONSTRAINT "UQ_da5c5ea63faff39450f03e9b06d"
            UNIQUE ("code"), CONSTRAINT "PK_3c6aaa6607d287de99815e60b96" PRIMARY KEY ("id")
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "shops"`);
    await queryRunner.query(`DROP TABLE "games"`);
  }
}
