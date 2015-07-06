/**
 * Created by Sundara on 5/27/15.
 */
Meteor.publish("roomMessages", function(roomId) {
    return Messages.find({room: roomId});
});

Meteor.publish("roomData", function(room_name) {
    return Rooms.find({name: room_name});
});

Meteor.publish("allRooms", function() {
    return Rooms.find();
});

Meteor.publish("roomUsers", function(roomId) {
    return RoomUsers.find({room: roomId});
});



Messages.allow({
    'insert': function() {
        return true;
    }
});
Rooms.allow({
    'insert': function() {
        return true;
    }
});
RoomUsers.allow({
    'insert': function() {
        return true;
    },
    'update': function() {
        return true;
    },
    'remove': function() {
        return true;
    }
});