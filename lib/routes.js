/**
 * Created by Sundara on 5/27/15.
 */

Router.plugin('auth', {
    except: [
    'login',
    'register'
    ]
});

Router.route('/', function () {

    this.render('home');
});
Router.route('/home', function () {
    this.redirect('/');
});
Router.route('/login', function() {
    this.render('login');
});
Router.route('/register', function() {
    this.render('register');
});
/*Router.route('/chat', function() {
    if(!Meteor.userId()) {
        this.redirect('/login');
    }
    this.render('chat');
});*/
Router.route('/logout', function() {
    if(Meteor.userId()) {
        Meteor.logout();
    }
    this.redirect('/login');
});




Router.route('/chatroom/:room_name', {
    name: 'room',
    waitOn: function() {
        return Meteor.subscribe('roomData', this.params.room_name);
    },
    data: function() {
        var room = Rooms.find({name:this.params.room_name});
        return {room: room};
    },
    action: function() {
        Session.set('userRoomId', this.params._id);
        Meteor.subscribe('roomUsers', this.params._id);
        this.render('room');
    },
    unload: function() {
        var roomUserId = Session.get('userRoomId');
        RoomUsers.remove({_id : roomUserId});
    }
});