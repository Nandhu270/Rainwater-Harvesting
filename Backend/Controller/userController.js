const User = require('../Models/userModel')

const saveData = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user)
      return res.status(409).json({
        msg: "User Already Exist",
      });
    const data = await User.create(req.body);
    res.status(201).json({
      msg: "Registered successFully",
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      msg: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ msg: "User Not Found" });
    if (user.password !== password)
      return res.status(401).json({ msg: "Invalid Password" });
    res.status(200).json({
      msg: "Login SuccessFul",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.msg,
    });
  }
};

module.exports = {saveData, login}