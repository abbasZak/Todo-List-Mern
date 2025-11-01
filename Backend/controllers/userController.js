const getUser = (req, res) => {
    res.status(200).json({ message: "Hello Abbas" });
};

module.exports = { getUser };
