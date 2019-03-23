let mongo = require("mongodb");
const config = require('./config/database');

// connecting to mongo database using plain old 
// mongo database options .... pretty cool ha
let x = mongo.connect(config.uri, config.options).then(function(db) {
    console.log(db);
}).catch(function(reason) {
    console.log("could not connect");
    console.log(reason);
})

// did it say something like response was not found?
// If so, we will check and see ...

// Go to places that definitely elevate your spirit and put 
// you on a quite different pedestal than the one which you are 
// used to, you know what I mean ...

// wherein should I look for the error? well, start with the 
// preference activity, since that is the activity the error
// has originated from ...

/*

A roadmap is generated for the user based on his filled preferences ...

The elegance and beauty of this program would only shine if we had huge data and an intelligent algorithm that would navigate through that data using user preferences as the only hints, or directions.

But for now we simply provide the user with a mock roadmap that is generated based off of a very simple algorithm, not the final 
sophisticated version ....

Roadmap is generated based on the following criteria: artifacts(which includes castles, musuem, cave, palace, churches, ...), services(including entertainment, culture, cuisine, fitness, nature ... and so on), and interestes (which includes movies, films, hikking, pizza, gari, swimming, and so on) ... they seem quite haphazard for now, but the will do nonetheless ...

*/