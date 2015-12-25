// Create a new Mongo collection called Images
Images = new Mongo.Collection("images");
// Collections are shared by the client and the server 
// console.log(Images.find().count());

// SECURITY on Images collection
Images.allow({
	insert:function(userId, doc){ // this is the user id and the info for whatever you are posting to the DB
		if(Meteor.user()){// they are logged in 
			if(userId != doc.createdBy){ 
				return false;
			} else { // user is logged in, the image has the correct user id
				return true;
			}
		} else { // user not logged in 
			return false;
		}
	}, 
	remove:function(userId, doc){
		return true;
	}
})


