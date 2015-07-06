if (Meteor.isClient) {
    Session.setDefault('error', 0);

    Template.register.events({
        //handle form submission
        'submit form': function(event, template){
            event.preventDefault();
            var usernameVar = template.find('#register-username').value;
            var passwordVar = template.find('#register-password').value;
            var confirmPasswordVar = template.find('#register-confirm-password').value;

            if(passwordVar===confirmPasswordVar) {
                Accounts.createUser({username: usernameVar, password: passwordVar}, function(err) {
                    if (err) {
                        // handle error
                        Session.set('error', err.reason);
                    } else {
                        // examine result
                        Session.set('error', 0);
                        Router.go('/');
                    }
                });
            }
            else {
                Session.set('error', "Passwords don't match.");
            }

        }
    });

    Template.register.helpers({
       error: function(){
           return Session.get('error');
       }
    });

    Template.login.events({
       'submit form': function(event, template){
           event.preventDefault();
           var usernameVar = template.find('#login-username').value;
           var passwordVar = template.find('#login-password').value;
           Meteor.loginWithPassword(usernameVar, passwordVar, function(err) {
               if(err) {
                   Session.set('error', err.reason);
               }
               else {
                   Session.set('error', 0);
                   Router.go('/');
               }
           });
       }
    });

    Template.login.helpers({
        error: function(){
            return Session.get('error');
        }
    });

    Template.chat.helpers({
       messages: function() {
           return Messages.find({}, {sort: {time: 1}});
       }
    });

    Template.chat.events({
       'keydown input#message': function(event) {
           if(event.which == 13) {
               var messageElement = document.getElementById('message');
               console.log("Send Chat: "+messageElement.value);
               Meteor.call('submitChat', messageElement.value, function(err, result) {
                   if(err) {

                   }
                   else {
                       if(result) {
                            //success!
                           messageElement.value = '';
                       }
                       else {
                           // Invalid message
                       }
                   }
               });
           }
       }
    });

    Template.message.rendered = function() {
        var chatDiv = document.getElementById('chatbox');
        chatDiv.scrollTop = chatDiv.scrollHeight;
    };

    Template.home.events({
        'submit form': function(event) {
            event.preventDefault();

        }

    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({
        submitChat: function(text) {
            if(text!=='') {
                Messages.insert({
                    name: Meteor.user().username,
                    message: text,
                    time: Date.now()
                });
                return true;
            }
            else {
                return false;
            }

        },
        joinRoom: function(roomName) {
            var room = Rooms.find({name: roomName});
            if(room) {
                Rooms.update({name: roomName}, {$push: {users: Meteor.user().username} });
            }
            else {
                room = {
                    name: roomName,
                    messages: [
                        {
                            name:"Admin",text:"-- Room created --",time:Date.now()
                        }
                    ],
                    users: [Meteor.user().username],
                    createdOn: Date.now()
                };
                Rooms.insert(room);
            }
        }
    });
}

/*Router.onBeforeAction(function() {
    if (! Meteor.userId()) {
        this.redirect('/login');
    } else {
        console.log("Has user ID: "+Meteor.userId());
        this.next();
    }
}, {except: ['login','register']});*/
