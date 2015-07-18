/**
 * Created by Kira on 7/17/15.
 */

Template.activityDetail.helpers({
    buttonValue: function() {
        if (this.sponsor == Meteor.userId()) {
            return "撤销活动";
        }
        if (_.include(this.participator, Meteor.userId())) {
            return "退出活动";
        } else {
            return "申请加入";
        }
    },

    state: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth()+1);
        if (month < 10) month = "0" + month;
        var day = now.getDate();
        now = year + "-" + month + "-" + day;
        if (now > this.time) {
            return "已过期"
        } else {
            return "进行中";
        }
    }
});

Template.activityDetail.events({
    'click .modal-footer .btn-primary': function(e) {
        e.preventDefault();
        var value = $(e.target).text();
        var activityId = this._id;
        if (value == "申请加入") {
            Meteor.call('joinActivity', activityId, function(error, result) {
                if (error) {
                    alert(error.reason);
                    throw new Meteor.Error(error);
                }
                else {
                    $("#" + activityId).modal('hide');
                }
            });
        } else if (value == "退出活动") {
            Meteor.call('quitActivity', activityId, function(error, result) {
                if (error) throw new Meteor.Error(error);
                else {
                    $("#" + activityId).modal('hide');
                }
            });
        } else if (value == "撤销活动") {
            Meteor.call('deleteActivity', activityId, function(error, result) {
                if (error) throw new Meteor.Error(error);
                else {
                    window.location.replace('/');
                }
            });
        }
    }
});