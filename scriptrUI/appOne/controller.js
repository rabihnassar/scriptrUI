var log = require("log");
log.setLevel("INFO");

function process(client, msg) {
    log.info(msg);
    switch(msg.widgetId) {
        case "slider":
            client.send("display", "Value "+msg.payload)
            break;
	    case "switch":
            client.send("display", "switch is: " + msg.payload)
            break;
        default:
            break;
    }   
}			