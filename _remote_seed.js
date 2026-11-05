const crypto = require("crypto");
const bcrypt = require("bcryptjs");

require("./src/app");
const sequelize = require("./src/config/dbconfig");
const { seedArchives } = require("./src/features/Archives/seed");
const { seedProgrammes } = require("./src/features/Programmes/seed");

(async () => {
  await sequelize.initializationPromise;
  await seedArchives();
  await seedProgrammes();

  const password = await bcrypt.hash(process.env.CBAAC_ADMIN_PASSWORD, 12);

  await sequelize.query(
    `INSERT INTO "User1"
      ("id", "email", "password", "role", "verified", "isApproved", "createdAt", "updatedAt")
     VALUES
      (:id, :email, :password, 'Admin', TRUE, TRUE, NOW(), NOW())
     ON CONFLICT ("email") DO UPDATE SET
      "password" = EXCLUDED."password",
      "role" = 'Admin',
      "verified" = TRUE,
      "isApproved" = TRUE,
      "deletedAt" = NULL,
      "updatedAt" = NOW()`,
    {
      replacements: {
        id: crypto.randomUUID(),
        email: "admin@cback.com",
        password,
      },
    }
  );

  const [admin] = await sequelize.query(
    `SELECT "email", "role", "verified", "isApproved"
       FROM "User1"
      WHERE "email" = :email`,
    {
      replacements: { email: "admin@cback.com" },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  const [collections] = await sequelize.query(
    `SELECT COUNT(*)::int AS count FROM "ArchiveCollections"`
  );
  const [programmes] = await sequelize.query(
    `SELECT COUNT(*)::int AS count FROM "Programmes"`
  );

  console.log(
    JSON.stringify({
      admin,
      archiveCollections: collections[0].count,
      programmes: programmes[0].count,
    })
  );

  await sequelize.close();
})().catch(async (error) => {
  console.error("REMOTE SEED FAILED:", error.message);
  try {
    await sequelize.close();
  } catch (_) {}
  process.exit(1);
});
