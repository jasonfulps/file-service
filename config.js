module.exports = {
    server: {
        port: '5000'
    },
    mongoURI: 'mongodb://localhost:27017/fileserver',
    authentication: {
        expiresIn: '1d',
        secretOrPrivateKey: 'DEVKEY',
        session: false
    },
    validation: {
        registration: {
            password: {
                length: {
                    min: 6,
                    max: 30
                }
            }
        }
    }
};