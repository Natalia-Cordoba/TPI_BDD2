@echo off
REM ============================================================
REM  Script de resguardo - TPI Museo Virtual de Arte
REM  Parte II - Bases de Datos II - UTN TUPaD
REM ============================================================

REM -- Obtener fecha actual en formato YYYY-MM-DD
for /f "tokens=2-4 delims=/ " %%a in ("%date%") do (
    set DIA=%%a
    set MES=%%b
    set ANO=%%c
)
set FECHA_HOY=%ANO%-%MES%-%DIA%

REM -- Definir rutas relativas
set CARPETA_BASE=resguardos_tpi
set CARPETA_DESTINO=%CARPETA_BASE%\%FECHA_HOY%

echo.
echo ============================================================
echo   Resguardo TPI - Museo Virtual de Arte
echo   Fecha: %FECHA_HOY%
echo   Destino: %CARPETA_DESTINO%
echo ============================================================
echo.

REM -- Crear carpeta base si no existe
echo [1/3] Creando carpeta de resguardo...
if not exist "%CARPETA_BASE%" (
    mkdir "%CARPETA_BASE%"
    echo       Carpeta principal creada: %CARPETA_BASE%
) else (
    echo       Carpeta principal ya existe: %CARPETA_BASE%
)

mkdir "%CARPETA_DESTINO%"
echo       Subcarpeta creada: %CARPETA_DESTINO%
echo.

REM -- Ejecutar mongodump conectandose remotamente a Atlas
echo [2/3] Ejecutando mongodump contra MongoDB Atlas...
echo.

mongodump --uri="mongodb+srv://dbProfesor:ProfesorBDD2TPI@tpi-bdd-museo-virtual.bcgdvn7.mongodb.net/museo_virtual" --out="%CARPETA_DESTINO%"

REM -- Verificar resultado
if %ERRORLEVEL% == 0 (
    echo.
    echo [3/3] Resguardo completado con exito.
    echo       Archivos guardados en: %CARPETA_DESTINO%
) else (
    echo.
    echo [3/3] ERROR: mongodump fallo. Verifique la conexion.
)

echo.
echo ============================================================
echo   Fin del script de resguardo
echo ============================================================
echo.
pause