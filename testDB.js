const db = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT * FROM users');

        console.log('Ket noi MySQL thanh cong!');
        console.log('Danh sach tai khoan:', rows);
    } catch (error) {
        console.error('Loi ket noi MySQL:', error.message);
    } finally {
        await db.end();
    }
}

testConnection();