import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log("--- CARS ---");
    const cars = await db.all('SELECT * FROM cars');
    console.log(JSON.stringify(cars, null, 2));

    console.log("\n--- RENTALS TABLE INFO ---");
    const tableInfo = await db.all("PRAGMA table_info(rentals)");
    console.log(tableInfo);

    console.log("\n--- RENTALS DATA ---");
    const rentals = await db.all('SELECT * FROM rentals');
    console.log(JSON.stringify(rentals, null, 2));

    console.log("\n--- TEST QUERY ---");
    const endDate = '2025-12-30';
    const startDate = '2025-12-28';
    const query = `
        SELECT * FROM cars 
        WHERE available = 1 
        AND id NOT IN (
            SELECT carId FROM rentals 
            WHERE status = 'Ativo' 
            AND (startDate <= ? AND endDate >= ?)
        )
    `;
    const result = await db.all(query, endDate, startDate);
    console.log(`Query Result Count: ${result.length}`);
    console.log(JSON.stringify(result, null, 2));

})();
