export async function insertarDocumento(db, coleccion, documento) {

    const resultado =
        await db
            .collection(coleccion)
            .insertOne(documento);

    return resultado.insertedId;

}

export async function leerActivos(db, coleccion){

    return await db
        .collection(coleccion)
        .find({
            activo:true
        })
        .toArray();

}
