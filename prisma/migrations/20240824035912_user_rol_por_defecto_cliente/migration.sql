-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_usuario" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'cliente'
);
INSERT INTO "new_User" ("apellido", "contrasena", "correo", "id", "nombre", "nombre_usuario", "rol") SELECT "apellido", "contrasena", "correo", "id", "nombre", "nombre_usuario", "rol" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_nombre_usuario_key" ON "User"("nombre_usuario");
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
