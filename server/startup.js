//If we run meteor reset, this will fill the database with 22 example pictures for testing purposes 
Meteor.startup(function(){
	if (Images.find().count() == 0) {
		for(var i = 1; i < 23; i++){
			Images.insert(
				{
					img_src:"img_"+i+".jpg",
					img_alt:"image number "+i
				}
			);
		}
		console.log("startup.js says: "+Images.find().count());	
	};
});
