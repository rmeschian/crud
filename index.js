import express from "express";

const app = express();

let events = {};

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
    extended : true
}));

// CREATE
app.post("/events", (req, res) => {
    const id = `event_${Date.now()}_${Math.random()}`;
    const newEvent = {
        id,
        ...req.body
    };

    events[id] = newEvent;
    res.send(newEvent);
});

// READ
app.get("/events/:id", (req, res) => {
    const event = events[req.params.id];
    if(event === undefined) {
        res.status(404).send('Event not found');
    } else {
        res.send(event);
    }
});

// UPDATE
app.put("/events/:id", (req, res) => {
    const event = events[req.params.id];
    if(event === undefined) {
        res.status(404).send('Event not found');
    } else {
        const updatedEvent = req.body;
        events[req.params.id] = updatedEvent;
        res.send(updatedEvent);
    }
});

// DELETE
app.delete("/events/:id", (req, res) => {
    const event = events[req.params.id];
    if(event === undefined) {
        res.status(404).send('Event not found');
    } else {
        delete events[req.params.id];
        res.send();
    }
});

// SEARCH
app.get("/events", (req, res) => {
    const {type, q} = req.query;
    const results = Object.values(events).filter(event => {
        if(type !== undefined && type !== event.type) {
            return false;
        }
        if(q !== undefined && event.name.search(new RegExp(q, 'i')) === -1) {
            return false;
        }
        return true;
    });
    res.send(results);
});





app.listen(3000);