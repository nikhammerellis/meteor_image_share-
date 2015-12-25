//Routing with iron:router 
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
  // render a template 
  this.render('welcome', {
    // to a layout template
    to: "main"
  }); 
});  

// Main app page 
Router.route('/images', function(){
  this.render('navbar', {
    to: "navbar"
  }); 
  this.render('images', {
    to: "main"
  });
  // Allows the modal template to render
  this.render('image_add_form', {
    to: "image_add_form"
  });
});  

// Routing to show a single image 
Router.route('/image/:_id', function(){
  this.render('navbar', {
    to: "navbar"
  }); 
  this.render('image', {
    to: "main", 
    data:function(){
      // this.params is the incoming parameter with the route, as in a single documents id 
      return Images.findOne({_id: this.params._id}); 
    }
  });
});

/*
// Router to show the modal window 
Router.route('/images/image_add_form', function(){
  this.render('image_add_form', {
    to: "modal"
  });
});
*/