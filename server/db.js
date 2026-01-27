import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
}

export async function setupDb() {
    const db = await openDb();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    );

    DROP TABLE IF EXISTS cars;

    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      price DECIMAL,
      priceApp DECIMAL,
      available BOOLEAN DEFAULT 1,
      image TEXT,
      gallery TEXT, -- JSON string
      specs TEXT -- JSON string
    );

    DROP TABLE IF EXISTS rentals;

    CREATE TABLE IF NOT EXISTS rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carId INTEGER,
      userId INTEGER,
      clientName TEXT,
      carName TEXT,
      startDate TEXT,
      endDate TEXT,
      rentType TEXT, -- 'normal' or 'app'
      status TEXT,
      price DECIMAL,
      FOREIGN KEY (carId) REFERENCES cars(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT,
      date TEXT
    );
  `);

    // Seed Admin if not exists
    const admin = await db.get('SELECT * FROM users WHERE email = ?', 'admin@bona.com');
    if (!admin) {
        await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            'Administrador', 'admin@bona.com', 'admin123', 'admin');
        console.log('Admin user created');
    }

    // Seed Initial Fleet if empty
    const cars = await db.all('SELECT * FROM cars');
    if (cars.length === 0) {
        const initialFleet = [
            { id: 1, name: 'Fiat Mobi', category: 'Econômico', price: 90, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600', specs: JSON.stringify({ transmission: 'Manual', passengers: 4, bags: 1 }) },
            { id: 2, name: 'Hyundai HB20', category: 'Econômico', price: 110, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c698d2?auto=format&fit=crop&q=80&w=600', specs: JSON.stringify({ transmission: 'Manual', passengers: 5, bags: 2 }) },
            { id: 3, name: 'Jeep Compass', category: 'SUV', price: 250, image: 'https://images.unsplash.com/photo-1626077388041-33311f823229?auto=format&fit=crop&q=80&w=600', specs: JSON.stringify({ transmission: 'Automático', passengers: 5, bags: 4 }) },
        ];

        for (const car of initialFleet) {
            await db.run('INSERT INTO cars (name, category, price, image, specs) VALUES (?, ?, ?, ?, ?)',
                car.name, car.category, car.price, car.image, car.specs
            );
        }
        console.log('Initial fleet seeded');
    }
}
