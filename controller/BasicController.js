/**
|----------------------------------------------
| Basic Controller
|----------------------------------------------
| Holds all basic operations
|----------------------------------------------
*/
const callbacks = require('../function/index.js');
const Country = require('../database/models/').Country;
const State = require('../database/models/').State;
const LgaData = require('../database/models/').Lga;
const Event = require('../database/models/').Event;
const Sermon = require('../database/models/').Sermon;
const Preaching = require('../database/models/').Preaching;
const moment = require('moment');

class BasicController {

  // get countries
  static getCountries(req, res) {
    try {
      Country.findAll({}).then(result => {
        if (result.length > 0) {
          var countries = []
          for (var i = 0; i < result.length; i++) {
            countries.push(result[i].dataValues);
          }
          return res.status(200).json(countries)
        } else {
          return res.sendStatus(400);
        }
      }).catch(err => {
        return res.sendStatus(err);
      })
    } catch (e) {
      return res.sendStatus(500);
    }
  }

  // get specific states
  static getSpecificStates(req, res) {
    try {
      var country_id = req.params.id;

      if (country_id != undefined && country_id != null) {
        State.findAll({
          where: {
            country_id: country_id
          }
        }).then(result => {
          if (result.length > 0) {
            var states = [];
            for (var i = 0; i < result.length; i++) {
              states.push(result[i])
            }
            return res.status(200).json(states);
          } else {
            return res.send(400);
          }
        }).catch(err => { return res.send(err) });
      } else {
        return res.status(203).json({ message: "Invalid request...." });
      }
    } catch (e) {
      return res.send(500);
    }
  }

  // get all states
  static getStates(req, res) {

    State.findAll({
      where: {
        country_id: 160
      }
    }).then(result => {
      if (result.length > 0) {
        var values = [];

        for (var i = 0; i < result.length; i++) {
          values.push(result[i].dataValues)
        }

        return res.status(200).json(values)
      } else {
        return res.status(203).json({ message: "No state found." });
      }
    }).catch(err => {
      return res.send(err);
    })
  }

  // get all states
  static getMobileStates(req, res) {

    State.findAll({
      where: {
        country_id: 160
      }
    }).then(result => {
      if (result.length > 0) {
        return res.status(200).json({data:result});
      } else {
        return res.status(203).json({ message: "No state found." });
      }
    }).catch(err => {
      return res.send(err);
    })
  }

  // get lga
  static getLga(req, res) {
    try {
      var state_id = req.params.id;

      if (state_id != null && state_id != undefined) {
        LgaData.findAll({
          where: {
            state_id: state_id
          }
        }).then(result => {
          if (result.length > 0) {
            var lgas = []
            for (var i = 0; i < result.length; i++) {
              lgas.push(result[i].dataValues);
            }

            return res.status(200).json(lgas);
          } else {
            return res.status(203).json({ message: "Sorry, no record found." });
          }
        }).catch(err => { return res.send(err) });
      } else {
        return res.status(203).json({ message: "Invalid request...." });
      }

      return;
    } catch (e) {
      return res.send(500);
    }
  }

  // get state by lga
  static getLgaState(req, res){
    try {
      var lga_id = req.params.id;

      if (lga_id != null && lga_id != undefined) {
        LgaData.findAll({
          include:[{
            model:State,
            attributes:['id', 'state']
          }],
          where: {
            id: lga_id
          }
        }).then(result => {
          if (result.length > 0) {
            var lgas = []
            for (var i = 0; i < result.length; i++) {
              var fomartted = {
                lga:result[i].dataValues.lga,
                state_id:result[i].dataValues.State.id,
                state:result[i].dataValues.State.state
              }
              lgas.push(fomartted);
            }

            return res.status(200).json(lgas);
          } else {
            return res.status(203).json({ message: "Sorry, no record found." });
          }
        }).catch(err => { return res.send(err) });
      } else {
        return res.status(203).json({ message: "Invalid request...." });
      }

      return;
    } catch (e) {
      return res.send(500);
    }
  }
  // get state and places
  static getStateWithLgas(req, res) {
    try {
      State.findAll({
        include: [
          {
            model: LgaData,
          }
        ],
        where: {
          country_id: 160
        }
      }).then(result => {
        if (result.length > 0) {
          return res.status(200).json({ data: result });
        } else {
          return res.status(203).json({ message: "Sorry, no record found." });
        }
      }).catch(err => { return res.send(err); });

      return;
    } catch (e) {
      return res.send(500);
    }
  }

  /**
   * Fetch Events
   */
  static async fetchEvents(req, res){
    try{
      // validate access
        Event.findAll({
          order: [['createdAt', 'DESC']]
        }).then(event=>{
          // collect data
          let data = [];
          for (var i = 0; i < event.length; i++) {
            event[i].dataValues.postTime = moment(event[i].createdAt, "YYYY-MM-DD h:mm:ss:a").fromNow();
            data.push(event[i]);
          }
          // return record
          return res.status(200).json({data:data});
        }).catch(err=>{
          return res.status(203).json({
            error:true,
            message:err.message
          });
        });
    }catch(e){
      return res.status(203).json({
        error:true,
        message:e.message
      });
    }
  }

  /**
   * fetch all Sermons
   */
  static fetchSermons(req, res) {
    try {

        Sermon.findAll({
          order: [
            ['id', 'DESC']
          ]
        })
            .then(result => {

              var sermonArr = [];
              for (var i = 0; i < result.length; i++) {
                var sermonObj = {
                  id: result[i].dataValues.id,
                  title: result[i].dataValues.title,
                  preacher: result[i].dataValues.preacher,
                  video: result[i].dataValues.video,
                  created_at: moment(result[i].dataValues.createdAt).format('Do-MMM-YYYY')
                };
                sermonArr.push(sermonObj);
              }

              return res.status(200).json({ error: false, data: sermonArr, message: '' });
            })
            .catch(err => {
              return res.status(203).json({
                error: true,
                message: "Failed to fetch record"
              });
            });
    } catch (e) {
      return res.sendStatus(500);
    }
  }

  /**
   * fetch all Preachings
   */
  static fetchPreachings(req, res) {
    try {

      Preaching.findAll({
        order: [
          ['id', 'DESC']
        ]
      })
          .then(result => {
            var preachingArr = [];
            for (var i = 0; i < result.length; i++) {
              var preachingObj = {
                id: result[i].dataValues.id,
                title: result[i].dataValues.title,
                preacher: result[i].dataValues.preacher,
                video_url: result[i].dataValues.video_url,
                video_key: result[i].dataValues.video_key,
                created_at: moment(result[i].dataValues.createdAt).format('Do-MMM-YYYY')
              };
              preachingArr.push(preachingObj);
            }

            return res.status(200).json({ error: false, data: preachingArr, message: '' });
          })
          .catch(err => {
            return res.status(203).json({
              error: true,
              message: "Failed to fetch record"
            });
          });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
}

module.exports = BasicController;