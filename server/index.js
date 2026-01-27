import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { openDb, setupDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../src/assets/car_image');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and append unique timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Serve uploaded images statically
app.use('/src/assets/car_image', express.static(path.join(__dirname, '../src/assets/car_image')));

// Initialize DB
setupDb();

// --- Upload Route ---
app.post('/api/upload', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Return paths that can be used by the frontend
        // Assuming we serve them via the static middleware we just set up
        const filePaths = req.files.map(file => {
            // We return the path relative to the server root (or absolute URL if needed)
            // Here we return a path that matches the static route
            return `http://localhost:${PORT}/src/assets/car_image/${file.filename}`;
        });

        res.json({ paths: filePaths });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    const db = await openDb();
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', email, password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const db = await openDb();
    const { name, email, password } = req.body;

    // Check existing
    const existing = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (existing) {
        return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const result = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', name, email, password, 'client');
    const user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);

    const { password: p, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

app.post('/api/auth/google', async (req, res) => {
    const db = await openDb();
    const { token, email, name, picture } = req.body;

    // In a production env, verify 'token' with Google's library.
    // For this prototype, we trust the client provided email/name (derived from the token on frontend)
    // or we decode it here if passed raw.

    // Check if user exists
    let user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user) {
        // Create new user automatically
        const result = await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            name, email, 'google-auth', 'client'
        );
        user = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
    }

    const { password: p, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// --- Cars Routes ---
app.get('/api/cars', async (req, res) => {
    const db = await openDb();
    const cars = await db.all('SELECT * FROM cars');
    // Parse specs and gallery JSON
    const parsedCars = cars.map(car => ({
        ...car,
        available: !!car.available, // Convert 1/0 to boolean
        specs: car.specs ? JSON.parse(car.specs) : {},
        gallery: car.gallery ? JSON.parse(car.gallery) : []
    }));
    res.json(parsedCars);
});

app.post('/api/cars', async (req, res) => {
    const db = await openDb();
    const { name, category, price, priceApp, available, image, gallery, specs } = req.body;
    console.log('POST /api/cars payload size:', JSON.stringify(req.body).length);
    console.log('Images received:', gallery ? gallery.length : 0);

    try {
        await db.run(
            `INSERT INTO cars (name, category, price, priceApp, available, image, gallery, specs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            name, category, price, priceApp, available ? 1 : 0, image, JSON.stringify(gallery), JSON.stringify(specs)
        );
        console.log("Car created successfully.");
        res.status(201).json({ message: 'Carro criado' });
    } catch (err) {
        console.error("Error creating car:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/cars/:id', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;
    const { name, category, price, priceApp, available, image, gallery, specs } = req.body;
    console.log(`PUT /api/cars/${id} payload size:`, JSON.stringify(req.body).length);
    console.log('Images received:', gallery ? gallery.length : 0);

    try {
        const result = await db.run(
            `UPDATE cars SET name = ?, category = ?, price = ?, priceApp = ?, available = ?, image = ?, gallery = ?, specs = ? WHERE id = ?`,
            name, category, price, priceApp, available ? 1 : 0, image, JSON.stringify(gallery), JSON.stringify(specs), id
        );
        console.log(`PUT update result: changes=${result.changes}, lastID=${result.lastID}`);
        console.log(`Target ID: ${id} (type: ${typeof id})`);
        console.log(`Image content starts with: ${image ? image.substring(0, 30) : 'null'}...`);

        if (result.changes === 0) {
            console.warn(`WARNING: No rows updated for ID ${id}. Check if car exists.`);
            return res.status(404).json({ message: 'Carro não encontrado para atualização' });
        }

        console.log("Car updated successfully.");
        res.json({ message: 'Carro atualizado' });
    } catch (err) {
        console.error("Error updating car:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/cars/:id', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;
    await db.run('DELETE FROM cars WHERE id = ?', id);
    res.json({ message: 'Carro deletado' });
});

app.post('/api/cars/:id/toggle-availability', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;
    const car = await db.get('SELECT available FROM cars WHERE id = ?', id);
    if (car) {
        const newStatus = car.available ? 0 : 1;
        await db.run('UPDATE cars SET available = ? WHERE id = ?', newStatus, id);
        res.json({ message: 'Availability toggled', available: !!newStatus });
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});


// --- Rentals Routes ---
app.get('/api/rentals', async (req, res) => {
    const db = await openDb();
    const rentals = await db.all('SELECT * FROM rentals');
    res.json(rentals);
});

app.post('/api/rentals', async (req, res) => {
    const db = await openDb();
    const { carId, userId, clientName, carName, startDate, endDate, rentType, status, price } = req.body;
    await db.run(
        `INSERT INTO rentals (carId, userId, clientName, carName, startDate, endDate, rentType, status, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        carId, userId, clientName, carName, startDate, endDate, rentType, status, price
    );
    res.status(201).json({ message: 'Aluguel criado' });
});

app.put('/api/rentals/:id', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;
    const { status, paymentStatus } = req.body; // paymentStatus is optional if we merge it into status

    try {
        // We'll update the status field. If you want separate payment status, we can add a column, 
        // but for now the user requested status options like: paid, in processing, pending payment.
        // So we assume 'status' holds these values.

        const result = await db.run(
            'UPDATE rentals SET status = ? WHERE id = ?',
            status, id
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        res.json({ message: 'Rental updated', status });
    } catch (err) {
        console.error("Error updating rental:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/rentals/:id', async (req, res) => {
    const db = await openDb();
    const { id } = req.params;
    try {
        await db.run('DELETE FROM rentals WHERE id = ?', id);
        res.json({ message: 'Rental deleted' });
    } catch (err) {
        console.error("Error deleting rental:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/available-cars', async (req, res) => {
    const db = await openDb();
    const { startDate, endDate, type } = req.query;

    console.log(`Checking availability for: ${startDate} to ${endDate}, Type: ${type}`);

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and End date required' });
    }

    // Normalize type
    const normalizedType = (type || '').toLowerCase().trim();

    console.log(`Checking availability for: ${startDate} to ${endDate}, Type: ${normalizedType}`);

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and End date required' });
    }

    let priceCondition = "";
    if (normalizedType === 'app') {
        // Robust check: Not Null, Not Empty String, Greater than 0
        priceCondition = "AND priceApp IS NOT NULL AND priceApp != '' AND CAST(priceApp AS REAL) > 0";
    } else {
        // Default to normal daily price
        priceCondition = "AND price IS NOT NULL AND price != '' AND CAST(price AS REAL) > 0";
    }

    // Logic: Get all cars that are globally available, have the requested price type, and do not have overlapping rentals
    const query = `
        SELECT * FROM cars 
        WHERE available = 1 
        ${priceCondition}
        AND id NOT IN (
            SELECT carId FROM rentals 
            WHERE status = 'Ativo' 
            AND (startDate <= ? AND endDate >= ?)
        )
    `;

    try {
        const cars = await db.all(query, endDate, startDate);
        console.log(`Found ${cars.length} cars available.`);

        const parsedCars = cars.map(car => ({
            ...car,
            available: !!car.available,
            specs: car.specs ? JSON.parse(car.specs) : {},
            gallery: car.gallery ? JSON.parse(car.gallery) : []
        }));

        res.json(parsedCars);
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Contact/Messages API
app.post('/api/contact', async (req, res) => {
    const db = await openDb();
    const { name, email, message } = req.body;
    const date = new Date().toLocaleString('pt-BR');

    try {
        await db.run(
            'INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)',
            name, email, message, date
        );
        res.json({ success: true, message: 'Message sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages', async (req, res) => {
    const db = await openDb();
    try {
        const messages = await db.all('SELECT * FROM messages ORDER BY id DESC');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
