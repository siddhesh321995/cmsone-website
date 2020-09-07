const { MongoDBManager } = require('./../db-manager/manager');

const SessionManager = {
  /**
   * Inserts id into SESSION_COLLECTION
   * @param {string} sessionid uuid type id
   * @param {Function} onSuccess success doc inserted callback function
   * @param {Function} onFail failed callback for session doc insert
   */
  createSession: function createSession(sessionid, onSuccess, onFail) {
    var d1 = new Date();
    var time = d1.toUTCString();

    MongoDBManager.getInstance().insertDoc({
      sessionid: sessionid,
      starttime: time,
      endtime: null
    }, SessionManager.COLLECTION_NAME, onSuccess, onFail);
  },

  /**
   * Updates endtime for given sessionid in SESSION_COLLECTION
   * @param {string} sessionid uuid type id
   * @param {Function} onSuccess success doc inserted callback function
   * @param {Function} onFail failed callback for session doc insert
   */
  endSession: function endSession(sessionid, onSuccess, onFail) {
    var d1 = new Date();
    var time = d1.toUTCString();

    MongoDBManager.getInstance().updateOneDoc(SessionManager.COLLECTION_NAME, {
      sessionid: sessionid
    }, {
      endtime: time
    }, onSuccess, onFail);
  },

  /**
   * Sets given collection name for session mgmnt activities
   * @param {string} collName Collection name for session
   */
  setCollectionName: (collName) => {
    SessionManager.COLLECTION_NAME = collName
  },

  COLLECTION_NAME: 'session'
};


module.exports = SessionManager;