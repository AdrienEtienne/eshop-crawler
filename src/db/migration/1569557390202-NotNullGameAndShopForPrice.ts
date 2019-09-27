import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotNullGameAndShopForPrice1569557390202
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_89dbe52505cd83dfa13e0cfe4c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_b6dbd2ee3bf57092f94d479425d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "UQ_76965292159240429f4c1c9c327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ALTER COLUMN "shopId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ALTER COLUMN "gameId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "UQ_76965292159240429f4c1c9c327" UNIQUE ("gameId", "shopId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices"
      ADD CONSTRAINT "FK_b6dbd2ee3bf57092f94d479425d"
      FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices"
      ADD CONSTRAINT "FK_89dbe52505cd83dfa13e0cfe4c1"
      FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_89dbe52505cd83dfa13e0cfe4c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_b6dbd2ee3bf57092f94d479425d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "UQ_76965292159240429f4c1c9c327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ALTER COLUMN "gameId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ALTER COLUMN "shopId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "UQ_76965292159240429f4c1c9c327" UNIQUE ("gameId", "shopId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices"
      ADD CONSTRAINT "FK_b6dbd2ee3bf57092f94d479425d"
      FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices"
      ADD CONSTRAINT "FK_89dbe52505cd83dfa13e0cfe4c1"
      FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
