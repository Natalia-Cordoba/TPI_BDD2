export async function insertarDocumento(db, coleccion, documento) {
    const resultado =
        await db
            .collection(coleccion)
            .insertOne(documento);
    return resultado.insertedId;
}

export async function leerActivos(db, coleccion) {
    return await db
        .collection(coleccion)
        .find({
            activo: true
        })
        .toArray();
}

export async function actualizarDocumento(db, coleccion, filtro, nuevosDatos) {
    const resultado =
        await db
            .collection(coleccion)
            .updateOne(
                filtro,
                { $set: nuevosDatos }
            );
    return resultado.modifiedCount;
}

export async function desactivarDocumento(db, coleccion, filtro) {
    const resultado =
        await db
            .collection(coleccion)
            .updateOne(
                filtro,
                { $set: { activo: false } }
            );
    return resultado.modifiedCount;
}