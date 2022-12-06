import 'dotenv/config';
import express, { json } from 'express';
//import { engine } from 'express-handlebars';
import { create } from 'express-handlebars';
import helmet from 'helmet';
import https from 'https';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import { getTodos, addTodo, cocheTodo } from './model/todo.js';
import { validateContact } from './validation.js'

// Configuration et création de l'engin de handlebars
let handlebars = create({
    helpers: {
        afficherArgent: (nombre) => nombre && nombre.toFixed(2) + ' $'
        
        /*(nombre) => {
            if(nombre){
                return nombre.toFixed(2) + ' $';
            }
            else {
                return null;
            }
        }*/
    }
})

// Création de la base de données de session
const MemoryStore = memorystore(session);

// Créer le serveur web
let app = express();
app.engine('handlebars', handlebars.engine);
//app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Ajouter les middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}))
app.use(express.static('public'));

// Ajouter les routes
app.get('/', async (request, response) => {
    if(request.session.countTodo === undefined) {
        request.session.countTodo = 0;
    }
    
    request.session.countTodo++;

    response.render('todo', {
        titre: 'Todo',
        styles: ['/css/todo.css'],
        scripts: ['/js/todo.js'],
        todos: await getTodos(),
        acceptCookie: request.session.accept,
        count: request.session.countTodo,
        argent: 289
    });
});

app.get('/apropos', (request, response) => {
    if(request.session.countAPropos === undefined) {
        request.session.countAPropos = 0;
    }
    
    request.session.countAPropos++;

    response.render('apropos', {
        titre: 'À propos',
        acceptCookie: request.session.accept,
        count: request.session.countAPropos
    });
});

app.get('/contact', (request, response) => {
    if(request.session.countContact === undefined) {
        request.session.countContact = 0;
    }
    
    request.session.countContact++;
    
    response.render('contact', {
        titre: 'Contact',
        styles: ['/css/contact.css'],
        scripts: ['/js/contact.js'],
        acceptCookie: request.session.accept,
        count: request.session.countContact
    });
});

app.post('/api/todo', async (request, response) => {
    let id = await addTodo(request.body.texte);
    response.status(201).json({ id: id });
});

app.patch('/api/todo', async (request, response) => {
    await cocheTodo(request.body.id);
    response.status(200).end();
});

app.post('/api/contact', (request, response) => {
    if(validateContact(request.body)) {
        console.log(request.body);
        response.status(200).end();
    }
    else {
        console.log(request.body);
        response.status(400).end();
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
})

// Démarrer le serveur web
if (process.env.NODE_ENV === 'production') {
    app.listen(app.get("port"), () => {
		console.info(`Serveur parti: http://${app.get("address")}:${app.get("port")}`);
	});
}
else {

	// Sinon, utilise https
    const credentials = {
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    }

    https
		.createServer(credentials, app)
		.listen(app.get("port"), () => {
			console.info(`Serveur parti: https://${app.get("address")}:${app.get("port")}`);
		});
}

//hebergement gratiuit "render"
