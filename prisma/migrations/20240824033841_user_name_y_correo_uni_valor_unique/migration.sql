/*
  Warnings:

  - A unique constraint covering the columns `[nombre_usuario]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_nombre_usuario_key" ON "User"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");
