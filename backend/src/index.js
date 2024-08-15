const express = require('express')
const bodyParser = require('body-parser')
const personnelRoutes = require('./routes/personnel.routes')
const taskRoutes = require('./routes/task.routes')
const subtaskRoutes = require('./routes/subtask.routes')
const rolesController = require('./controllers/roleController')
const db = require('./config/dbconnection')
const authRoutes = require('./routes/auth.routes')
const setupAssociations = require('./config/dbassociations')
const adminAccountSeed = require('./config/adminAccountSeed')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const cookieSession = require('cookie-session')
const personnelController = require('./controllers/personnelController')
const cron = require('node-cron')
const { updateAllTasks } = require('./utils/cron.utils')

const app = express()

app.use(bodyParser.json())

const corsOptions = {
    origin: process.env.SERVER_HOST.split(';'),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionSuccessStatus: 200,
}

app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(
    cookieSession({
        name: 'session',
        keys: [process.env.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
    })
)

app.use('/api/auth', authRoutes)
app.use('/api/personnel', personnelRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/subtasks', subtaskRoutes)

app.get('/api/currentUser', personnelController.getUserInfo)

setupAssociations()
adminAccountSeed()

const PORT = process.env.SERVER_PORT
db.sync({ alter: true })
    .then(() => {
        console.info('Database synced')
        return rolesController.initializeRoles()
    })
    .then(() => {
        app.listen(PORT, () => console.info(`Server running on port ${PORT}`))
        cron.schedule('*/5 * * * * *', async () => updateAllTasks())
    })
    .catch((error) => console.error('Error syncing database:', error))
