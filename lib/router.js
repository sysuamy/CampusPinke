/**
 * Created by Sysu on 2015/7/10.
 */



Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

ActivityListController = RouteController.extend({
    template: 'activityList',
    increment: 4,
    activitiesLimit: function() {
        return parseInt(this.params.activityCounter) || this.increment;
    },
    findOptions: function() {
        return {sort: {time: -1}, limit: this.activitiesLimit()};
    },
    activitiesSub: function() {
        return Meteor.subscribe('activity', this.findOptions());
    },
    activities: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth()+1);
        if (month < 10) month = "0" + month;
        var day = now.getDate();
        now = year + "-" + month + "-" + day;

        return Activity.find({time: {$gte: now}}, this.findOptions());
    },
    data: function() {
        var hasMore = this.activities().count() === this.activitiesLimit();
        var nextPath = this.route.path({activityCounter: this.activitiesLimit() + this.increment});
        return {
            activities: this.activities(),
            ready: this.activitiesSub().ready(),
            nextPath: hasMore ? nextPath : null
        }
    }
});

Router.route('/:activityCounter?', {
    name: 'activityList'
});

Router.route('/activity/create', {
    name: 'activityCreate'
});

JoinedController = RouteController.extend({
    template: 'joined',
    increment: 4,
    activitiesLimit: function() {
        return parseInt(this.params.joinedActivityCounter) || this.increment;
    },
    findOptions: function() {
        return {sort: {time: -1}, limit: this.activitiesLimit()};
    },
    activitiesSub: function() {
        return Meteor.subscribe('activity', this.findOptions());
    },
    activities: function() {
        var userId = Meteor.userId();
        return Activity.find({participator: {$in: [userId]}}, this.findOptions());
    },
    data: function() {
        var hasMore = this.activities().count() === this.activitiesLimit();
        var nextPath = this.route.path({joinedActivityCounter: this.activitiesLimit() + this.increment});
        return {
            activities: this.activities(),
            ready: this.activitiesSub().ready(),
            nextPath: hasMore ? nextPath : null
        }
    }
});

Router.route('/user/log/joined/:joinedActivityCounter?', {
    name: 'joined'
});

SponsoredController = RouteController.extend({
    template: 'sponsored',
    increment: 4,
    activitiesLimit: function() {
        return parseInt(this.params.sponsoredActivityCounter) || this.increment;
    },
    findOptions: function() {
        return {sort: {time: -1}, limit: this.activitiesLimit()};
    },
    activitiesSub: function() {
        return Meteor.subscribe('activity', this.findOptions());
    },
    activities: function() {
        var userId = Meteor.userId();
        return Activity.find({sponsor: userId}, this.findOptions());
    },
    data: function() {
        var hasMore = this.activities().count() === this.activitiesLimit();
        var nextPath = this.route.path({sponsoredActivityCounter: this.activitiesLimit() + this.increment});
        return {
            activities: this.activities(),
            ready: this.activitiesSub().ready(),
            nextPath: hasMore ? nextPath : null
        }
    }
});

Router.route('/user/log/sponsored/:sponsoredActivityCounter?', {
    name: 'sponsored'
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction('dataNotFound', {only: 'activityEdit'});
Router.onBeforeAction(requireLogin, {only: 'activityCreate'});