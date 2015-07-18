/**
 * Created by Kira on 7/16/15.
 */

Activity = new Mongo.Collection('Activity');

Meteor.methods({
    activityInsert: function(activityAttributes) {
        check(Meteor.userId(), String);
        check(activityAttributes, {
            title: String,
            type: String,
            time: String,
            location: String,
            max_number: Number,
            contact_way: String,
            detail: String
        });

        var errors = validateActivity(activityAttributes);

        if (errors.title) {
            throw new Meteor.Error('invalid-post', "请输入题目");
        }

        if (errors.type) {
            throw new Meteor.Error('invalid-post', "请选择活动类型");
        }

        if (errors.time) {
            throw new Meteor.Error('invalid-post', "请选择活动时间");
        }

        if (errors.location) {
            throw new Meteor.Error('invalid-post', "请输入活动地点");
        }

        if (errors.max_number) {
            throw new Meteor.Error('invalid-post', "请输入邀请人数");
        }

        if (errors.contact_way) {
            throw new Meteor.Error('invalid-post', "请输入联系方式");
        }

        if (errors.detail) {
            throw new Meteor.Error('invalid-post', "请输入活动内容");
        }

        var user = Meteor.user();
        var activity = _.extend(activityAttributes, {
            sponsor: Meteor.userId(),
            sponsorNickName: user.profile.nickname,
            current_number: 0,
            participator: []
        });

        var activityId = Activity.insert(activity);

        return {
            _id : activityId
        };
    },

    joinActivity: function(activityId) {
        check(activityId, String);
        check(this.userId, String);

        var activity = Activity.findOne(activityId);
        if (!activity) {
            throw new Meteor.Error('invalid', "Activity not found");
        }

        if (_.include(activity.participator, this.userId)) {
            throw new Meteor.Error('invalid', "Already participated");
        }

        if (activity.current_number >= activity.max_number) {
            throw new Meteor.Error('invalid', "人数已满!");
        }

        if (activity.sponsor == this.userId) {
            throw new Meteor.Error('invalid', "You are the sponsor of this activity");
        }

        var affected = Activity.update({
            _id: activityId,
            participator: {$ne: this.userId}
        }, {
            $addToSet: {participator: this.userId},
            $inc: {current_number: 1}
        });

        if (! affected) {
            throw new Meteor.Error('invalid', "You weren't able to join this Activity");
        }

    },

    quitActivity: function(activityId) {
        check(activityId, String);
        check(this.userId, String);

        var activity = Activity.findOne(activityId);
        if (!activity) {
            throw new Meteor.Error('invalid', "Activity not found");
        }

        if (!_.include(activity.participator, this.userId)) {
            throw new Meteor.Error('invalid', "Not participated");
        }

        if (activity.sponsor == this.userId) {
            throw new Meteor.Error('invalid', "You are the sponsor of this activity");
        }

        var affected = Activity.update({
            _id: activityId,
            participator: {$in: [this.userId]}
        }, {
            $pull: {participator: this.userId},
            $inc: {current_number: -1}
        });

        if (! affected) {
            throw new Meteor.Error('invalid', "You weren't able to quit this Activity");
        }
    },

    editActivity: function(activityAttributes) {
        check(this.userId, String);
        check(activityAttributes, {
            title: String,
            type: String,
            time: String,
            location: String,
            max_number: Number,
            contact_way: Number,
            detail: String
        });

        var errors = validateActivity(activityAttributes);

        if (errors.title) {
            throw new Meteor.Error('invalid-post', "请输入题目");
        }

        if (errors.type) {
            throw new Meteor.Error('invalid-post', "请选择活动类型");
        }

        if (errors.time) {
            throw new Meteor.Error('invalid-post', "请选择活动时间");
        }

        if (errors.location) {
            throw new Meteor.Error('invalid-post', "请输入活动地点");
        }

        if (errors.max_number) {
            throw new Meteor.Error('invalid-post', "请输入邀请人数");
        }

        if (errors.contact_way) {
            throw new Meteor.Error('invalid-post', "请输入联系方式");
        }

        if (errors.detail) {
            throw new Meteor.Error('invalid-post', "请输入活动内容");
        }

        if (activityAttributes.sponsor != this.userId) {
            throw new Meteor.Error('invalid', "You are not the sponsor of this activity");
        }

        var affected = Activity.update({
            _id: activityAttributes._id,
            sponsor: this.userId
        }, {
            $set: {
                title: activityAttributes.title,
                type: activityAttributes.type,
                time: activityAttributes.time,
                location: activityAttributes.location,
                max_number: activityAttributes.max_number,
                contact_way: activityAttributes.contact_way,
                detail: activityAttributes.detail
            }
        });

        if (! affected) {
            throw new Meteor.Error('invalid', "You weren't able to edit this Activity");
        }
    },

    deleteActivity: function(activityId) {
        check(this.userId, String);
        check(activityId, String);

        var activity = Activity.findOne(activityId);
        if (!activity) {
            throw new Meteor.Error('invalid', "Activity not found");
        }

        if (activity.sponsor != this.userId) {
            throw new Meteor.Error('invalid', "You are not the sponsor of this activity");
        }

        var removed = Activity.remove(activityId);

        if (!removed) {
            throw new Meteor.Error('invalid', "You weren't able to delete this Activity");
        }

    }
});


Activity.allow({
    update: function(userId, activity) {
        return ownsDocument(userId, activity);
    },
    remove: function(userId, activity) {
        return ownsDocument(userId, activity);
    }
});

Activity.deny({
    update: function(userId, activity, fieldNames, modifier) {
        var errors = validateActivity(modifier.$set);
        return errors;
    }
});

validateActivity = function(activity) {
    var errors = {};

    if (!activity.title) {
        errors.title = "请输入标题";
    }

    if (!activity.type) {
        errors.type = "请选择类型";
    }
    if (!activity.time) {
        errors.time = "请选择时间";
    }
    if (!activity.location) {
        errors.location = "请输入地点";
    }
    if (!activity.max_number) {
        errors.max_number = "请输入邀请人数";
    }
    if (!activity.contact_way) {
        errors.contact_way = "请输入联系方式";
    }
    if (!activity.detail) {
        errors.detail = "请输入详细描述";
    }

    return errors;
}