const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const prefix = "!";
mainChan = "";
histChan = "";

client.login(process.env.NIZ0yPOm1naLWsVcStqx83tGAwfNO7q_);

client.on("ready", () => {
	mainChan = client.channels.cache.find(tempChan => tempChan.name === "construction");
	histChan = client.channels.cache.find(tempChan => tempChan.name === "participation");
});

client.on("message", function(message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	
	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();
	
	if (command === "mainchan") {
		if (checkCommand(args)){
			const tempChan = client.channels.cache.find(tempChan => tempChan.name === args[0])
			if (tempChan){
				mainChan = tempChan;
				message.channel.send("Le channel principal est " + mainChan.name);
				message.delete();
			} else
				message.reply("Impossible de trouver le channel " + args[0]);
		}
  }
  if (command === "histChan") {
		if (checkCommand(args)){
			const tempChan = client.channels.cache.find(tempChan => tempChan.name === args[0])
			if (tempChan){
				histChan = tempChan;
				message.channel.send("Le channel de participation est " + histChan.name);
				message.delete();
			} else
				message.reply("Impossible de trouver le channel " + args[0]);
		}
  }
  
  if ((command === "construire" || command === "c")){
	  if(!construire(args)){
		  message.reply("Le format attendu est :\n !construire nomJoueur nivchâteau nourriture bois fer or");
	  }
	  message.delete();
  }
  
  if (command === "participer" || command === "p"){
	  if(!Participate(args, message)){
		  message.author.send("Le format attendu est :\n !participer ressource quantité");
	  }
	  message.delete();
  }
});

function checkCommand(args){
	if (args.length == 0){
		return false;
	} else {
		return true;
	}
}

function Participate(args, message){
	lastMessage = ""
	lastMessageContent = ""
	if (args.length == 2){
		mainChan.messages.fetch({ limit: 1 }).then(messages => {
		let lastMessage = messages.first();
		
		lastMessageContent = lastMessage.content;
			switch (args[0].toLowerCase()) {
				case 'nourriture':
				case 'food':
				case 'n':
					spliter = "Nourriture : ";
					break;
				case 'bois':
				case 'wood':
				case 'b':
					spliter = "Bois : ";
					break;
				case 'fer':
				case 'iron':
				case 'f':
					spliter = "Fer : ";
					break;
				case 'or':
				case 'gold':
				case 'o':
					spliter = "Or : ";
					break;
				default:
					message.author.send("La ressource n'a pas été trouvée ou comprise.");
				break;
			}
			if (lastMessageContent.indexOf(spliter) != -1){
				spliterLen = spliter.length;
				valueStart = lastMessageContent.indexOf(spliter) + spliterLen;
				valueEnd = lastMessageContent.indexOf("/",valueStart);
				currValue = lastMessageContent.substring(valueStart,valueEnd);
				maxValue = lastMessageContent.substring(valueEnd+1,lastMessageContent.indexOf("\n", valueEnd));
				newValue = parseInt(currValue) + parseInt(args[1]);
				
				if (parseInt(newValue) > parseInt(maxValue))
					message.author.send("Tu essaie de donner trop !");
				else {
					lastMessage.edit(lastMessageContent.substring(0,valueStart) + newValue + lastMessageContent.substring(valueEnd, 1000));
					beneficiaire = lastMessageContent.substring(lastMessageContent.indexOf("de")+ 3, lastMessageContent.indexOf(":")- 1);
					niv = lastMessageContent.substring(lastMessageContent.indexOf("château")+ 8, lastMessageContent.indexOf("de")- 1);
					histChan.send("Construction pour " + beneficiaire + " " + niv + "\n     " + message.author.username + " apporte " + args[1] + " " + spliter.substring(0,spliterLen - 3));
				}
			} else {
				message.author.send("Cette ressource n'est pas nécessaire à la construction");
			}
			})
			.catch(console.error);
		return true;
	} else {
		return false;
	}
}

function construire(args){
	if (args.length == 6){
		joueur = args[0];
		niv = args[1];
		nourriture = args[2];
		bois = args[3];
		fer = args[4];
		or = args[5];
		
		mainChan.send("@everyone On a besoin de vous pour un nouveau château !");
		messageToSend = "On construit le château " + niv + " de " + joueur + " :";
		if (nourriture != 0)
			messageToSend += "\nNourriture : " + 0 + "/" + nourriture;
		if (bois != 0)
			messageToSend += "\nBois : " + 0 + "/" + bois;
		if (fer != 0)
			messageToSend += "\nFer : " + 0 + "/" + fer;
		if (or != 0)
			messageToSend += "\nOr : " + 0 + "/" + or;
		
		mainChan.send(messageToSend);
		
		return true;
	} else {
		return false;
	}
}