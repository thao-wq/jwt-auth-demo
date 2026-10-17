
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({
            message: 'Vui long nhap userName va password'
        });
    }

    // Giai ma Base64
    let decodedPassword;

    try {
        const cleanPassword = password.trim();

        decodedPassword = Buffer
            .from(cleanPassword, 'base64')
            .toString('utf8');

        if (
            Buffer.from(decodedPassword, 'utf8')
                .toString('base64') !== cleanPassword
        ) {
            return res.status(400).json({
                message: 'Password Base64 khong hop le'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Password Base64 khong hop le'
        });
    }

    try {
        // Tim tai khoan trong MySQL
        const [rows] = await db.execute(
            'SELECT id_user, user_name, password FROM users WHERE user_name = ?',
            [userName]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Sai tai khoan hoac mat khau'
            });
        }

        const user = rows[0];

        // So sanh mat khau
        if (decodedPassword !== user.password) {
            return res.status(401).json({
                message: 'Sai tai khoan hoac mat khau'
            });
        }

        // Tao JWT
        const token = jwt.sign(
            {
                id: user.id_user,
                userName: user.user_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        // Luu token vao MySQL
        await db.execute(
            'UPDATE users SET token = ? WHERE id_user = ?',
            [token, user.id_user]
        );

        return res.json({
            message: 'Dang nhap thanh cong',
            token: token,
            tokenType: 'Bearer'
        });

    } catch (error) {
        console.error('Loi dang nhap:', error.message);

        return res.status(500).json({
            message: 'Loi server hoac database'
        });
    }
});

module.exports = router;
