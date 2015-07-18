/**
 * Created by Kira on 7/16/15.
 */

Meteor.publish('allActivities', function() {
    return Activity.find();
});

Meteor.publish('activity', function(option) {
    return Activity.find({}, option);
});