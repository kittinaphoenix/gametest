//const path = require('path');
const User = require('../models/user');
const Timeline = require('../models/timeline');
const Dialog = require('../models/dialog');

const openaiModule = require("../services/openai");
//const TTSModule = require('../services/tts');

exports.getUserTimeline = async (req, res) => {
    try {
      const userId = req.query.userId;
      const user = await User.findOne({ _id: userId }).populate('timelines');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const timelines = user.timelines;
      const timelineIds = timelines.map((timeline) => timeline._id);
      const timelinesFound = await Timeline.find({ _id: { $in: timelineIds } });
      res.status(200).json(timelinesFound);
    } catch (err) {
      res.status(500).json({ error: err });
    }
};
exports.doDialog = async (req, res) => {
  const userId = req.query.userId;
  const dialogInput = req.query.dialog;
  const dialogTo = req.query.to;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dialogResponse = await generateDialog(user,dialogInput,dialogTo);

    //const audioResponse = await TTSModule.saveAudio(user.nickname, dialogInput, user.actualTarget, dialogResponse);

    var result = {
      dialogInput:dialogInput,
      actualTarget:user.actualTarget,
      dialogResponse:dialogResponse,
      //dialogResponseAudio:audioResponse,
    }

    const dialog = new Dialog({
      userName: user.nickname,
      userDialog: dialogInput,
      answerName: dialogTo,
      answerDialog: dialogResponse
    });
    const savedDialog = await dialog.save();

    

    res.status(200).json(result);


  } catch (err) {
    res.status(500).json({ error: err });
  }
}
async function generateDialog(user, dialogInput,dialogTo) {
  const response = await openaiModule.getDialog(user, dialogInput, dialogTo);
  return response;
}
exports.homeSite = async (req, res) => {
  try {
    res.render('../views/home');
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getGame = async (req, res) => {
  try {
    res.render('../views/game/gamecontainer');
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user with the provided username
    const user = await User.findOne({ username });

    if (!user) {
      // Return error if user not found
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare provided password with hashed password
    //const isValidPassword = await bcrypt.compare(password, this.password);
    var isValidPassword = false;
    if (user.password == password) isValidPassword = true;

    if (!isValidPassword) {
      // Return error if password is invalid
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Return success response if login credentials are valid
    res.status(200).json({ success:true, userid:user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
