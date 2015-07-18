/**
 * Created by Kira on 7/16/15.
 */

ownsDocument = function(userId, doc) {
    return doc && doc.sponsor === userId;
}