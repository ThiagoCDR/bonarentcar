import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log("--- CARS PRICES ---");
    // Select specific columns to see raw values
    const cars = await db.all('SELECT id, name, price, priceApp, typeof(priceApp) as typeApp FROM cars');
    console.log(JSON.stringify(cars, null, 2));

    console.log("\n--- TEST QUERY (Type=app) ---");
    // Test the logic used in index.js
    const priceCondition = "AND priceApp IS NOT NULL AND priceApp > 0";
    // Also test robust casting
    const robustCondition = "AND CAST(priceApp AS FLOAT) > 0";

    const query = `
        SELECT id, name, priceApp FROM cars 
        WHERE available = 1 
        ${priceCondition}
    `;

    const result = await db.all(query);
    console.log(`Query Result (Standard Logic): ${result.length}`);
    console.log(JSON.stringify(result, null, 2));

    const queryRobust = `
        SELECT id, name, priceApp FROM cars 
        WHERE available = 1 
        ${robustCondition}
    `;
    const resultRobust = await db.all(queryRobust);
    console.log(`Query Result (Robust Logic): ${resultRobust.length}`);
    console.log(JSON.stringify(resultRobust, null, 2));

})();
