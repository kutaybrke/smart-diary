const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Fotoğraf yükleme için multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/akilli_gunluk')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));
app.use(cors());
app.use(bodyParser.json());

// Journal Entry Schema ve Model
const journalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    image: { type: String }, 
    sentimentScore: { type: Number }, 
    sentimentMagnitude: { type: Number }, 
}, { timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', journalSchema);

// Mood Schema ve Model
const moodSchema = new mongoose.Schema({
    mood: String,
    date: { type: Date, default: Date.now },
});

const MoodEntry = mongoose.model('MoodEntry', moodSchema);

// Reminder Schema ve Model
const reminderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    days: { type: [String], required: true },
    time: { type: String, required: true },
    notificationId: { type: String }, 
    active: { type: Boolean, default: false }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;

app.post('/api/journal', upload.single('image'), async (req, res) => {
    try {
        const { title, content, date, sentimentScore, sentimentMagnitude } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !content || !date) {
            return res.status(400).json({ error: 'Title, content, and date are required' });
        }

        const entry = new JournalEntry({
            title,
            content,
            date,
            image,
            sentimentScore,
            sentimentMagnitude,
        });

        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        console.error('API Hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/journalpage', async (req, res) => {
    try {
        const entries = await JournalEntry.find().sort({ date: -1 });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/journal/:id', async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        if (entry.image) {
            entry.image = `${baseUrl}/uploads/${entry.image}`; 
        }

        res.status(200).json(entry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/journalpage/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await JournalEntry.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/mood', async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const existingEntry = await MoodEntry.findOne({ date: { $gte: today } });

        if (existingEntry) {
            return res.status(400).json({ message: 'Bugün için zaten bir ruh hali kaydedildi.' });
        }

        const entry = new MoodEntry({ mood: req.body.mood });
        await entry.save();

        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/moods', async (req, res) => {
    try {
        const entries = await MoodEntry.find().sort({ date: -1 });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hatırlatıcı Ekleme
app.post('/api/reminders', async (req, res) => {
    try {
        const { title, days, time } = req.body;
        const reminder = new Reminder({ title, days, time });
        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Hatırlatıcı eklenirken hata:', error);
        res.status(500).json({ error: 'Hatırlatıcı eklenemedi.' });
    }
});


// Hatırlatıcı Listeleme
app.get('/api/reminders', async (req, res) => {
    try {
        const reminders = await Reminder.find();
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: 'Hatırlatıcılar alınamadı.' });
    }
});

// Hatırlatıcı Silme
app.delete('/api/reminders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await Reminder.findByIdAndDelete(id);
        if (!reminder) {
            return res.status(404).json({ message: 'Hatırlatıcı bulunamadı.' });
        }
        res.status(200).json({ message: 'Hatırlatıcı silindi.' });
    } catch (error) {
        res.status(500).json({ error: 'Hatırlatıcı silinirken hata oluştu.' });
    }
});
app.patch('/api/reminders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { active, notificationId } = req.body;
        const reminder = await Reminder.findByIdAndUpdate(id, { active, notificationId }, { new: true });
        if (!reminder) {
            return res.status(404).json({ message: 'Hatırlatıcı bulunamadı.' });
        }
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ error: 'Hatırlatıcı güncellenirken hata oluştu.' });
    }
});

// Sentiment Analysis 
app.get('/api/sentiment', async (req, res) => {
    try {
        const entries = await JournalEntry.find().sort({ date: 1 }); 
        const labels = entries.map(entry => entry.date.toISOString().split('T')[0]);
        const scores = entries.map(entry => entry.sentimentScore);

        // Tarihleri ve skorları gruplamak için
        const groupedData = labels.reduce((acc, label, index) => {
            if (!acc[label]) {
                acc[label] = [];
            }
            acc[label].push(scores[index]);
            return acc;
        }, {});

        // Ortalamalarını al
        const averageScores = Object.keys(groupedData).map(date => ({
            date,
            score: groupedData[date].reduce((a, b) => a + b, 0) / groupedData[date].length
        }));

        const response = {
            labels: averageScores.map(item => item.date),
            scores: averageScores.map(item => item.score),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
