module.exports = {
    env:'local',
    db:{
		host: 'localhost' || process.env.DB_HOST,
    	user: 'root' || process.env.DB_USER,
    	password: '' || process.env.DB_PASSWORD,
    	database: 'makestories' || process.env.DB_DATABASE,
		port:'3306' || process.env.PORT,
	},
	port: 3000 || process.env.PORT,
	secret: 'ph4fga937tgo7ui6thybq3nwyhzsxuhyza364u8' || process.env.SECRET
}