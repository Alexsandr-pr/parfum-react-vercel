function filePath(path) {
    return  function cors(req, res, next) {
        req.pathStatic = path
        next();
    }
}

module.exports = filePath
