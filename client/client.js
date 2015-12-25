  // Build an infinite scroll
  Session.set("imageLimit", 8);
  lastScrollTop = 0;
  $(window).scroll(function(event){ // this gets fired when the scroll event happens 
    // test if we are at the bottom of the window (scrolled all the way down)
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
      // Where are we in the page? 
      var scrollTop = $(this).scrollTop();

      // test if we are going down 
      if(scrollTop > lastScrollTop){
        // yes we are heading down
          Session.set("imageLimit", Session.get("imageLimit") + 4);

      }
      lastScrollTop = scrollTop;
    }
  });

  // Configure the accounts system to include a username field 
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

  // Helper that retrieves all images
  Template.images.helpers({

    // Find all images, sort by date first, then by rating
    images:function(){
      if(Session.get("userFilter")){ // they set a filter 
        //Find images using a mongo filter 
        return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating: -1}});
      } else {
        // Display all images 
        return Images.find({}, {sort:{createdOn: -1, rating: -1}, limit: Session.get("imageLimit")});
      }
    },
    filtering_images:function(){
      if(Session.get("userFilter")){
        return true;
      } else {
        return false;
      }
    },
    getFilterUser:function(){
      if(Session.get("userFilter")){
        var user = Meteor.users.findOne({
          _id: Session.get("userFilter")
        });
        return user.username;
      } else {
        return false;
      }
    },
    // Pass getUser the createdBy user_id from the template
    getUser:function(user_id){
      var user = Meteor.users.findOne({_id: user_id});
      if(user){
        return user.username;
      } else {
        return "unknown";
      }
    }
  });


  // the body tag is its own built in template 
  Template.body.helpers({
    username:function(){
      if(Meteor.user()){
        return Meteor.user().username;
        //return Meteor.user().emails[0].address
      } else {
        return "unknown user";
      }
    }
  });


  // event helpers for the images template
  Template.images.events({
    /*
    'click .js-image':function(event){
      $(event.target).css("width", "50px");//changes size of image on click
    },
    */
    // Event Method to delete an image
    'click .js-del-image':function(event){
      // Set the image_id variable
      var image_id = this._id; 
      // Uses jQuery to slowly hide the image before removing it from the collection 
      $("#"+image_id).hide('slow', function(){
        Images.remove({"_id": image_id});
      })
    },
    // Updates rating
    'click .js-rate-image':function(event){
      var rating = $(event.currentTarget).data("userrating");
      console.log(rating);
      var image_id = this.id;
      console.log(image_id);

      Images.update({_id: image_id}, // First argument for update is the id of the image you want to update 
                    {$set: {rating: rating} }); // Second argument is what information is being updated 
    },
    'click .js-show-image-form':function(event){
      $("#image_add_form").modal('show');
      //Router.go('/images/image_add_form');
    },
    'click .js-set-image-filter':function(event){
      // Session stores key value pairs, and is a reactive data source
      // 'this' is the data context for the template in which the event occured. 
      Session.set("userFilter", this.createdBy);
    },
    'click .js-unset-image-filter':function(event){
      Session.set("userFilter", undefined);
    }

  });

  // Template to add images via form 
  Template.image_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
      console.log("src: "+img_src+" alt: "+img_alt);
      if(Meteor.user()){
        Images.insert({
          img_src: img_src,
          img_alt: img_alt,
          createdOn: new Date(),
          createdBy: Meteor.user()._id
        });
      }
      $("#image_add_form").modal('hide');
      return false;
    }
  });