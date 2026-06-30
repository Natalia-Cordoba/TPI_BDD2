import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { insertarDocumento, leerActivos, actualizarDocumento, desactivarDocumento } from "./crud.js";
dotenv.config();

// Se obtienen las variables del archivo .env
const uri = process.env.MONGODB_URI;
const database = process.env.DATABASE_NAME;
const client = new MongoClient(uri);

async function main() {
    try {
        // Conexión
        await client.connect();
        console.log("Conectado exitosamente a MongoDB Atlas.\n");
        const db = client.db(database);
// Creación de índice único sobre el campo email en la colección usuarios
     // Evita que se registren dos usuarios con el mismo correo electrónico
     await db.collection("usuarios").createIndex(
    { email: 1 },
    { unique: true }
     );
     console.log("Índice único sobre 'email' creado correctamente.");
     
        // Definición de los documentos
        const nuevoUsuario = {
            nombre: "Agostina Méndez",
            email: "agostina@gmail.com",
            password_hash: "$2b$12$xyz",
            roles: ["visitante"],
            activo: true,
            fecha_registro: new Date(),
            perfil: {
                ciudad: "La Plata",
                avatar_url: "https://cdn.museo.art/avatars/agostina.jpg"
            }
        };

        const nuevaObra = {
            titulo: "Cielo Patagónico",
            descripcion: "Paisaje realizado en óleo.",
            tecnica: "Óleo",
            anio_creacion: 2026,
            precio_usd: 700,
            imagen_url: "https://cdn.museo.art/obras/cielo.jpg",
            dimensiones: {
                alto_cm: 60,
                ancho_cm: 90
            },
            categorias: ["paisaje"],
            disponible_venta: true,
            activo: true,
            fecha_publicacion: new Date(),
            artista_snapshot: {
                nombre: "Valentina Ríos",
                ciudad: "Bariloche"
            },
            estadisticas: {
                total_vistas: 0,
                promedio_puntuacion: 0
            }
        };

        // Ejecución del CREATE
        console.log("\n--- INSERTANDO DOCUMENTOS ---");
        const idUsuario = await insertarDocumento(db, "usuarios", nuevoUsuario);
        console.log(`Usuario registrado correctamente con ID: ${idUsuario}`);

        const idObra = await insertarDocumento(db, "obras", nuevaObra);
        console.log(`Obra registrada correctamente con ID: ${idObra}\n`);

        // Ejecución del READ
        console.log("\n--- LEYENDO DOCUMENTOS ACTIVOS ---");
        const usuariosActivos = await leerActivos(db, "usuarios");
        console.log(`Usuarios activos encontrados: ${usuariosActivos.length}`);
        console.log(usuariosActivos);

        const obrasActivas = await leerActivos(db, "obras");
        console.log(`Obras activas encontradas: ${obrasActivas.length}`);
        console.log(usuariosActivos);
        // Ejecución del UPDATE
console.log("\n--- ACTUALIZANDO DOCUMENTO ---");
const modificados = await actualizarDocumento(
    db,
    "obras",
    { _id: idObra },
    { precio_usd: 900, disponible_venta: false }
);
console.log(`Documentos modificados: ${modificados}`);

// Ejecución del DELETE (Baja Lógica)
console.log("\n--- DESACTIVANDO DOCUMENTO (BAJA LÓGICA) ---");
const desactivados = await desactivarDocumento(
    db,
    "usuarios",
    { _id: idUsuario }
);
console.log(`Documentos desactivados: ${desactivados}`);
    }
    catch (error) {
        // Manejo de errores
        console.error("Ocurrió un error durante la ejecución:", error);
    } finally {
        // Cierre de conexión para liberar memoria
        await client.close();
        console.log("\nDesconectado de MongoDB Atlas. Proceso finalizado.");
    }
}

main();