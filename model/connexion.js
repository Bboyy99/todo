import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

let promesseConnexion = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

promesseConnexion = promesseConnexion.then((connexion) => {
    connexion.exec(
        `CREATE TABLE IF NOT EXISTS todo(
            id_todo INTEGER PRIMARY KEY,
            texte TEXT NOT NULL,
            est_coche INTEGER NOT NULL
        );`
    );

    return connexion;
});

export {promesseConnexion}