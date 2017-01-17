module.exports = [
	{
		namespace: 'faker',
		method: 'GET',
		path: '/widget2',
		fun: function (req, res) {
			res.json(200, { status: 'pending' });
		}
	}
];
