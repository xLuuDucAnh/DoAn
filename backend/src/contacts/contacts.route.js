const express = require('express');
const Contact = require('./contacts.model');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

// POST: Save a contact message (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).send({ message: "Vui lòng cung cấp đầy đủ thông tin" });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        res.status(201).send({ message: "Tin nhắn của bạn đã được gửi thành công!" });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).send({ message: "Lỗi khi gửi tin nhắn" });
    }
});

// GET: Fetch all contact messages (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).send(contacts);
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).send({ message: "Lỗi khi lấy danh sách tin nhắn" });
    }
});

// DELETE: Delete a contact message (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).send({ message: "Không tìm thấy tin nhắn" });
        }

        res.status(200).send({ message: "Đã xóa tin nhắn thành công" });
    } catch (error) {
        console.error("Error deleting contact message:", error);
        res.status(500).send({ message: "Lỗi khi xóa tin nhắn" });
    }
});

module.exports = router;
